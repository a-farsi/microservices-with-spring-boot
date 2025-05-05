package com.tpr.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ThemeParkRide {
	private Long id;
	private String name;
	private String description;
	private int thrillFactor;
	private int vomitFactor;
}
