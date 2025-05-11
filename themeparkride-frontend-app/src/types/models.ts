
export interface Customer {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
}

export interface ThemeParkRide {
  id?: number;
  name: string;
  description: string;
  thrillFactor: number;
  vomitFactor: number;
}

export interface BookedRide {
  id?: number;
  rideId: number;
  rideName: string;
  participants: number;
  themeParkRide?: ThemeParkRide;
}

export interface Booking {
  id?: number;
  customerId: number;
  customer?: Customer;
  startTime: string; // format ISO: "2023-05-08T14:00:00"
  endTime: string; // format ISO: "2023-05-08T15:00:00"
  bookedRides: BookedRide[];
}
