package com.tpr.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tpr.entities.Customer;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
	Long id(Long id);
}
