import { RUN_PLAN, RUN_PLAN_START } from "../pages/run/runPlan";

// Výchozí plány z kódu podle planId. Plány bez záznamu nemají výchozí rozložení.
export const PLAN_DEFS = {
  run: { startDate: RUN_PLAN_START, weeks: RUN_PLAN },
};
