import Button from '../../components/Button';
import logo from '../../assets/fluentify_logo.jpg';

export function Header({ onNavigate }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Fluentify" className="h-28" />
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-700 hover:text-gray-900 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-gray-900 transition-colors">
              How It Works
            </a>
            <a href="#languages" className="text-gray-700 hover:text-gray-900 transition-colors">
              Languages
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-gray-700 hover:bg-gray-100"
              onClick={() => onNavigate('login')}
            >
              Log In
            </Button>

            <Button
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
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
