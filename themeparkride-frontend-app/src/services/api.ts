
import axios from 'axios';
import { Customer, ThemeParkRide, Booking, BookedRide } from '../types/models';

const API_BASE_URL = 'http://localhost:9999';

// Customer Service API
export const customerService = {
  getAll: async (): Promise<Customer[]> => {
    const response = await axios.get(`${API_BASE_URL}/customer-service/customers`);
    return response.data;
  },
  
  getById: async (id: number): Promise<Customer> => {
    const response = await axios.get(`${API_BASE_URL}/customer-service/customers/${id}`);
    return response.data;
  },
  
  create: async (customer: Customer): Promise<Customer> => {
    const response = await axios.post(`${API_BASE_URL}/customer-service/customers`, customer);
    return response.data;
  },
  
  update: async (id: number, customer: Customer): Promise<Customer> => {
    const response = await axios.put(`${API_BASE_URL}/customer-service/customers/${id}`, customer);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/customer-service/customers/${id}`);
  }
};

// ThemeParkRide Service API
export const themeParkRideService = {
  getAll: async (): Promise<ThemeParkRide[]> => {
    const response = await axios.get(`${API_BASE_URL}/themeparkride-service/rides`);
    return response.data;
  },
  
  getById: async (id: number): Promise<ThemeParkRide> => {
    const response = await axios.get(`${API_BASE_URL}/themeparkride-service/rides/${id}`);
    return response.data;
  },
  
  create: async (ride: ThemeParkRide): Promise<ThemeParkRide> => {
    const response = await axios.post(`${API_BASE_URL}/themeparkride-service/rides`, ride);
    return response.data;
  },
  
  update: async (id: number, ride: ThemeParkRide): Promise<ThemeParkRide> => {
    const response = await axios.put(`${API_BASE_URL}/themeparkride-service/rides/${id}`, ride);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/themeparkride-service/rides/${id}`);
  }
};

// Booking Service API
export const bookingService = {
  getAll: async (): Promise<Booking[]> => {
    const response = await axios.get(`${API_BASE_URL}/booking-service/bookings`);
    return response.data;
  },
  
  getById: async (id: number): Promise<Booking> => {
    const response = await axios.get(`${API_BASE_URL}/booking-service/bookings/${id}`);
    return response.data;
  },
  
  create: async (booking: Booking): Promise<Booking> => {
    const response = await axios.post(`${API_BASE_URL}/booking-service/bookings`, booking);
    return response.data;
  },
  
  update: async (id: number, booking: Booking): Promise<Booking> => {
    const response = await axios.put(`${API_BASE_URL}/booking-service/bookings/${id}`, booking);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/booking-service/bookings/${id}`);
  }
};
