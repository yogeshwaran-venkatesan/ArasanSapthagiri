import { HOTEL } from './hotel.config';
import { breadcrumbSchema, hotelSchema, travelSchema } from './structured-data';

// Echo keys back so the tests don't depend on translations.
const t = (key: string) => key;

describe('structured data', () => {
  it('describes the hotel with its real contact details', () => {
    const hotel = hotelSchema(t) as Record<string, any>;
    expect(hotel['@type']).toBe('Hotel');
    expect(hotel['telephone']).toBe(HOTEL.phone);
    expect(hotel['numberOfRooms']).toBe(HOTEL.rooms);
    expect(hotel['address'].postalCode).toBe(HOTEL.address.pin);
    expect(hotel['amenityFeature'].length).toBeGreaterThan(10);
    // Check-in time is unconfirmed, so it must not be published.
    expect(hotel['checkinTime']).toBeUndefined();
  });

  it('builds a two-step breadcrumb with absolute URLs', () => {
    const crumbs = breadcrumbSchema(t, '/rooms', 'Rooms') as Record<string, any>;
    expect(crumbs['itemListElement'].map((i: any) => i.position)).toEqual([1, 2]);
    expect(crumbs['itemListElement'][1].item).toMatch(/^https?:\/\/.+\/rooms$/);
  });

  it('lists four tourist trips with four attractions each', () => {
    const list = travelSchema(t) as Record<string, any>;
    const trips = list['itemListElement'].map((i: any) => i.item);
    expect(trips.length).toBe(4);
    for (const trip of trips) {
      expect(trip['@type']).toBe('TouristTrip');
      expect(trip.itinerary.itemListElement.length).toBe(4);
    }
  });
});
