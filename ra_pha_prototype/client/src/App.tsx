import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Vitals from "./pages/Vitals";
import Insights from "./pages/Insights";
import Wellness from "./pages/Wellness";
import Doctors from "./pages/Doctors";
import Profile from "./pages/Profile";
import AIAssistant from "./pages/AIAssistant";
import Pricing from "./pages/Pricing";
import Payments from "./pages/Payments";
import Emergency from "./pages/Emergency";
import MedicalShops from "./pages/MedicalShops";
import Banking from "./pages/Banking";
import HealthInsurance from "./pages/HealthInsurance";
import RealTimeServices from "./pages/RealTimeServices";
import HealthReportAnalysis from "./pages/HealthReportAnalysis";
import HealthPredictionDashboard from "./pages/HealthPredictionDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/login"} component={Login} />
      <Route path={"/forgot-password"} component={ForgotPassword} />
      <Route path={"/reset-password"} component={ResetPassword} />
      <Route path={"/verify-email"} component={VerifyEmail} />
      <Route path={"/"} component={Dashboard} />
      <Route path={"/vitals"} component={Vitals} />
      <Route path={"/insights"} component={Insights} />
      <Route path={"/wellness"} component={Wellness} />
      <Route path={"/doctors"} component={Doctors} />
      <Route path={"/ai-assistant"} component={AIAssistant} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/pricing"} component={Pricing} />
      <Route path={"/payments"} component={Payments} />
      <Route path={"/emergency"} component={Emergency} />
       <Route path="/medical-shops" component={MedicalShops} />
      <Route path="/banking" component={Banking} />
      <Route path="/health-insurance" component={HealthInsurance} />
      <Route path="/realtime-services" component={RealTimeServices} />
      <Route path="/health-report-analysis" component={HealthReportAnalysis} />
      <Route path="/health-prediction" component={HealthPredictionDashboard} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
