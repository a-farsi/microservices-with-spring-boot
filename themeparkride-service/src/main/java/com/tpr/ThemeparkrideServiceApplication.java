package com.tpr;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.tpr.entities.ThemeParkRide;
import com.tpr.repository.ThemeParkRideRepository;

@SpringBootApplication
public class ThemeparkrideServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ThemeparkrideServiceApplication.class, args);
	}

	@Bean
	public CommandLineRunner sampleData(ThemeParkRideRepository repository) {
		return args -> {
			repository.save(new ThemeParkRide(null, "Rollercoaster", "Train ride that speeds you along.", 5, 3));
			repository.save(new ThemeParkRide(null, "Log flume", "Boat ride with plenty of splashes.", 3, 2));
			repository.save(new ThemeParkRide(null, "Teacups", "Spinning ride in a giant tea-cup.", 2, 4));
			repository.save(new ThemeParkRide(null, "Ferris Wheel", "Giant rotating wheel with panoramic views.", 2, 5));
			repository.save(new ThemeParkRide(null, "Drop Tower", "Vertical tower that drops you at high speed.", 4, 2));
			repository.save(new ThemeParkRide(null, "Haunted Mansion", "Spooky ride through a ghost-filled house.", 3, 4));
		};
	}

}
