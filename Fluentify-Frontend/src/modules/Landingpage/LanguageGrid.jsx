import { Globe } from 'lucide-react';

const languages = [
  { name: 'Spanish', flag: '🇪🇸' },
  { name: 'French', flag: '🇫🇷' },
  { name: 'German', flag: '🇩🇪' },
  { name: 'Japanese', flag: '🇯🇵' },
  { name: 'Hindi', flag: '🇮🇳' },
  { name: 'Italian', flag: '🇮🇹' }
];

export function LanguageGrid() {
  return (
    <section
      id="languages"
      className="py-24 bg-gradient-to-br from-orange-50 via-white to-teal-50"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-teal-400 shadow-lg mb-6">
            <Globe className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-gray-900 text-4xl md:text-5xl mb-3">
            Choose Your
            <span className="ml-2 bg-gradient-to-r from-orange-400 to-teal-400 bg-clip-text text-transparent">
              Language
            </span>
          </h2>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Start with a language module that matches your goals. You can always
            switch or add more later.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {languages.map((language, index) => (
            <div
              key={index}
              className="bg-white/90 rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-teal-300 transition-all duration-300 cursor-pointer group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                {language.flag}
              </div>
              <h3 className="text-gray-900 text-xl font-semibold mb-1">
                {language.name}
              </h3>
              <p className="text-xs font-medium inline-flex items-center px-2 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-100">
                Core module
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
