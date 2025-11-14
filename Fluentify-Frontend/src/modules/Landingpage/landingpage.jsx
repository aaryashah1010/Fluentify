import { Header } from './header';
import { Hero } from './hero';
import { Features } from './features';
import { HowItWorks } from './HowItWorks';
import { LanguageGrid } from './LanguageGrid';
import { CTASection } from './CTASection';

export function LandingPage({ onNavigate }) {
  return (
    <div className="min-h-screen">
      <Header onNavigate={onNavigate} />
      <Hero onNavigate={onNavigate} />
      <Features />
      <HowItWorks />
      <LanguageGrid />
      <CTASection onNavigate={onNavigate} />
    </div>
  );
}
