import { Switch, Route } from "react-router-dom";
import Analytics from "./pages/analytics/Analytics";
import AnalyticsContextProvider from "./pages/analytics/AnalyticsContext";
import ClientDashboard from "./pages/client-dashboard/ClientDashboard";
import ClientDashboardContextProvider from "./pages/client-dashboard/ClientDashboardContext";
import Qualifications from "./pages/qualifications/Qualifications";
import QualificationsContextProvider from "./pages/qualifications/QualificationsContext";
import ReportsContextProvider from "./pages/reports/ReportsContext";
import Reports from "./pages/reports/Reports";
import Documents from "./pages/documents/Documents";
import Security from "./pages/security/Security";
import DocumentsContextProvider from "./pages/documents/DocumentsContext";
import SecuirtyContextProvider from "./pages/security/SecurityContext";
import MainDashboard from "./pages/main-dashboard/MainDashboard";
import MainDashboardContextProvider from "./pages/main-dashboard/MainDashboardContext";
import Home from "./pages/home/Home";

function App() {
  return (
    <>
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/dashboard/:surveyID">
          <ClientDashboardContextProvider>
            <ClientDashboard />
          </ClientDashboardContextProvider>
        </Route>

        <Route path="/qualifications/:surveyID">
          <QualificationsContextProvider>
            <Qualifications />
          </QualificationsContextProvider>
        </Route>

        <Route path="/analytics/:navigationTab/:surveyID">
          <AnalyticsContextProvider>
            <Analytics />
          </AnalyticsContextProvider>
        </Route>

        <Route path="/reports/:surveyID">
          <ReportsContextProvider>
            <Reports />
          </ReportsContextProvider>
        </Route>

        <Route path="/documents/:surveyID">
          <DocumentsContextProvider>
            <Documents />
          </DocumentsContextProvider>
        </Route>
        <Route path="/security/:surveyID">
          <SecuirtyContextProvider>
            <Security />
          </SecuirtyContextProvider>
        </Route>

        <Route path="/clients/:clientID/:surveySortBy" exact>
          <MainDashboardContextProvider>
            <MainDashboard />
          </MainDashboardContextProvider>
        </Route>
      </Switch>
    </>
  );
}

export default App;
