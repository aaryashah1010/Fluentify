import { Lightbulb, TrendingUp, Headphones, Brain, Trophy } from 'lucide-react';

const features = [
  {
    icon: Lightbulb,
    title: 'Smart AI Instructors',
    description: 'Learn with an AI mentor that listens and guides naturally',
    color: 'orange'
  },
  {
    icon: TrendingUp,
    title: 'Track Progress',
    description: 'Visualize your growth from beginner to fluent',
    color: 'teal'
  },
  {
    icon: Headphones,
    title: 'Immersive Practice',
    description: 'Real conversations with native pronunciation feedback',
    color: 'orange'
  },
  {
    icon: Brain,
    title: 'Adaptive Learning',
    description: 'Personalized curriculum that evolves with your skills',
    color: 'teal'
  },
  {
    icon: Trophy,
    title: 'Achievement System',
    description: 'Stay motivated with milestones and rewards',
    color: 'orange'
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-gray-900 text-4xl md:text-5xl mb-4">
            Everything You Need to <span className="text-teal-500">Master</span> a Language
          </h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            Experience a revolutionary approach to language learning with cutting-edge AI technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const iconColor = feature.color === 'teal' ? 'text-teal-500' : 'text-orange-500';
            const bgColor = feature.color === 'teal' ? 'bg-teal-50' : 'bg-orange-50';

            return (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className={`w-14 h-14 ${bgColor} rounded-xl flex items-center justify-center mb-6`}>
                  <Icon className={`w-7 h-7 ${iconColor}`} />
                </div>
                <h3 className="text-gray-900 text-xl mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
