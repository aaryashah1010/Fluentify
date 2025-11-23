import Button from '../../components/Button';
import logo from '../../assets/fluentify_logo.jpg';

export function Header({ onNavigate }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-slate-950/95 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Fluentify" className="h-20 rounded-xl shadow-md bg-white/90" />
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-200 hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-slate-200 hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#languages" className="text-slate-200 hover:text-white transition-colors">
              Languages
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-slate-200 hover:bg-white/10"
              onClick={() => onNavigate('login')}
            >
              Log In
            </Button>

            <Button
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md"
              onClick={() => onNavigate('signup')}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
