package com.tpr.web;

import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.tpr.entities.Booking;
import com.tpr.feign.CustomerRestClient;
import com.tpr.feign.ThemeParkRideRestClient;
import com.tpr.repository.BookedRideRepository;
import com.tpr.repository.BookingRepository;

@RestController
public class BookingRestController {
	@Autowired
	BookingRepository bookingRepository;
	@Autowired
	BookedRideRepository bookedRideRepository;
	@Autowired
	CustomerRestClient customerRestClient;

	@Autowired
	private ThemeParkRideRestClient themeParkRideRestClient;


	@GetMapping(path = "/api/borrows/{id}")
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

}
