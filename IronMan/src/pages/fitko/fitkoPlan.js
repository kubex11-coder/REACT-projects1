// Začátek plánu (pondělí 1. týdne), stejný jako u SWIM.
export const FITKO_PLAN_START = "2026-11-16";

// Fitko jsou 2 bloky týdně: Út a Pá (posun od pondělí).
export const FITKO_BLOCK_OFFSETS = [1, 4];

// Vzor každého týdne: popisy v úterý a v pátek (klíče jsou posuny od pondělí).
export const FITKO_WEEK_TEMPLATE = {
  days: {
    1: "Hořejšek",
    4: "Legday",
  },
};

// 12 týdnů jako u SWIM; týdny jsou jen očíslované.
export const FITKO_PLAN = Array.from({ length: 12 }, (_, i) => ({
  ...FITKO_WEEK_TEMPLATE,
  title: `Týden ${i + 1}`,
  volume: "",
}));
