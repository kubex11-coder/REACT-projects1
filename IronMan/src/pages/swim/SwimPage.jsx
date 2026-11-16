import TrainingPlan from "../../components/TrainingPlan";
import SectionPage from "../section/SectionPage";
import {
  SWIM_BLOCK_OFFSETS,
  SWIM_PLAN,
  SWIM_PLAN_START,
  SWIM_WEEK_TEMPLATE,
} from "./swimPlan";

function SwimPage() {
  return (
    <SectionPage title="SWIM">
      <TrainingPlan
        planId="swim"
        startDate={SWIM_PLAN_START}
        weeks={SWIM_PLAN}
        blockOffsets={SWIM_BLOCK_OFFSETS}
        newWeekVolume=""
        newWeekTemplate={SWIM_WEEK_TEMPLATE}
        trackKm
        smallText
        kmLabel="Naplaváno"
      />
    </SectionPage>
  );
}

export default SwimPage;
