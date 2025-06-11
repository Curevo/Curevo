package com.certaint.curevo.service;

import com.certaint.curevo.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.apache.commons.text.similarity.LevenshteinDistance;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.certaint.curevo.entity.Doctor;
import com.certaint.curevo.enums.Specialization; // Ensure Specialization enum is correctly defined and imported
// Import the necessary DeepSeekService classes if you haven't already.
// import com.azure.ai.inference.models.ChatRequestMessage;
// import com.azure.ai.inference.models.ChatRequestSystemMessage;
// import com.azure.ai.inference.models.ChatRequestUserMessage;


@RequiredArgsConstructor
@Service
public class ChatService {

    private final DeepSeekService deepSeekService;
    private final DoctorRepository doctorRepository;

    private static final List<String> GENERAL_HEALTH_KEYWORDS = List.of(
            "symptom", "pain", "fever", "headache", "nausea", "cough", "vomiting",
            "sick", "health", "injury", "infection", "rash", "curevo", "disease", "medication", "treatment"
    );

    // Updated regex to be a bit more flexible for names, including "dr" or "doctor" prefixes
    private static final Pattern DOCTOR_NAME_PATTERN = Pattern.compile(
            "(?:dr\\.?|doctor)\\s+([a-zA-Z]+(?:\\s+[a-zA-Z]+)*)", Pattern.CASE_INSENSITIVE
    );


