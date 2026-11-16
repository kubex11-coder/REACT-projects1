// Začátek plánu (pondělí 1. týdne); první blok je ve St 18. 11. 2026.
export const SWIM_PLAN_START = "2026-11-16";

// Plavání jsou 2 bloky týdně: St a So (posun od pondělí).
export const SWIM_BLOCK_OFFSETS = [2, 5];

// Vzor každého týdne: popisy ve středu a v sobotu (klíče jsou posuny od pondělí).
export const SWIM_WEEK_TEMPLATE = {
  days: {
    2: `200 - kraul technicky
800 - (4×50 kraul šnorchl + 4×50 Fist Drill šnorchl + 4×50 Single Arm šnorchl + 4×50 kraul technicky)
400 - (4×100 tempo)
200 - vyplavat`,
    5: "LONGSWIM xx km",
  },
};

// 12 týdnů do týdne od pondělí 1. 2. 2027; týdny jsou jen očíslované.
export const SWIM_PLAN = Array.from({ length: 12 }, (_, i) => ({
  ...SWIM_WEEK_TEMPLATE,
  title: `Týden ${i + 1}`,
  volume: "",
}));
