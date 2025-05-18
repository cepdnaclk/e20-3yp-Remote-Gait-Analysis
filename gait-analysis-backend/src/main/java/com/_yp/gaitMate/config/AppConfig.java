package com._yp.gaitMate.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * Application-wide configuration for HTTP clients and other utilities.
 */
@Configuration
public class AppConfig {

    /**
     * Provides a reusable RestTemplate bean for synchronous HTTP calls.
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
