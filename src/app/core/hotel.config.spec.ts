import { HOTEL, mapsDirectionsUrl, ROOM_TYPES, TRAVEL_PACKAGES, whatsappUrl } from './hotel.config';
import { IMAGES } from './images';

describe('hotel config', () => {
  it('builds WhatsApp links with an encoded message', () => {
    expect(whatsappUrl('Hi & welcome?')).toBe(`https://wa.me/${HOTEL.whatsapp}?text=Hi%20%26%20welcome%3F`);
  });

  it('builds a Google Maps directions link to the hotel', () => {
    expect(mapsDirectionsUrl()).toContain('destination=Hotel%20Arasan%20Sapthagiri');
  });

  it('has a photo for every room type', () => {
    for (const r of ROOM_TYPES) expect(IMAGES.rooms[r.id]).withContext(r.id).toBeTruthy();
  });

  it('offers four travel packages of four different sites each', () => {
    expect(TRAVEL_PACKAGES.length).toBe(4);
    const allSites = TRAVEL_PACKAGES.flatMap((p) => p.sites);
    expect(allSites.length).toBe(16);
    expect(new Set(allSites).size).withContext('a site appears in two packages').toBe(16);
  });
});
