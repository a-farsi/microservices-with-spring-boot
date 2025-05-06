package com.tpr.feign;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.tpr.model.ThemeParkRide;

@FeignClient(name = "themeparkride-service")
public interface ThemeParkRideRestClient {
	@GetMapping("/rides/{id}")
	ThemeParkRide getThemeParkRideById(@PathVariable Long id);

	@GetMapping("/rides")
	List<ThemeParkRide> getAllThemeParkRides();
}
