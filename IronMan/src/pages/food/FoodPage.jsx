import TrainingPlan from "../../components/TrainingPlan";
import SectionPage from "../section/SectionPage";
import {
  FOOD_BLOCK_OFFSETS,
  FOOD_METRICS,
  FOOD_PLAN,
  FOOD_PLAN_START,
} from "./foodPlan";

function FoodPage() {
  return (
    <SectionPage title="FOOD">
      <TrainingPlan
        planId="food"
        startDate={FOOD_PLAN_START}
        weeks={FOOD_PLAN}
        blockOffsets={FOOD_BLOCK_OFFSETS}
        newWeekVolume=""
        showVolume={false}
        showText={false}
        metrics={FOOD_METRICS}
        showKcalDiff
        statusLabel="Půst 14/10"
        cheatday
        compact
      />
    </SectionPage>
  );
}

export default FoodPage;