    public Map<String, Object> processUserQuery(Map<String, Object> payload) {
        String userMessage = (String) payload.get("message");
        String explicitIntent = (String) payload.get("intent");
        String lowerQuery = userMessage.toLowerCase(Locale.ROOT);
        System.out.println("Processing user query: " + userMessage + " with explicit intent: " + explicitIntent);

        // --- Handle explicit intents (from frontend quick actions or specific user inputs) ---
        if (explicitIntent != null) {
            switch (explicitIntent) {
                case "initial_doctor_query":
                    return createPromptSpecialtyOrName();
                case "find_doctor_by_specialty":
                    // IMPORTANT CHANGE HERE: Handle both specialty string and potential doctor name
                    String inputForSpecialtyMode = userMessage; // Use userMessage directly here

                    // 1. Try to extract doctor's name first if in findDoctorBySpecialty mode
                    Optional<String> doctorNameFromInput = extractDoctorName(inputForSpecialtyMode);
                    if (doctorNameFromInput.isPresent()) {
                        System.out.println("ChatService: Detected doctor name '" + doctorNameFromInput.get() + "' in find_doctor_by_specialty mode.");
                        return handleFindDoctorByName(doctorNameFromInput.get());
                    }

                    // 2. If no doctor name found, assume it's a specialty string
                    // Normalize the input string to match enum values
                    String normalizedSpecialtyInput = inputForSpecialtyMode.toUpperCase().replace(" ", "_");
                    System.out.println("ChatService: Attempting to find doctor by specialty: " + normalizedSpecialtyInput + " in find_doctor_by_specialty mode.");
                    return handleFindDoctorBySpecialty(normalizedSpecialtyInput);

                case "find_doctor_by_name":
                    String doctorName = (String) payload.get("doctor_name"); // This might be null if not explicitly set by frontend
                    // If payload.doctor_name is not set by frontend (e.g., direct user type), extract from message
                    if (doctorName == null || doctorName.isEmpty()) {
                        Optional<String> extractedName = extractDoctorName(userMessage);
                        if (extractedName.isPresent()) {
                            doctorName = extractedName.get();
                        } else {
                            // Fallback if no name found, though frontend should prevent this for findDoctorByName intent
                            return createTextResponse("Please provide a valid doctor's name.");
                        }
                    }
                    return handleFindDoctorByName(doctorName);
                case "general_health_query":
                    String healthAdvice = deepSeekService.getHealthResponse(userMessage);

                    Optional<String> extractedSpecialization = extractSpecialtyFromHealthAdvice(healthAdvice);

                    if (extractedSpecialization.isPresent()) {
                        System.out.println("ChatService: Locally extracted specialization: " + extractedSpecialization.get());
                        try {
                            Specialization specializationEnum = Specialization.valueOf(extractedSpecialization.get());
                            List<Doctor> doctors = doctorRepository.findBySpecialization(specializationEnum);

                            if (!doctors.isEmpty()) {
                                System.out.println("ChatService: Found " + doctors.size() + " doctors for specialization " + specializationEnum.name());
                                return createDoctorListResponse(
                                        healthAdvice + "\n\nBased on your symptoms, here are some " +
                                                extractedSpecialization.get().toLowerCase().replace("_", " ") + " specialists you might consider:",
                                        doctors
                                );
                            } else {
                                // If specialization found but no doctors for it
                                System.out.println("ChatService: No doctors found for locally extracted specialization " + specializationEnum.name());
                                return createTextResponse(
                                        healthAdvice + "\n\nI couldn't find any " +
                                                extractedSpecialization.get().toLowerCase().replace("_", " ") +
                                                " specialists at the moment. Please try searching for a different specialty or a doctor's name."
                                );
                            }
                        } catch (IllegalArgumentException e) {
                            // If extracted string didn't match an enum (shouldn't happen often if extractSpecialtyFromHealthAdvice is careful)
                            System.out.println("ChatService: Locally extracted specialization '" + extractedSpecialization.get() + "' did not match an enum. Error: " + e.getMessage());
                            return createTextResponse(healthAdvice + "\n\nI couldn't find a direct match for a specialist based on that. Can I help with anything else?");
                        }
                    } else {
                        // If no specialization could be extracted from the health advice
                        System.out.println("ChatService: No specific specialization could be extracted from health advice.");
                        return createTextResponse(healthAdvice + "\n\nI recommend consulting with a healthcare professional for a proper diagnosis. Would you like to find a doctor by name or specialty?");
                    }
                default:
                    break;
            }
        }


        // 1. Prioritize direct doctor name extraction from raw message (for 'general_query' intent or no intent)
        Optional<String> doctorNameFromNLU = extractDoctorName(lowerQuery);
        if (doctorNameFromNLU.isPresent()) {
            System.out.println("ChatService: Detected doctor name '" + doctorNameFromNLU.get() + "' from general query.");
            return handleFindDoctorByName(doctorNameFromNLU.get());
        }

        // 2. Prioritize specialization extraction from raw message (e.g., "find a dermatologist")
        Optional<String> specialtyStringFromNLU = extractSpecialty(lowerQuery);
        if (specialtyStringFromNLU.isPresent()) {
            System.out.println("ChatService: Detected specialization '" + specialtyStringFromNLU.get() + "' from general query.");
            return handleFindDoctorBySpecialty(specialtyStringFromNLU.get());
        }

        // 3. Check for general health keywords (if no doctor-finding intent detected)
        if (isGeneralHealthRelated(lowerQuery)) {
            payload.put("intent", "general_health_query");
            System.out.println("ChatService: Detected general health keywords. Recursing with general_health_query intent.");
            return processUserQuery(payload); // Recursive call to re-process with explicit intent
        }

        // 4. Default response if nothing matches
        System.out.println("ChatService: No specific intent detected. Returning default response.");
        return createTextResponse("I'm only able to assist with general health questions, or help you find doctors by specialization or name. Please rephrase your query or use the quick actions.");
    }

