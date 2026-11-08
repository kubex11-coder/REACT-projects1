import TrainingPlan from "../../components/TrainingPlan";
import SectionPage from "../section/SectionPage";
import { RUN_PLAN, RUN_PLAN_START } from "./runPlan";

function RunPage() {
  return (
    <SectionPage title="RUN">
      <TrainingPlan
        planId="run"
        startDate={RUN_PLAN_START}
        weeks={RUN_PLAN}
      />
    </SectionPage>
  );
}

export default RunPage;
