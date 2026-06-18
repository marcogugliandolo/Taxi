export type Driver = {
  id: string;
  name: string;
  vehicle: string;
  plate: string;
  rating: number;
  trips: number;
  avatar: string;
  vehicleImage: string;
  location: [number, number]; // lat, lng
};

export type RideStatus = 'idle' | 'searching' | 'driver_found' | 'arriving' | 'in_progress' | 'completed';
