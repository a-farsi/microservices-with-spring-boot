package com.tpr.feign;

import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.tpr.exception.ResourceNotFoundException;
import com.tpr.repository.BookedRideRepository;
import com.tpr.repository.BookingRepository;
import com.tpr.entities.Booking;
import com.tpr.model.Customer;
import com.tpr.model.ThemeParkRide;

@RestController
public class BookingRestClient {
	@Autowired
	private BookingRepository bookingRepository;

	@Autowired
	private BookedRideRepository bookedRideRepository;

	@Autowired
	private CustomerRestClient customerRestClient;

	@Autowired
	private ThemeParkRideRestClient themeParkRideRestClient;

	@GetMapping(path = "/bookings/{id}")
	public ResponseEntity<Booking> getBooking(@PathVariable Long id) {
		Booking booking = bookingRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

		Customer customer = customerRestClient.getCustomerById(booking.getCustomerId());
		if (Objects.isNull(customer)) {
			throw new ResourceNotFoundException("Customer not found with id: " + booking.getCustomerId());
		}
		booking.setCustomer(customer);

		booking.getBookedRides().forEach(bookedRide -> {
			ThemeParkRide themeParkRide = themeParkRideRestClient.getThemeParkRideById(bookedRide.getRideId());
			if (Objects.isNull(themeParkRide)) {
				throw new ResourceNotFoundException("ThemeParkRide not found with id: " + bookedRide.getRideId());
			}
			bookedRide.setThemeParkRide(themeParkRide);
		});

		return ResponseEntity.ok(booking);
	}

}
