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
    <section id="features" className="py-24 bg-transparent">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-slate-50 text-4xl md:text-5xl mb-4">
            Everything You Need to <span className="text-teal-400">Master</span> a Language
          </h2>
          <p className="text-slate-300 text-xl max-w-2xl mx-auto">
            Experience a revolutionary approach to language learning with cutting-edge AI technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const iconColor = feature.color === 'teal' ? 'text-teal-300' : 'text-orange-300';
            const bgColor = feature.color === 'teal' ? 'bg-teal-500/20' : 'bg-orange-500/20';

            return (
              <div
                key={index}
                className="bg-slate-900/80 rounded-2xl p-8 border border-white/10 hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <div className={`w-14 h-14 ${bgColor} rounded-xl flex items-center justify-center mb-6`}>
                  <Icon className={`w-7 h-7 ${iconColor}`} />
                </div>
                <h3 className="text-slate-50 text-xl mb-3">{feature.title}</h3>
                <p className="text-slate-300">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
