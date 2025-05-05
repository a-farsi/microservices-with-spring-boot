package com.tpr.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tpr.entities.BookedRide;

@Repository
public interface BookedRideRepository extends JpaRepository<BookedRide, Long> {
}
