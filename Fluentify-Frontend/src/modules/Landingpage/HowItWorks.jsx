import { UserPlus, Target, MessageSquare, Sparkles } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    step: '01',
    title: 'Create Your Profile',
    description: 'Tell us about your language goals and current level'
  },
  {
    icon: Target,
    step: '02',
    title: 'Get Personalized Plan',
    description: 'AI creates a custom learning path just for you'
  },
  {
    icon: MessageSquare,
    step: '03',
    title: 'Start Practicing',
    description: 'Engage in real conversations with AI instructors'
  },
  {
    icon: Sparkles,
    step: '04',
    title: 'Achieve Fluency',
    description: 'Track your progress and celebrate milestones'
  }
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-900 relative overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, rgba(99,102,241,0.2) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-slate-50 text-4xl md:text-5xl mb-4">
            Your Journey to <span className="text-orange-400">Fluency</span>
          </h2>
          <p className="text-slate-300 text-xl max-w-2xl mx-auto">
            A simple, proven process to master any language in months, not years
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {steps.map((item, index) => {
            const Icon = item.icon;
            const isEven = index % 2 === 0;

            return (
              <div key={index} className="relative">
                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-[calc(50%+28px)] w-[calc(100%-56px)] h-0.5 bg-gradient-to-r from-teal-300 to-orange-300" />
                )}

                <div className="text-center relative z-10">
                  <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-slate-950 border-2 border-white/10 shadow-md mb-6 mx-auto">
                    <Icon
                      className={`w-12 h-12 ${
                        isEven ? 'text-teal-500' : 'text-orange-500'
                      }`}
                    />
                  </div>
                  <div
                    className={`text-6xl mb-4 ${
                      isEven ? 'text-teal-200' : 'text-orange-200'
                    }`}
                  >
                    {item.step}
                  </div>
                  <h3 className="text-slate-50 text-xl mb-3">{item.title}</h3>
                  <p className="text-slate-300">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
