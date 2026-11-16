import TrainingPlan from "../../components/TrainingPlan";
import SectionPage from "../section/SectionPage";
import {
  FITKO_BLOCK_OFFSETS,
  FITKO_PLAN,
  FITKO_PLAN_START,
  FITKO_WEEK_TEMPLATE,
} from "./fitkoPlan";

function FitkoPage() {
  return (
    <SectionPage title="FITKO">
      <TrainingPlan
        planId="fitko"
        startDate={FITKO_PLAN_START}
        weeks={FITKO_PLAN}
        blockOffsets={FITKO_BLOCK_OFFSETS}
        newWeekVolume=""
        newWeekTemplate={FITKO_WEEK_TEMPLATE}
        trackKm
        kmLabel="Odtrénováno"
        trackUnit="min"
        showVolume={false}
      />
    </SectionPage>
  );
}

export default FitkoPage;
