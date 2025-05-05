package com.tpr.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.tpr.entities.ThemeParkRide;
import com.tpr.repository.ThemeParkRideRepository;
import jakarta.validation.Valid;

@RestController
public class ThemeParkRideController {
	private final ThemeParkRideRepository themeParkRideRepository;

	public ThemeParkRideController(ThemeParkRideRepository themeParkRideRepository) {
		this.themeParkRideRepository = themeParkRideRepository;
	}

	@GetMapping("/")
	public String greeting() {
		return "Hello from Theme Park Ride App!";
	}

	@GetMapping(value = "/rides", produces = MediaType.APPLICATION_JSON_VALUE)
	public Iterable<ThemeParkRide> getRides() {
		return themeParkRideRepository.findAll();
	}

	@GetMapping(value = "/rides/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ThemeParkRide getRide(@PathVariable long id) {
		return themeParkRideRepository.findById(id).orElseThrow(
				() -> new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("Invalid ride id %s", id)));
	}

	@PostMapping(value = "/rides", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ThemeParkRide createRide(@Valid @RequestBody ThemeParkRide themeParkRide) {
		return themeParkRideRepository.save(themeParkRide);
	}
}