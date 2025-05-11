package com.tpr;

import com.tpr.entities.BookedRide;
import com.tpr.entities.Booking;
import com.tpr.feign.CustomerRestClient;
import com.tpr.feign.ThemeParkRideRestClient;
import com.tpr.model.Customer;
import com.tpr.model.ThemeParkRide;
import com.tpr.repository.BookedRideRepository;
import com.tpr.repository.BookingRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@SpringBootApplication
@EnableFeignClients
@EnableScheduling
public class BookingServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(BookingServiceApplication.class, args);
	}

	//@Bean
	public CommandLineRunner commandLineRunner(BookingRepository bookingRepository,
											   BookedRideRepository bookedRideRepository,
											   CustomerRestClient customerRestClient,
											   ThemeParkRideRestClient themeparkrideRestClient) {

		return args -> {
			if (bookingRepository.count() == 0) {
				List<Customer> customers = customerRestClient.getAllCustomers();
				List<ThemeParkRide> themeParkRides = themeparkrideRestClient.getAllThemeParkRides();
				customers.forEach(customer -> {
					Booking booking = Booking.builder()
							.startTime(LocalDateTime.now())
							.endTime(LocalDateTime.now().plusHours(1))
							.customerId(customer.getId())
							.build();
					bookingRepository.save(booking);
					themeParkRides.forEach(themeParkRide -> {
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
			} else {
				System.out.println("Bookings already present, skipping initialization.");
			}
		};
	}
}
