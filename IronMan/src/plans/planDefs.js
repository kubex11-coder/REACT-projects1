import { RUN_PLAN, RUN_PLAN_START } from "../pages/run/runPlan";
import {
  SWIM_BLOCK_OFFSETS,
  SWIM_PLAN,
  SWIM_PLAN_START,
} from "../pages/swim/swimPlan";
import {
  FITKO_BLOCK_OFFSETS,
  FITKO_PLAN,
  FITKO_PLAN_START,
} from "../pages/fitko/fitkoPlan";
import {
  FOOD_BLOCK_OFFSETS,
  FOOD_PLAN,
  FOOD_PLAN_START,
} from "../pages/food/foodPlan";

// Výchozí plány z kódu podle planId. Plány bez záznamu nemají výchozí rozložení.
export const PLAN_DEFS = {
  run: { startDate: RUN_PLAN_START, weeks: RUN_PLAN },
  swim: {
    startDate: SWIM_PLAN_START,
    weeks: SWIM_PLAN,
    blockOffsets: SWIM_BLOCK_OFFSETS,
  },
  fitko: {
    startDate: FITKO_PLAN_START,
    weeks: FITKO_PLAN,
    blockOffsets: FITKO_BLOCK_OFFSETS,
  },
  food: {
    startDate: FOOD_PLAN_START,
    weeks: FOOD_PLAN,
    blockOffsets: FOOD_BLOCK_OFFSETS,
    // Skóre bloku zahrnuje i rozdíl kcal, viz blockScore v PlansContext.
    kcalScore: true,
  },
};
