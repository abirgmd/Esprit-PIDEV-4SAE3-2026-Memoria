import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Patients } from "./pages/Patients";
import { PatientDetail } from "./pages/PatientDetail";
import { TestsCognitifs } from "./pages/TestsCognitifs";
import { TestMemoire } from "./pages/TestMemoire";
import { TestLangage } from "./pages/TestLangage";
import { TestOrientation } from "./pages/TestOrientation";
import { Analyses } from "./pages/Analyses";
import { AlertsDashboard } from "./pages/AlertsDashboard";
import { CreateAlert } from "./pages/CreateAlert";
import { AlertDetails } from "./pages/AlertDetails";
import { AlertsReports } from "./pages/AlertsReports";
import { CalendarView } from "./pages/CalendarView";
import { Scheduling } from "./pages/Scheduling";
import { TaskPlanning } from "./pages/TaskPlanning";
import { Availability } from "./pages/Availability";
import { Communaute } from "./pages/Communaute";
import { CommunityList } from "./pages/CommunityList";
import { CommunityFeed } from "./pages/CommunityFeed";
import { CommunityAnalytics } from "./pages/CommunityAnalytics";
import { Activities } from "./pages/Activities";
import { DiagnosisDashboard } from "./pages/DiagnosisDashboard";
import { DiagnosisTest } from "./pages/DiagnosisTest";
import { DiagnosisResults } from "./pages/DiagnosisResults";
import { TreatmentDashboard } from "./pages/TreatmentDashboard";
import { SafetyZones } from "./pages/SafetyZones";
import { RealTimeTracking } from "./pages/RealTimeTracking";
import { Parametres } from "./pages/Parametres";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "patients", Component: Patients },
      { path: "patients/:id", Component: PatientDetail },
      { path: "tests-cognitifs", Component: TestsCognitifs },
      { path: "tests-cognitifs/memoire", Component: TestMemoire },
      { path: "tests-cognitifs/langage", Component: TestLangage },
      { path: "tests-cognitifs/orientation", Component: TestOrientation },
      { path: "analyses", Component: Analyses },
      { path: "alertes", Component: AlertsDashboard },
      { path: "alertes/create", Component: CreateAlert },
      { path: "alertes/reports", Component: AlertsReports },
      { path: "alertes/:id", Component: AlertDetails },
      { path: "planning/calendar", Component: CalendarView },
      { path: "planning/scheduling", Component: Scheduling },
      { path: "planning/tasks", Component: TaskPlanning },
      { path: "planning/availability", Component: Availability },
      { path: "communaute", Component: CommunityList },
      { path: "communaute/:id", Component: CommunityFeed },
      { path: "communaute/analytics", Component: CommunityAnalytics },
      { path: "activites", Component: Activities },
      { path: "diagnosis", Component: DiagnosisDashboard },
      { path: "diagnosis/:id/execute", Component: DiagnosisTest },
      { path: "diagnosis/:id/results", Component: DiagnosisResults },
      { path: "treatment", Component: TreatmentDashboard },
      { path: "treatment/zones/create", Component: SafetyZones },
      { path: "treatment/tracking", Component: RealTimeTracking },
      { path: "parametres", Component: Parametres },
      { path: "*", Component: NotFound },
    ],
  },
]);