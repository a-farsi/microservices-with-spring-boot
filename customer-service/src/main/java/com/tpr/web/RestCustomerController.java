package com.tpr.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
	Customer createCustomer(@RequestBody Customer customer) {
		return customerRepository.save(customer);
	}

	@PutMapping("/customers")
	Customer updateCustomer(@RequestBody Customer customer) {
		return customerRepository.save(customer);
	}

	@DeleteMapping("/customers/{id}")
	void deleteCustomer(@PathVariable Long id) {
		customerRepository.deleteById(id);
	}
}