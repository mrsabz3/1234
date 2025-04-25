import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export function Pricing() {
  const plans = [
    {
      name: "Basic",
      description: "Essential preparation for the Aufnahmetest",
      price: "€9.99",
      duration: "monthly",
      features: [
        "Access to basic German exercises",
        "Limited math practice problems",
        "Progress tracking",
        "Mobile access"
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Premium",
      description: "Comprehensive preparation for serious students",
      price: "€19.99",
      duration: "monthly",
      features: [
        "Full access to all German exercises",
        "Complete math practice problems",
        "Detailed progress analytics",
        "Personalized study plan",
        "Timed practice tests",
        "Priority support"
      ],
      buttonText: "Get Started",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: "Ultimate",
      description: "The complete package for guaranteed success",
      price: "€29.99",
      duration: "monthly",
      features: [
        "Everything in Premium",
        "One-on-one tutoring sessions",
        "Mock interviews",
        "Guaranteed pass or money back",
        "University application guidance",
        "Lifetime access to materials"
      ],
      buttonText: "Choose Ultimate",
      buttonVariant: "outline" as const,
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose the plan that fits your needs and start your journey to German universities today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative ${
                plan.popular 
                  ? 'border-primary shadow-lg shadow-primary/10' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 -mt-3 -mr-3">
                  <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                  <span className="text-gray-500 dark:text-gray-400">/{plan.duration}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link to="/signup" className="w-full">
                  <Button 
                    variant={plan.buttonVariant} 
                    className="w-full"
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            All plans include a 7-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
}