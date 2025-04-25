import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export function Hero() {
  return (
    <div className="relative bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Master the <span className="text-primary">Aufnahmetest</span> for Studienkolleg
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg">
              Comprehensive preparation for German and Mathematics exams to secure your place in German universities.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-primary mr-2" />
                <span className="text-gray-700 dark:text-gray-300">Interactive German language exercises</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-primary mr-2" />
                <span className="text-gray-700 dark:text-gray-300">Comprehensive mathematics practice</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-primary mr-2" />
                <span className="text-gray-700 dark:text-gray-300">Personalized progress tracking</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Preparing Now
                </Button>
              </Link>
              <Link to="#features">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <div className="relative">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                  alt="Students studying" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <p className="text-lg font-medium">Join 10,000+ students</p>
                    <p className="text-sm opacity-80">who successfully entered German universities</p>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
          <path 
            fill="#ffffff" 
            fillOpacity="1" 
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            className="dark:fill-gray-900"
          ></path>
        </svg>
      </div>
    </div>
  );
}