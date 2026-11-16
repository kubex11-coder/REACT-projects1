// Začátek plánu (pondělí 1. týdne), stejný jako u SWIM a FITKO.
export const FOOD_PLAN_START = "2026-11-16";

// Food je 7 bloků týdně: Po–Ne (posun od pondělí).
export const FOOD_BLOCK_OFFSETS = [0, 1, 2, 3, 4, 5, 6];

// Pole bloku; field je sloupec v plan_entries (migrace 5).
export const FOOD_METRICS = [
  { field: "weight", label: "Ranní váha", unit: "kg" },
  { field: "kcal_in", label: "Přijaté kcal", unit: "kcal" },
  { field: "kcal_out", label: "Spálené kcal", unit: "kcal" },
];

// 12 týdnů do týdne od pondělí 1. 2. 2027; týdny jsou jen očíslované.
export const FOOD_PLAN = Array.from({ length: 12 }, (_, i) => ({
  title: `Týden ${i + 1}`,
  volume: "",
}));