    // --- NEW HELPER METHOD TO EXTRACT SPECIALTY FROM AI'S GENERAL HEALTH ADVICE ---
    private Optional<String> extractSpecialtyFromHealthAdvice(String advice) {
        String lowerAdvice = advice.toLowerCase(Locale.ROOT);

        // This list should be comprehensive based on how DeepSeek tends to mention specializations
        // in its general advice. Map common keywords to your Specialization enum names.
        if (lowerAdvice.contains("dermatologist") || lowerAdvice.contains("skin")) return Optional.of("DERMATOLOGY");
        if (lowerAdvice.contains("cardiologist") || lowerAdvice.contains("heart")) return Optional.of("CARDIOLOGY");
        if (lowerAdvice.contains("neurologist") || lowerAdvice.contains("brain") || lowerAdvice.contains("nerve")) return Optional.of("NEUROLOGY");
        if (lowerAdvice.contains("oncologist") || lowerAdvice.contains("cancer")) return Optional.of("ONCOLOGY");
        if (lowerAdvice.contains("orthopedics") || lowerAdvice.contains("orthopedic") || lowerAdvice.contains("bones") || lowerAdvice.contains("joints")) return Optional.of("ORTHOPEDICS");
        if (lowerAdvice.contains("pediatrician") || lowerAdvice.contains("child")) return Optional.of("PEDIATRICS");
        if (lowerAdvice.contains("general physician") || lowerAdvice.contains("gp") || lowerAdvice.contains("general practitioner") || lowerAdvice.contains("family doctor") || lowerAdvice.contains("general practice")) return Optional.of("GENERAL_PRACTICE");
        if (lowerAdvice.contains("gynecologist") || lowerAdvice.contains("women's health") || lowerAdvice.contains("gynecology")) return Optional.of("GYNECOLOGY");
        if (lowerAdvice.contains("psychiatrist") || lowerAdvice.contains("psychiatry") || lowerAdvice.contains("mental health")) return Optional.of("PSYCHIATRY");
        if (lowerAdvice.contains("radiologist") || lowerAdvice.contains("radiology") || lowerAdvice.contains("x-ray") || lowerAdvice.contains("mri")) return Optional.of("RADIOLOGY");
        if (lowerAdvice.contains("surgeon") || lowerAdvice.contains("surgery") || lowerAdvice.contains("operation")) return Optional.of("SURGERY");
        if (lowerAdvice.contains("urologist") || lowerAdvice.contains("urology") || lowerAdvice.contains("urinary tract")) return Optional.of("UROLOGY");
        if (lowerAdvice.contains("gastroenterologist") || lowerAdvice.contains("gastroenterology") || lowerAdvice.contains("digestive system")) return Optional.of("GASTROENTEROLOGY");
        if (lowerAdvice.contains("endocrinologist") || lowerAdvice.contains("endocrinology") || lowerAdvice.contains("hormones") || lowerAdvice.contains("diabetes")) return Optional.of("ENDOCRINOLOGY");
        if (lowerAdvice.contains("pulmonologist") || lowerAdvice.contains("pulmonology") || lowerAdvice.contains("lungs") || lowerAdvice.contains("respiratory")) return Optional.of("PULMONOLOGY");
        // Add more specializations if DeepSeek's general response might mention them
        // For example:
        // if (lowerAdvice.contains("ophthalmologist") || lowerAdvice.contains("eye doctor")) return Optional.of("OPHTHALMOLOGY");
        // if (lowerAdvice.contains("otolaryngologist") || lowerAdvice.contains("ent doctor")) return Optional.of("OTOLARYNGOLOGY");

        return Optional.empty();
    }

    private boolean isGeneralHealthRelated(String query) {
        LevenshteinDistance distance = LevenshteinDistance.getDefaultInstance();
        return GENERAL_HEALTH_KEYWORDS.stream().anyMatch(keyword ->
                Arrays.stream(query.split("\\s+"))
                        .anyMatch(word -> distance.apply(word, keyword) <= 2)
        );
    }

    private Optional<String> extractDoctorName(String query) {
        Matcher matcher = DOCTOR_NAME_PATTERN.matcher(query);
        if (matcher.find()) {
            // Group 1 captures the name after "dr." or "doctor"
            return Optional.of(matcher.group(1).trim());
        }
        return Optional.empty();
    }

