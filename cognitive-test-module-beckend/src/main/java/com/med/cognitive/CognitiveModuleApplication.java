package com.med.cognitive;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CognitiveModuleApplication {

	public static void main(String[] args) {
		try {
			SpringApplication.run(CognitiveModuleApplication.class, args);
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println("FATAL ERROR: " + e.getMessage());
			throw e;
		}
	}

}
