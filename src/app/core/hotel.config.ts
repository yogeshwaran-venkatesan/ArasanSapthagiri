/**
 * Every hotel-specific fact lives here, so the site can be updated without
 * touching components. Values marked TODO are placeholders to confirm with
 * the hotel before going live.
 */
export const HOTEL = {
  name: 'Hotel Arasan Sapthagiri',
  shortName: 'Arasan Sapthagiri',
  city: 'Madurai',
  address: {
    line1: 'MIG 343, 80 Feet Road',
    line2: 'Anna Nagar',
    city: 'Madurai',
    pin: '625020',
    state: 'Tamil Nadu',
    landmark: 'Near Vasan Eye Care',
  },
  phone: '+91 452 439 0902',
  phoneHref: 'tel:+914524390902',
  fax: '+91 452 425 0504',
  email: 'sapthagirih@yahoo.com',
  /** TODO: hotel's WhatsApp mobile number in international format, digits only. */
  whatsapp: '910000000000',
  /** Google Maps search used for the embedded map and "Directions" links. */
  mapsQuery: 'Hotel Arasan Sapthagiri, 80 Feet Road, Anna Nagar, Madurai 625020',
  rooms: 31,
  /** TODO: Web3Forms access key (free) so the enquiry form also sends an email. */
  web3formsKey: 'YOUR-WEB3FORMS-ACCESS-KEY',
  checkIn: '12:00',
  checkOut: '12:00',
} as const;

export const mapsEmbedUrl = (): string =>
  `https://www.google.com/maps?q=${encodeURIComponent(HOTEL.mapsQuery)}&output=embed`;

export const mapsDirectionsUrl = (): string =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(HOTEL.mapsQuery)}`;

export const whatsappUrl = (message: string): string =>
  `https://wa.me/${HOTEL.whatsapp}?text=${encodeURIComponent(message)}`;

/** Room types offered on the current booking form. Rates are TODO (null = "Ask for rate"). */
export interface RoomType {
  id: 'standard' | 'super-deluxe' | 'suite' | 'mini-suite';
  rate: number | null;
}

export const ROOM_TYPES: RoomType[] = [
  { id: 'standard', rate: null },
  { id: 'super-deluxe', rate: null },
  { id: 'suite', rate: null },
  { id: 'mini-suite', rate: null },
];

/** Facilities listed on the current site (keys into i18n "facilities.items"). */
export const FACILITIES: { key: string; icon: string }[] = [
  { key: 'ac', icon: 'snowflake' },
  { key: 'rooftop', icon: 'sunset' },
  { key: 'multicuisine', icon: 'utensils' },
  { key: 'wifi', icon: 'wifi' },
  { key: 'roomService', icon: 'bell' },
  { key: 'conference', icon: 'presentation' },
  { key: 'doctor', icon: 'stethoscope' },
  { key: 'laundry', icon: 'shirt' },
  { key: 'lockers', icon: 'lock' },
  { key: 'forex', icon: 'currency' },
  { key: 'travelDesk', icon: 'car' },
  { key: 'cards', icon: 'card' },
  { key: 'directDial', icon: 'phone' },
  { key: 'tv', icon: 'tv' },
];

/** In-room comforts described on the current site (keys into i18n "rooms.amenities"). */
export const ROOM_AMENITIES: { key: string; icon: string }[] = [
  { key: 'ac', icon: 'snowflake' },
  { key: 'soundproof', icon: 'volume' },
  { key: 'bath', icon: 'droplet' },
  { key: 'tv', icon: 'tv' },
  { key: 'fridge', icon: 'fridge' },
  { key: 'wifi', icon: 'wifi' },
  { key: 'phone', icon: 'phone' },
  { key: 'roomService', icon: 'bell' },
];

/** Travel times stated on the current site. */
export const NEARBY: { key: string; minutes: number; icon: string }[] = [
  { key: 'aravind', minutes: 5, icon: 'hospital' },
  { key: 'busStand', minutes: 10, icon: 'bus' },
  { key: 'railway', minutes: 20, icon: 'train' },
  { key: 'temple', minutes: 0, icon: 'temple' },
];

/**
 * Sightseeing packages arranged by the travel desk: four sites each.
 * Prices are not published — every card asks the visitor to enquire.
 * Distances are approximate road distances from Madurai.
 */
export interface TravelPackage {
  id: 'temples' | 'heritage' | 'rameswaram' | 'kodaikanal';
  icon: string;
  kind: 'city' | 'dayTrip';
  distanceKm: number | null;
  /** Keys into i18n "travel.sites". */
  sites: [string, string, string, string];
}

export const TRAVEL_PACKAGES: TravelPackage[] = [
  { id: 'temples', icon: 'temple', kind: 'city', distanceKm: null, sites: ['meenakshi', 'thiruparankundram', 'alagarKovil', 'pazhamudircholai'] },
  { id: 'heritage', icon: 'landmark', kind: 'city', distanceKm: null, sites: ['nayakkarMahal', 'gandhiMuseum', 'teppakulam', 'koodalAzhagar'] },
  { id: 'rameswaram', icon: 'waves', kind: 'dayTrip', distanceKm: 170, sites: ['ramanathaswamy', 'pambanBridge', 'dhanushkodi', 'kalamMemorial'] },
  { id: 'kodaikanal', icon: 'mountain', kind: 'dayTrip', distanceKm: 120, sites: ['kodaiLake', 'coakersWalk', 'bryantPark', 'pillarRocks'] },
];
