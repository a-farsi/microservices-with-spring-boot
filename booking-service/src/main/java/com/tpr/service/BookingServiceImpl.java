package com.tpr.service;

import com.tpr.dto.BookingRequestDTO;
import com.tpr.entities.BookedRide;
import com.tpr.entities.Booking;
import com.tpr.feign.CustomerRestClient;
import com.tpr.feign.ThemeParkRideRestClient;
import com.tpr.repository.BookingRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

	private final BookingRepository bookingRepository;
	private final CustomerRestClient customerRestClient;
	private final ThemeParkRideRestClient themeParkRideRestClient;

	@Override
	//@Transactional
	public Booking createBooking(BookingRequestDTO bookingRequestDTO) {
		// Vérifier que le customer existe
		var customer = customerRestClient.getCustomerById(bookingRequestDTO.getCustomerId());

		// Créer la réservation
		Booking booking = Booking.builder()
				.customerId(bookingRequestDTO.getCustomerId())
				.customer(customer)  // On ajoute le customer (sera @Transient)
				.startTime(bookingRequestDTO.getStartTime())
				.endTime(bookingRequestDTO.getEndTime())
				.bookedRides(new ArrayList<>())
				.build();

		// Ajouter les attractions réservées
		bookingRequestDTO.getBookedRides().forEach(rideDTO -> {
			// Récupérer les informations de l'attraction
			var themeParkRide = themeParkRideRestClient.getThemeParkRideById(rideDTO.getRideId());

			BookedRide bookedRide = BookedRide.builder()
					.rideId(rideDTO.getRideId())
					.rideName(themeParkRide.getName())  // On récupère le nom pour éviter des appels futurs
					.participants(rideDTO.getParticipants())
					.booking(booking)  // Liaison bidirectionnelle
					.themeParkRide(themeParkRide)  // On ajoute les infos du ride (sera @Transient)
					.build();

			booking.getBookedRides().add(bookedRide);
		});

		// Sauvegarder la réservation (les BookedRide seront sauvegardés automatiquement grâce au CascadeType.ALL)
		return bookingRepository.save(booking);
	}
}

