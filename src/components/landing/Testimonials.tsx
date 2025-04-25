import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      id: 1,
      content: "StudienkollegPrep helped me pass the Aufnahmetest on my first attempt. The German exercises were particularly helpful for improving my language skills.",
      author: "Maria Schmidt",
      role: "Computer Science Student",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      university: "TU Berlin"
    },
    {
      id: 2,
      content: "The math practice problems were exactly what I needed to prepare for the entrance exam. I'm now studying Engineering at my dream university!",
      author: "Ahmed Hassan",
      role: "Engineering Student",
      avatar: "https://randomuser.me/api/portraits/men/54.jpg",
      university: "RWTH Aachen"
    },
    {
      id: 3,
      content: "As an international student, I was worried about the language barrier. The Lückentext exercises helped me improve my German significantly.",
      author: "Sophia Chen",
      role: "Business Administration Student",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      university: "University of Mannheim"
    },
    {
      id: 4,
      content: "The personalized progress tracking helped me focus on my weak areas. I passed the Aufnahmetest with a score much higher than I expected.",
      author: "Carlos Rodriguez",
      role: "Medicine Student",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      university: "Heidelberg University"
    },
    {
      id: 5,
      content: "I tried several preparation platforms, but StudienkollegPrep was by far the most comprehensive and effective. Highly recommended!",
      author: "Olga Petrova",
      role: "Architecture Student",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      university: "TU Munich"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleTestimonials = 3;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 1 >= testimonials.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 1 < 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  // Create a circular array of testimonials for infinite scrolling
  const getVisibleTestimonials = () => {
    const result = [];
    for (let i = 0; i < visibleTestimonials; i++) {
      const index = (currentIndex + i) % testimonials.length;
      result.push(testimonials[index]);
    }
    return result;
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Success Stories
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Hear from students who successfully entered German universities after preparing with our platform.
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:flex justify-between absolute top-1/2 -translate-y-1/2 w-full z-10 px-4">
            <Button
              variant="outline"
              size="icon"
              className="bg-white dark:bg-gray-700 rounded-full shadow-md"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="bg-white dark:bg-gray-700 rounded-full shadow-md"
              onClick={nextSlide}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {getVisibleTestimonials().map((testimonial) => (
              <Card key={testimonial.id} className="border-none shadow-lg">
                <CardContent className="p-8">
                  <Quote className="h-8 w-8 text-primary/30 mb-4" />
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.author}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.role}, {testimonial.university}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-8 md:hidden">
            <Button
              variant="outline"
              size="icon"
              className="mr-2"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}