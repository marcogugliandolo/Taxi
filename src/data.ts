import { Driver } from './types';

export const drivers: Driver[] = [
  {
    id: 'gabriel',
    name: 'Gabriel',
    vehicle: 'Kia EV9',
    plate: '1234 ABC',
    rating: 4.92,
    trips: 1240,
    avatar: 'https://i.pravatar.cc/150?u=gabriel',
    vehicleImage: 'https://www.grupogamboa.com/img/gama/kia/ev9/f1a8acb4-513a-4e5c-861a-93fa153f5905.png',
    location: [43.0080, -7.5580], // Lugo offset
  },
  {
    id: 'andrea',
    name: 'Andrea',
    vehicle: 'Kia EV6',
    plate: '5678 DEF',
    rating: 4.98,
    trips: 890,
    avatar: 'https://i.pravatar.cc/150?u=andrea',
    vehicleImage: 'https://www.kia.com/content/dam/kwcms/kme/global/en/assets/vehicles/ev6/ev6-pe-my25/digital-discover/kia-ev6-pe-gtl-34front.png',
    location: [43.0160, -7.5500], // Lugo offset
  }
];
