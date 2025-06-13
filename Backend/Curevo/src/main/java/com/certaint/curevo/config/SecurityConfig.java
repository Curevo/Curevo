package com.certaint.curevo.config;

import com.certaint.curevo.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import static org.springframework.security.config.Customizer.withDefaults;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;


    // Public endpoints - no JWT filter, permit all those listed
    @Bean
    @Order(1)
    public SecurityFilterChain publicFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .securityMatcher(
                        "/api/auth/**",

                        "/api/customers/register",
                        "/api/customers/verify-otp",
                        "/api/customers/add",

                        "/api/cart/**",

                        "/",
                        "/healthz",

                        "/api/doctors/get/**",
                        "/api/doctors/specializations",
                        "/api/doctors/search",



                        "/api/products/{productId}/store/**",
                        "/api/products/products",


                        "/api/executives/register",
                        "api/executives/verify-and-save"
                )
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        return http.build();
    }

    // Protected endpoints - JWT filter applied, roles checked here
    @Bean
    @Order(2)
    public SecurityFilterChain protectedChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(withDefaults())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/orders/**").hasRole("CUSTOMER")
                        .requestMatchers("/api/chat").hasRole("CUSTOMER")
                        .requestMatchers("/api/appointments/**").hasRole("CUSTOMER")
                        .requestMatchers("/api/customers/me").hasRole("CUSTOMER")
                        .requestMatchers("/api/customers/update/**").hasRole("CUSTOMER")
                        .requestMatchers("/api/payments/**").hasRole("CUSTOMER")
                        .requestMatchers("/api/appointments/**").hasRole("CUSTOMER")

                        .requestMatchers("/api/executives/**").hasRole("DELIVERY_EXECUTIVE")

                        .requestMatchers("/api/**").hasRole("ADMIN")

                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("https://curevo.vercel.app");
        config.addAllowedOrigin("http://localhost:5173");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

}
