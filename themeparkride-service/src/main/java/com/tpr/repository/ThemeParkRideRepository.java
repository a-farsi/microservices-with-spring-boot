package com.tpr.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.tpr.entities.ThemeParkRide;

@Repository
public interface ThemeParkRideRepository extends JpaRepository<ThemeParkRide, Long> {
	List<ThemeParkRide> findByName(String name);
}
