import { FACILITIES, HOTEL, mapsDirectionsUrl, ROOM_TYPES, TRAVEL_PACKAGES } from './hotel.config';
import { absoluteUrl } from './seo';

/** Looks up English copy (structured data is generated at prerender time). */
export type Translate = (key: string) => string;

const HOTEL_ID = absoluteUrl('/#hotel');

/** schema.org Hotel — the business itself. Only facts stated on the hotel's own site. */
export const hotelSchema = (t: Translate): object => ({
  '@type': 'Hotel',
  '@id': HOTEL_ID,
  name: HOTEL.name,
  url: absoluteUrl('/'),
  description: t('seo.home.description'),
  image: [absoluteUrl('images/og-cover.jpg'), absoluteUrl('images/hero.webp'), absoluteUrl('images/reception.webp')],
  logo: absoluteUrl('images/apple-touch-icon.png'),
  telephone: HOTEL.phone,
  faxNumber: HOTEL.fax,
  email: HOTEL.email,
  numberOfRooms: HOTEL.rooms,
  hasMap: mapsDirectionsUrl(),
  address: {
    '@type': 'PostalAddress',
    streetAddress: `${HOTEL.address.line1}, ${HOTEL.address.line2}`,
    addressLocality: HOTEL.address.city,
    addressRegion: HOTEL.address.state,
    postalCode: HOTEL.address.pin,
    addressCountry: 'IN',
  },
  amenityFeature: FACILITIES.map((f) => ({
    '@type': 'LocationFeatureSpecification',
    name: t(`facilities.items.${f.key}.name`),
    value: true,
  })),
  containsPlace: ROOM_TYPES.map((r) => ({
    '@type': 'HotelRoom',
    name: t(`rooms.types.${r.id}.name`),
    description: t(`rooms.types.${r.id}.short`),
  })),
});

/** Breadcrumb trail: Home › Page. */
export const breadcrumbSchema = (t: Translate, path: string, name: string): object => ({
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: t('nav.home'), item: absoluteUrl('/') },
    { '@type': 'ListItem', position: 2, name, item: absoluteUrl(path) },
  ],
});

/** The four travel-desk packages as tourist trips, each visiting four attractions. */
export const travelSchema = (t: Translate): object => ({
  '@type': 'ItemList',
  name: t('travel.title'),
  itemListElement: TRAVEL_PACKAGES.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'TouristTrip',
      name: t(`travel.packages.${p.id}.name`),
      description: t(`travel.packages.${p.id}.tagline`),
      url: absoluteUrl(`/travel#${p.id}`),
      provider: { '@id': HOTEL_ID },
      itinerary: {
        '@type': 'ItemList',
        itemListElement: p.sites.map((s, n) => ({
          '@type': 'ListItem',
          position: n + 1,
          item: { '@type': 'TouristAttraction', name: t(`travel.sites.${s}.name`), description: t(`travel.sites.${s}.text`) },
        })),
      },
    },
  })),
});
