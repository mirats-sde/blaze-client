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

// IMP NOTE
//------>>>>> a8e91843f173d7c5a5bd11b72ab43fd3  encryption of "miratsinsights" with md2 algorithm

function App() {
  return (
    <>
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/:clientID/a8e91843f173d7c5a5bd11b72ab43fd3/dashboard/:surveyID">
          <ClientDashboardContextProvider>
            <ClientDashboard />
          </ClientDashboardContextProvider>
        </Route>

        <Route path="/:clientID/a8e91843f173d7c5a5bd11b72ab43fd3/qualifications/:surveyID">
          <QualificationsContextProvider>
            <Qualifications />
          </QualificationsContextProvider>
        </Route>

        <Route path="/:clientID/a8e91843f173d7c5a5bd11b72ab43fd3/analytics/:navigationTab/:surveyID">
          <AnalyticsContextProvider>
            <Analytics />
          </AnalyticsContextProvider>
        </Route>

        <Route path="/:clientID/a8e91843f173d7c5a5bd11b72ab43fd3/reports/:surveyID">
          <ReportsContextProvider>
            <Reports />
          </ReportsContextProvider>
        </Route>

        <Route path="/:clientID/a8e91843f173d7c5a5bd11b72ab43fd3/documents/:surveyID">
          <DocumentsContextProvider>
            <Documents />
          </DocumentsContextProvider>
        </Route>
        <Route path="/:clientID/a8e91843f173d7c5a5bd11b72ab43fd3/security/:surveyID">
          <SecuirtyContextProvider>
            <Security />
          </SecuirtyContextProvider>
        </Route>

        <Route path="/:clientID/a8e91843f173d7c5a5bd11b72ab43fd3" exact>
          <MainDashboardContextProvider>
            <MainDashboard />
          </MainDashboardContextProvider>
        </Route>
        <Route
          path="/:clientID/a8e91843f173d7c5a5bd11b72ab43fd3/:surveySortBy"
          exact
        >
          <MainDashboardContextProvider>
            <MainDashboard />
          </MainDashboardContextProvider>
        </Route>
      </Switch>
    </>
  );
}

export default App;
