package com.tpr.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequestDTO {
	private Long customerId;
	private LocalDateTime startTime;
	private LocalDateTime endTime;
	private List<BookedRideDTO> bookedRides;
}

