import Button from '../../components/Button';
import { ArrowRight } from 'lucide-react';

export function Hero({ onNavigate }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950">
      {/* Overlay pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, rgba(99,102,241,0.1) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-24 pb-16">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-white text-6xl md:text-7xl lg:text-8xl mb-6">
            Start Your Journey,
          </h1>
          <h2 className="text-5xl md:text-6xl lg:text-7xl mb-8">
            <span className="text-orange-500">Unlock </span>
            <span className="text-teal-500">Your Voice</span>
          </h2>

          <p className="text-slate-100 text-xl md:text-2xl mb-12 max-w-2xl mx-auto">
            Master any language with AI-powered personalized instruction
          </p>

          <div className="flex items-center justify-center">
            <Button
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-6 text-lg group"
              onClick={() => onNavigate('signup')}
            >
              Start Learning 
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
