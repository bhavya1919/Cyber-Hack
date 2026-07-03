import Nav from "./Nav";
import Hero from "./Hero";
import Stats from "./Stats";
import Capabilities from "./Capabilities";
import ThreatMap from "./ThreatMap";
import HowItWorks from "./HowItWorks";
import AIFeatures from "./AIFeatures";
import Solutions from "./Solutions";
import Dashboard from "./Dashboard";
import Testimonials from "./Testimonials";
import Pricing from "./Pricing";
import FAQ from "./FAQ";
import Footer from "./Footer";
import ParticleBg from "./ParticleBg";
import { ThreatFeedSection } from "../ThreatFeed/ThreatFeedSection";

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#05070A] text-[#F5F7FA]">
      <ParticleBg />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Stats />
        <Capabilities />
        <ThreatMap />
        <ThreatFeedSection />
        <HowItWorks />
        <AIFeatures />
        <Solutions />
        <Dashboard />
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}