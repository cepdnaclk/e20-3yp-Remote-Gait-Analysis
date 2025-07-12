package com._yp.gaitMate;

import com._yp.gaitMate.config.CorsProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
@EnableConfigurationProperties(CorsProperties.class)
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
public class GaitApplication {

	public static void main(String[] args) {
		SpringApplication.run(GaitApplication.class, args);
	}

}
