package com.tpr.feign;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.tpr.model.Customer;

@FeignClient(name = "customer-service")
public interface CustomerRestClient {
	@GetMapping("/customers/{id}")
	Customer getCustomerById(@PathVariable long id);

	@GetMapping("/customers")
	List<Customer> getAllCustomers();
}
