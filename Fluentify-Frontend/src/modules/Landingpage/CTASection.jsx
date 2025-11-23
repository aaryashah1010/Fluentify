import Button from '../../components/Button';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CTASection({ onNavigate }) {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-950 via-teal-900 to-orange-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/25 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/25 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">

          <h2 className="text-slate-50 text-4xl md:text-6xl mb-6">
            Ready to Start Your
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-teal-500">
              Language Journey?
            </span>
          </h2>

          <p className="text-slate-300 text-xl mb-12 max-w-2xl mx-auto">
            Create your account today and take the first step towards fluency.
          </p>

          <div className="flex items-center justify-center">
            <Button
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-7 text-lg group"
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
