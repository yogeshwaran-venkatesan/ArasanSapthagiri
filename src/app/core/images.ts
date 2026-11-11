/**
 * Image catalogue. Photos come from the hotel's current website, converted to
 * WebP. They are low resolution (max ~800px wide), so layouts use them behind
 * gradients or at modest sizes. Replace with new photography for best results.
 */
export const IMAGES = {
  hero: 'images/hero.webp', // double room, warm evening light
  reception: 'images/reception.webp',
  restaurant: 'images/restaurant.webp', // buffet, multi-cuisine restaurant
  rooftop: 'images/rooftop.webp',
  rooftopNight: 'images/rooftop-night.webp',
  conference: 'images/conference.webp',
  templeMandapam: 'images/temple-mandapam.webp',
  templeNight: 'images/temple-night.webp',
  travel: ['images/travel-van.webp', 'images/travel-bus.webp', 'images/travel-coach.webp'],
  rooms: {
    standard: 'images/room-3.webp',
    'super-deluxe': 'images/room-2.webp',
    suite: 'images/hero.webp',
    'mini-suite': 'images/room.webp',
  } as Record<string, string>,
  /** Gallery order matters: the home page shows the first five. */
  gallery: [
    { src: 'images/reception.webp', alt: 'gallery.reception', category: 'hotel' },
    { src: 'images/room.webp', alt: 'gallery.twinRoom', category: 'rooms' },
    { src: 'images/hero.webp', alt: 'gallery.doubleRoom', category: 'rooms' },
    { src: 'images/restaurant.webp', alt: 'gallery.buffet', category: 'dining' },
    { src: 'images/conference.webp', alt: 'gallery.conference', category: 'hotel' },
    { src: 'images/rooftop-night.webp', alt: 'gallery.rooftopNight', category: 'dining' },
    { src: 'images/rooftop.webp', alt: 'gallery.rooftop', category: 'dining' },
    { src: 'images/room-2.webp', alt: 'gallery.deluxeRoom', category: 'rooms' },
    { src: 'images/room-3.webp', alt: 'gallery.standardRoom', category: 'rooms' },
    { src: 'images/travel-van.webp', alt: 'gallery.travelVan', category: 'hotel' },
    { src: 'images/travel-bus.webp', alt: 'gallery.travelBus', category: 'hotel' },
    { src: 'images/travel-coach.webp', alt: 'gallery.travelCoach', category: 'hotel' },
    { src: 'images/temple-mandapam.webp', alt: 'gallery.templeMandapam', category: 'madurai' },
    { src: 'images/temple-night.webp', alt: 'gallery.templeNight', category: 'madurai' },
  ] as GalleryImage[],
} as const;

export type GalleryCategory = 'rooms' | 'dining' | 'hotel' | 'madurai';

export interface GalleryImage {
  src: string;
  /** i18n key for the alt text / caption. */
  alt: string;
  category: GalleryCategory;
}

export const GALLERY_CATEGORIES: GalleryCategory[] = ['rooms', 'dining', 'hotel', 'madurai'];
