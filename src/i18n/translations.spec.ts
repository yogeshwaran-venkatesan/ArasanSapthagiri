import { FACILITIES, NEARBY, ROOM_AMENITIES, ROOM_TYPES, TRAVEL_PACKAGES } from '../app/core/hotel.config';
import { IMAGES } from '../app/core/images';
import en from './en.json';
import ta from './ta.json';

type Tree = { [key: string]: string | Tree };

const flatten = (tree: Tree, prefix = ''): string[] =>
  Object.entries(tree).flatMap(([k, v]) => (typeof v === 'string' ? [prefix + k] : flatten(v, `${prefix}${k}.`)));

const lookup = (tree: Tree, key: string): unknown =>
  key.split('.').reduce<unknown>((node, part) => (node as Tree | undefined)?.[part], tree);

describe('translations', () => {
  const enKeys = flatten(en as Tree);
  const taKeys = new Set(flatten(ta as Tree));

  it('Tamil has exactly the same keys as English', () => {
    expect(enKeys.filter((k) => !taKeys.has(k))).withContext('missing in ta.json').toEqual([]);
    expect([...taKeys].filter((k) => !enKeys.includes(k))).withContext('missing in en.json').toEqual([]);
  });

  it('has no empty strings', () => {
    for (const [name, tree] of [['en', en], ['ta', ta]] as const) {
      const empty = flatten(tree as Tree).filter((k) => !String(lookup(tree as Tree, k)).trim());
      expect(empty).withContext(name).toEqual([]);
    }
  });

  it('covers every key the hotel data refers to', () => {
    const needed = [
      ...FACILITIES.flatMap((f) => [`facilities.items.${f.key}.name`, `facilities.items.${f.key}.text`]),
      ...ROOM_TYPES.flatMap((r) => [`rooms.types.${r.id}.name`, `rooms.types.${r.id}.short`]),
      ...ROOM_AMENITIES.map((a) => `rooms.amenities.${a.key}`),
      ...NEARBY.flatMap((n) => [`nearby.${n.key}`, `locationPage.how.${n.key}`]),
      ...IMAGES.gallery.map((g) => g.alt),
      ...TRAVEL_PACKAGES.flatMap((p) => [
        `travel.packages.${p.id}.name`,
        `travel.packages.${p.id}.tagline`,
        `travel.kind.${p.kind}`,
        ...p.sites.flatMap((s) => [`travel.sites.${s}.name`, `travel.sites.${s}.text`]),
      ]),
    ];
    const missing = needed.filter((k) => typeof lookup(en as Tree, k) !== 'string');
    expect(missing).toEqual([]);
  });
});
