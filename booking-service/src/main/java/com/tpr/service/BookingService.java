package com.tpr.service;

import com.tpr.dto.BookingRequestDTO;
import com.tpr.entities.Booking;

public interface BookingService {
	Booking createBooking(BookingRequestDTO bookingRequestDTO);
}