    private Optional<String> extractSpecialty(String query) {
        // This method is for direct user input like "find a dermatologist", not for parsing AI output.
        // It's still useful.
        if (query.contains("dermatologist") || query.contains("dermatology") || query.contains("skin")) return Optional.of("DERMATOLOGY");
        if (query.contains("cardiologist") || query.contains("cardiology") || query.contains("heart")) return Optional.of("CARDIOLOGY");
        if (query.contains("neurologist") || query.contains("neurology") || query.contains("brain") || query.contains("nerve")) return Optional.of("NEUROLOGY");
        if (query.contains("oncologist") || query.contains("oncology") || query.contains("cancer")) return Optional.of("ONCOLOGY");
        if (query.contains("orthopedics") || query.contains("orthopedic") || query.contains("bones") || query.contains("joints")) return Optional.of("ORTHOPEDICS");
        if (query.contains("pediatrician") || query.contains("pediatrics") || query.contains("child")) return Optional.of("PEDIATRICS");
        if (query.contains("general medicine") || query.contains("gp") || query.contains("family doctor") || query.contains("general practice")) return Optional.of("GENERAL_PRACTICE"); // Added general practice
        if (query.contains("gynecologist") || query.contains("gynecology") || query.contains("women's health")) return Optional.of("GYNECOLOGY");
        if (query.contains("psychiatrist") || query.contains("psychiatry") || query.contains("mental health")) return Optional.of("PSYCHIATRY");
        if (query.contains("radiologist") || query.contains("radiology") || query.contains("x-ray") || query.contains("mri")) return Optional.of("RADIOLOGY");
        if (query.contains("surgeon") || query.contains("surgery") || query.contains("operation")) return Optional.of("SURGERY");
        if (query.contains("urologist") || query.contains("urology") || query.contains("urinary tract")) return Optional.of("UROLOGY");
        if (query.contains("gastroenterologist") || query.contains("gastroenterology") || query.contains("digestive system")) return Optional.of("GASTROENTEROLOGY");
        if (query.contains("endocrinologist") || query.contains("endocrinology") || query.contains("hormones") || query.contains("diabetes")) return Optional.of("ENDOCRINOLOGY");
        if (query.contains("pulmonologist") || query.contains("pulmonology") || query.contains("lungs") || query.contains("respiratory")) return Optional.of("PULMONOLOGY");
        return Optional.empty();
    }

    private Map<String, Object> createTextResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("type", "text");
        response.put("message", message);
        return response;
    }

    private Map<String, Object> createDoctorListResponse(String message, List<Doctor> doctors) {
        Map<String, Object> response = new HashMap<>();
        response.put("type", "doctors_list");
        response.put("message", message);
        response.put("doctors", doctors);
        return response;
    }

    private Map<String, Object> createDoctorDetailsResponse(String message, Doctor doctor) {
        Map<String, Object> response = new HashMap<>();
        response.put("type", "doctor_details");
        response.put("message", message);
        response.put("doctor", doctor);
        return response;
    }

    private Map<String, Object> createPromptSpecialtyOrName() {
        Map<String, Object> response = new HashMap<>();
        response.put("type", "prompt_specialty_selection");
        response.put("message", "Are you looking for a specific specialist, or do you have a doctor's name in mind?");
        return response;
    }

    private Map<String, Object> handleFindDoctorBySpecialty(String specialtyString) {
        if (specialtyString == null || specialtyString.isEmpty()) {
            return createTextResponse("I need a specialization to find a doctor. Could you please specify?");
        }
        try {
            Specialization specialtyEnum = Specialization.valueOf(specialtyString.toUpperCase());
            List<Doctor> doctors = doctorRepository.findBySpecialization(specialtyEnum);

            if (!doctors.isEmpty()) {
                return createDoctorListResponse(
                        "Here are some " + specialtyString.toLowerCase().replace("_", " ") + " specialists:",
                        doctors
                );
            } else {
                return createTextResponse(
                        "I couldn't find any " + specialtyString.toLowerCase().replace("_", " ") + " specialists. Please try another specialty or a doctor's name."
                );
            }
        } catch (IllegalArgumentException e) {
            System.out.println("ChatService: Invalid specialization string encountered: " + specialtyString + ". Error: " + e.getMessage());
            return createTextResponse("I don't recognize that specialization. Please select from the provided options or try a different one.");
        }
    }

    private Map<String, Object> handleFindDoctorByName(String doctorName) {
        if (doctorName == null || doctorName.isEmpty()) {
            return createTextResponse("Please provide a doctor's name.");
        }
        Optional<Doctor> doctorOpt = doctorRepository.findByNameIgnoreCase(doctorName);
        if (doctorOpt.isPresent()) {
            return createDoctorDetailsResponse(
                    "Here are the details for Dr. " + doctorOpt.get().getName() + ":",
                    doctorOpt.get()
            );
        } else {
            return createTextResponse(
                    String.format("I couldn't find Dr. %s. Please check the spelling or try searching for a different doctor.", doctorName)
            );
        }
    }
}