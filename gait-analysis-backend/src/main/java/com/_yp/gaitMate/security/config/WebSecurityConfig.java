package com._yp.gaitMate.security.config;

import com._yp.gaitMate.security.jwt.AuthTokenFilter;
import com._yp.gaitMate.security.model.AppRole;
import com._yp.gaitMate.security.model.Role;
import com._yp.gaitMate.security.model.User;
import com._yp.gaitMate.security.repository.RoleRepository;
import com._yp.gaitMate.security.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;
import java.util.Set;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {
    private final UserDetailsService userDetailsService;
    private final AuthenticationEntryPoint unauthorizedHandler;
    private final AuthTokenFilter authTokenFilter;

//    @Value("${client.domains.list[0]}")
    private final List<String> clientDomains = List.of("http://localhost:42000");

    @Bean
    public DaoAuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();

        authenticationProvider.setUserDetailsService(userDetailsService);
        authenticationProvider.setPasswordEncoder(passwordEncoder());

        return authenticationProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfiguration)
            throws Exception {
        return authConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // authenticate any request coming to the application
        http
                .cors(c -> c.configurationSource(corsConfigurationSource()))

                .csrf(AbstractHttpConfigurer::disable) // Disable CSRF entirely
                .exceptionHandling(
                        exception -> exception.authenticationEntryPoint(unauthorizedHandler))
                .sessionManagement(session
                        -> session.sessionCreationPolicy((SessionCreationPolicy.STATELESS)))

                .authorizeHttpRequests(
                        (requests) -> requests
                                .requestMatchers("/api/auth/user").authenticated()
                                .requestMatchers("/api/auth/**").permitAll()

                                .requestMatchers("/h2-console/**").permitAll()

                                .requestMatchers("/v3/api-docs/**").permitAll()
                                .requestMatchers("/swagger-ui/**").permitAll()
                                .requestMatchers("/swagger-ui.html").permitAll()

                                .requestMatchers("/api/public/**").permitAll()
                                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                                .requestMatchers("/api/clinic/**").hasRole("CLINIC")
                                .requestMatchers("/api/patient/**").hasRole("PATIENT")
                                .requestMatchers("/api/doctor/**").hasRole("DOCTOR")

                                .requestMatchers("/error/**").permitAll()
                                .anyRequest().authenticated())

                .authenticationProvider(authenticationProvider())

                // Allow frames from same origin (needed for H2 console)
                //.headers(headers -> headers
                //        .frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin)
                //)

                //http.formLogin(withDefaults()); - ➜ Adds UsernamePasswordAuthenticationFilter to the SecurityFilterChain
                //.httpBasic(withDefaults());  // ➜ Adds BasicAuthenticationFilter to the SecurityFilterChain

                .addFilterBefore(authTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


    // global security settings
    // specified paths are excluded from the security filter chain
    @Bean
    public WebSecurityCustomizer webSecurityCustomizer(){
        return (web -> web.ignoring().requestMatchers(
                "/configuration/ui",
                "/swagger-resources/**",
                "/configuration/security",
                "/swagger-ui.html",
                "/webjars/**"
        ));
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource(){
        CorsConfiguration configuration = new CorsConfiguration();

//        configuration.setAllowedOrigins(List.of("http://localhost:42000"));
        configuration.setAllowedOrigins(clientDomains);
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
