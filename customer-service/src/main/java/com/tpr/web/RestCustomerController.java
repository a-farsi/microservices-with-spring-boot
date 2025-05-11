package com.tpr.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tpr.entities.Customer;
import com.tpr.repository.CustomerRepository;

@RestController
public class RestCustomerController {
	@Autowired
	CustomerRepository customerRepository;

	@GetMapping("/customers")
	List<Customer> findAll() {
		return customerRepository.findAll();
	}
	@GetMapping("/customers/{id}")
	Customer findCustomerById(@PathVariable Long id) {
		return customerRepository.findById(id).orElse(null);
	}
	@PostMapping("/customers")
	Customer createCustomer(Customer customer) {
		return customerRepository.save(customer);
	}
}