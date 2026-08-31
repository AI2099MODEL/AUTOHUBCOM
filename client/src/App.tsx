import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { PrivacyPage, TermsPage } from "./pages/LegalPage";
import { MarketPage, ProductDetailsPage } from "./pages/MarketPage";

function Router() {
  return <Switch><Route path="/" component={Home} /><Route path="/usa"><MarketPage market="usa" /></Route><Route path="/canada"><MarketPage market="canada" /></Route><Route path="/india"><MarketPage market="india" /></Route><Route path="/uk"><MarketPage market="uk" /></Route><Route path="/product/:token" component={ProductDetailsPage} /><Route path="/privacy" component={PrivacyPage} /><Route path="/terms" component={TermsPage} /><Route component={Home} /></Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
