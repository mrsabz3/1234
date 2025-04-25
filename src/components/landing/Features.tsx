import { Book, Calculator, BarChart, Clock, Award, Users } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <Book className="h-10 w-10 text-primary" />,
      title: "German Language Exercises",
      description: "Practice with Lückentext exercises to improve your German language skills and vocabulary."
    },
    {
      icon: <Calculator className="h-10 w-10 text-primary" />,
      title: "Mathematics Practice",
      description: "Comprehensive mathematics exercises covering algebra, geometry, and more."
    },
    {
      icon: <BarChart className="h-10 w-10 text-primary" />,
      title: "Progress Tracking",
      description: "Monitor your improvement with detailed progress reports and analytics."
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: "Timed Practice Tests",
      description: "Simulate real exam conditions with timed practice tests to improve your speed."
    },
    {
      icon: <Award className="h-10 w-10 text-primary" />,
      title: "Personalized Learning",
      description: "Get customized exercise recommendations based on your performance."
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Community Support",
      description: "Connect with other students preparing for Studienkolleg entrance exams."
    }
  ];

  return (
    <section id="features" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Comprehensive Preparation Features
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our platform offers everything you need to successfully prepare for the Studienkolleg entrance exam.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 transition-all duration-300 hover:shadow-lg hover:transform hover:-translate-y-1"
            >
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}