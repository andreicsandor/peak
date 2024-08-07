package com.peak.maps;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.peak.maps", "com.peak.routes"})
public class MapsApplication {

	public static void main(String[] args) {
		SpringApplication.run(MapsApplication.class, args);
	}

}
