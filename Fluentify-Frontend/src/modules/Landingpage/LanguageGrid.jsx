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
      className="py-24 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-md border border-gray-200 mb-6">
            <Globe className="w-8 h-8 text-teal-500" />
          </div>

          <h2 className="text-gray-900 text-4xl md:text-5xl mb-4">
            Choose Your <span className="text-orange-500">Language</span>
          </h2>

          <p className="text-gray-700 text-xl max-w-2xl mx-auto">
            Select from our most popular languages
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {languages.map((language, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg hover:border-teal-300 transition-all duration-300 cursor-pointer group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                {language.flag}
              </div>
              <h3 className="text-gray-900 text-xl mb-1">{language.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
