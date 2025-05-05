package com.tpr.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tpr.entities.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
}
