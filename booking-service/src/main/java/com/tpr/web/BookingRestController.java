package com.tpr.web;

import com.tpr.dto.BookingRequestDTO;
import com.tpr.entities.Booking;
import com.tpr.feign.CustomerRestClient;
import com.tpr.feign.ThemeParkRideRestClient;
import com.tpr.repository.BookedRideRepository;
import com.tpr.repository.BookingRepository;
import com.tpr.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
public class BookingRestController {
	@Autowired
	private BookingRepository bookingRepository;
	@Autowired
	private CustomerRestClient customerRestClient;
	@Autowired
	private BookingService bookingService;


	@Autowired
	private ThemeParkRideRestClient themeParkRideRestClient;


	@GetMapping(path = "/api/bookings/{id}")
	public Booking getBookingById(@PathVariable Long id) {

		Booking booking = bookingRepository.findById(id).orElse(null);
		if(!Objects.isNull(booking) && !Objects.isNull(booking.getCustomerId()))
			booking.setCustomer(customerRestClient.getCustomerById(booking.getCustomerId()));
		Objects.requireNonNull(booking).getBookedRides().forEach(bookedRide ->
				bookedRide.setThemeParkRide(themeParkRideRestClient.getThemeParkRideById(bookedRide.getRideId())));

		return booking;

	}

	@GetMapping(path = "/bookings")
	public List<Booking> getAllBookings() {
		return bookingRepository.findAll();
	}

	@PostMapping(path = "/bookings")
	public ResponseEntity<Booking> createBooking(@RequestBody BookingRequestDTO bookingRequestDTO) {
		Booking createdBooking = bookingService.createBooking(bookingRequestDTO);
		return new ResponseEntity<>(createdBooking, HttpStatus.CREATED);
	}

	@DeleteMapping(path = "/bookings/{id}")
	public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
		bookingRepository.deleteById(id);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

	@PutMapping(path = "/booking/{id}")
	public ResponseEntity<Booking> updateBooking(@PathVariable Long id, @RequestBody BookingRequestDTO bookingRequestDTO) {
		Booking updatedBooking = bookingService.createBooking(bookingRequestDTO);
		return new ResponseEntity<>(updatedBooking, HttpStatus.OK);
	}

}
