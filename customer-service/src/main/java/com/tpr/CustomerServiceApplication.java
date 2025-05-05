package com.tpr;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.tpr.entities.Customer;
import com.tpr.repository.CustomerRepository;

@SpringBootApplication
public class CustomerServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(CustomerServiceApplication.class, args);
	}

	@Bean
	CommandLineRunner start(CustomerRepository repository) {
		return args -> {
			repository.save(new Customer(null,"John", "Doe", "john.doe@email.com", "0621456887"));
			repository.save(new Customer(null,"coucou", "master", "coucou.master@email.com", "062154568787"));
			repository.save(new Customer(null,"second", "lsthim", "second.lasthim@email.com", "0629854245"));
			repository.save(new Customer(null,"Jinjin", "Dojo", "Jinjin.Dojo@email.com", "06547821498"));

			repository.findAll().forEach(System.out::println);
		};
	}
}
