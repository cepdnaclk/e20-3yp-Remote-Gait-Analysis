package com._yp.gaitMate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class GaitApplication {

	public static void main(String[] args) {
		SpringApplication.run(GaitApplication.class, args);
	}

}
