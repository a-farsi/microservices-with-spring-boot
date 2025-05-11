package com.tpr.service;

import com.tpr.entities.BookedRide;
import com.tpr.entities.Booking;
import com.tpr.feign.CustomerRestClient;
import com.tpr.feign.ThemeParkRideRestClient;
import com.tpr.model.Customer;
import com.tpr.model.ThemeParkRide;
import com.tpr.repository.BookedRideRepository;
import com.tpr.repository.BookingRepository;
import feign.FeignException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.logging.Logger;

@Service
public class BookingDataInitializerService {
	Logger LOGGER = Logger.getLogger(BookingDataInitializerService.class.getName());

	private final BookingRepository bookingRepository;
	private final BookedRideRepository bookedRideRepository;
	private final CustomerRestClient customerRestClient;
	private final ThemeParkRideRestClient themeparkrideRestClient;

	public BookingDataInitializerService(BookingRepository bookingRepository,
										 BookedRideRepository bookedRideRepository,
										 CustomerRestClient customerRestClient,
										 ThemeParkRideRestClient themeparkrideRestClient) {
		this.bookingRepository = bookingRepository;
		this.bookedRideRepository = bookedRideRepository;
		this.customerRestClient = customerRestClient;
		this.themeparkrideRestClient = themeparkrideRestClient;
	}

	@Scheduled(initialDelay = 10_000, fixedDelay = Long.MAX_VALUE)
	public void initData() {
		if (bookingRepository.count() == 0) {
			int maxRetries = 5;
			int retryCount = 0;
			boolean success = false;
			List<Customer> customers = null;
			List<ThemeParkRide> themeParkRides = null;
			try{
				customers = customerRestClient.getAllCustomers();
				themeParkRides = themeparkrideRestClient.getAllThemeParkRides();
				success = true;
			} catch (FeignException.ServiceUnavailable e) {
				retryCount++;
				LOGGER.info("Service customer non disponible, tentative " + retryCount + " sur " + maxRetries);
				try {
					Thread.sleep(5000); // Attendre 5 secondes avant de réessayer
				} catch (InterruptedException ie) {
					Thread.currentThread().interrupt();
				}
			}
			if (!success) {
					LOGGER.warning("Impossible d'initialiser les données après tentatives : "+ maxRetries);
					return;
			}
			if (customers != null && themeParkRides != null && !customers.isEmpty() && !themeParkRides.isEmpty()) {
				List<ThemeParkRide> finalThemeParkRides = themeParkRides;
				customers.forEach(customer -> {
					Booking booking = Booking.builder()
							.startTime(LocalDateTime.now())
							.endTime(LocalDateTime.now().plusHours(1))
							.customerId(customer.getId())
							.build();
					bookingRepository.save(booking);
					finalThemeParkRides.forEach(themeParkRide -> {
						BookedRide bookedRide = BookedRide.builder()
								.booking(booking)
								.rideId(themeParkRide.getId())
								.rideName(themeParkRide.getName())
								.participants(ThreadLocalRandom.current().nextInt(1, 7))
								.build();
						bookedRideRepository.save(bookedRide);
					});
				});
				System.out.println("=================Display the saved objects===========================");
				bookingRepository.findAll().forEach(System.out::println);
				System.out.println("=====================================================================");
			}else {
				LOGGER.warning("Les données récupérées des services externes sont vides ou null");
			}
		} else {
			System.out.println("Bookings already present, skipping initialization.");
		}
	}

}
