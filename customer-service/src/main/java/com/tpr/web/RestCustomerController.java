package com.tpr.web;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.tpr.entities.Customer;
import com.tpr.repository.CustomerRepository;
import org.springframework.web.server.ResponseStatusException;

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

	@PutMapping("/customers/{id}")
	Customer updateCustomer(@PathVariable Long id, @RequestBody Customer customer) {

		Optional<Customer> existingCustomer = customerRepository.findById(id);
		if (existingCustomer.isPresent()) {
			Customer updatedCustomer = existingCustomer.get();
			updatedCustomer.setFirstName(customer.getFirstName());
			updatedCustomer.setLastName(customer.getLastName());
			updatedCustomer.setEmail(customer.getEmail());
			updatedCustomer.setPhone(customer.getPhone());
			return customerRepository.save(updatedCustomer);
		} else {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found");
		}

	}

	@DeleteMapping("/customers/{id}")
	void deleteCustomer(@PathVariable Long id) {
		customerRepository.deleteById(id);
	}
}