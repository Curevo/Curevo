package com.certaint.curevo.service.provider;

import com.certaint.curevo.interfaces.ImageHostingProvider;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Map;

@Component
public class CloudinaryImageHosting implements ImageHostingProvider {

    private final Cloudinary cloudinary;

    public CloudinaryImageHosting(
            @Value("${spring.cloudinary.cloud-name}") String cloudName,
            @Value("${spring.cloudinary.api-key}") String apiKey,
            @Value("${spring.cloudinary.api-secret}") String apiSecret) {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret));
    }


    @Override
    public String uploadImage(MultipartFile file, String folderName) {
        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", folderName
            ));
            return uploadResult.get("secure_url").toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image", e);
        }
    }

    @Override
    public String deleteImage(String imageUrl) {
        try {
            // Extract public ID (folder/fileName) from the URL
            String publicId = imageUrl
                    .substring(imageUrl.lastIndexOf(".com/") + 5) // Removes base URL
                    .split("\\.")[0]; // Removes file extension

            Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            return result.toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete image", e);
        }
    }
}
