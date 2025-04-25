import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { fine } from "@/lib/fine";
import type { Schema } from "@/lib/db-types";

type MathExercise = Schema["mathExercises"];

interface MathExerciseProps {
  exercise: MathExercise;
  onComplete?: (exerciseId: number, score: number) => void;
}

export function MathExercise({ exercise, onComplete }: MathExerciseProps) {
  const [answer, setAnswer] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    if (!exercise?.solution) return;
    
    try {
      const solution = exercise.solution.trim();
      const userAnswer = answer.trim();
      const correct = userAnswer === solution;
      
      setIsCorrect(correct);
      setIsSubmitted(true);
      
      if (onComplete && exercise.id) {
        onComplete(exercise.id, correct ? 100 : 0);
      }
    } catch (error) {
      console.error("Error checking solution:", error);
    }
  };

  const resetExercise = () => {
    setAnswer("");
    setIsSubmitted(false);
    setIsCorrect(false);
  };

  const renderDifficultyBadge = () => {
    const color = 
      exercise.difficulty === "Easy" ? "bg-green-100 text-green-800" :
      exercise.difficulty === "Medium" ? "bg-yellow-100 text-yellow-800" :
      "bg-red-100 text-red-800";
    
    return (
      <Badge variant="outline" className={color}>
        {exercise.difficulty}
      </Badge>
    );
  };

  const renderCategoryBadge = () => {
    return (
      <Badge variant="secondary" className="ml-2">
        {exercise.category}
      </Badge>
    );
  };

  if (!exercise) {
    return <div>Loading exercise...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{exercise.title}</CardTitle>
            <div className="flex mt-2">
              {renderDifficultyBadge()}
              {renderCategoryBadge()}
            </div>
          </div>
        </div>
        <CardDescription>
          Solve the following math problem.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-lg leading-relaxed math-content">
            <div dangerouslySetInnerHTML={{ __html: exercise.content }} />
          </div>
          
          <div className="mt-6">
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Answer:
            </label>
            <Input
              id="answer"
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className={`w-full ${
                isSubmitted 
                  ? isCorrect
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                  : ""
              }`}
              disabled={isSubmitted}
              placeholder="Enter your answer here..."
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-4">
        {isSubmitted && (
          <div className="w-full mb-4">
            {isCorrect ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="mr-2 h-5 w-5" />
                <span>Correct! Well done.</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <XCircle className="mr-2 h-5 w-5" />
                <span>Incorrect. The correct answer is: {exercise.solution}</span>
              </div>
            )}
          </div>
        )}
        <div className="flex space-x-4">
          {!isSubmitted ? (
            <Button onClick={handleSubmit} disabled={!answer.trim()}>
              Submit Answer
            </Button>
          ) : (
            <Button onClick={resetExercise} variant="outline">
              Try Again
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}