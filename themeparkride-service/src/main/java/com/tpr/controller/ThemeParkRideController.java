package com.tpr.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.tpr.entities.ThemeParkRide;
import com.tpr.repository.ThemeParkRideRepository;
import jakarta.validation.Valid;

import java.util.Optional;

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

	@PutMapping(value = "/rides/{id}")
	public ThemeParkRide updateRide(@PathVariable Long id, @Valid @RequestBody ThemeParkRide themeParkRide) {
		Optional<ThemeParkRide> existingRide = themeParkRideRepository.findById(id);

		if (existingRide.isPresent()) {
			ThemeParkRide rideToUpdate = existingRide.get();
			rideToUpdate.setName(themeParkRide.getName());
			rideToUpdate.setDescription(themeParkRide.getDescription());
			rideToUpdate.setThrillFactor(themeParkRide.getThrillFactor());
			rideToUpdate.setVomitFactor(themeParkRide.getVomitFactor());

			return themeParkRideRepository.save(rideToUpdate);
		} else {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Ride not found");
		}
	}

	@DeleteMapping(value = "/rides/{id}")
	public void deleteRide(@PathVariable long id) {
		themeParkRideRepository.deleteById(id);
	}
}