import { Header } from './header';
import { Hero } from './hero';
import { Features } from './features';
import { HowItWorks } from './HowItWorks';
import { LanguageGrid } from './LanguageGrid';
import { CTASection } from './CTASection';

export function LandingPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-orange-50 to-slate-100 dark:from-teal-900 dark:via-orange-900 dark:to-slate-950 text-slate-900 dark:text-slate-50">
      <Header onNavigate={onNavigate} />
      <Hero onNavigate={onNavigate} />
      <Features />
      <HowItWorks />
      <LanguageGrid />
      <CTASection onNavigate={onNavigate} />
    </div>
  );
}
