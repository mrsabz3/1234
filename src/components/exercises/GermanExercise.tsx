import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { fine } from "@/lib/fine";
import type { Schema } from "@/lib/db-types";

type GermanExercise = Schema["germanExercises"];

interface GermanExerciseProps {
  exercise: GermanExercise;
  onComplete?: (exerciseId: number, score: number) => void;
}

export function GermanExercise({ exercise, onComplete }: GermanExerciseProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [totalGaps, setTotalGaps] = useState(0);
  const [parsedContent, setParsedContent] = useState<Array<{ type: 'text' | 'gap', content: string, index?: number }>>([]);

  // Parse the content to identify gaps
  useEffect(() => {
    if (!exercise?.content) return;

    const gapRegex = /\[([^\]]*)\]/g;
    let match;
    let lastIndex = 0;
    const parts = [];
    let gapIndex = 0;
    
    while ((match = gapRegex.exec(exercise.content)) !== null) {
      // Add text before the gap
      if (match.index > lastIndex) {
        parts.push({
          type: 'text' as const,
          content: exercise.content.substring(lastIndex, match.index)
        });
      }
      
      // Add the gap
      parts.push({
        type: 'gap' as const,
        content: match[1], // The content inside the brackets
        index: gapIndex++
      });
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text after the last gap
    if (lastIndex < exercise.content.length) {
      parts.push({
        type: 'text' as const,
        content: exercise.content.substring(lastIndex)
      });
    }
    
    setParsedContent(parts);
    setTotalGaps(gapIndex);
  }, [exercise]);

  const handleInputChange = (index: number, value: string) => {
    setAnswers(prev => ({ ...prev, [index]: value }));
  };

  const checkAnswers = () => {
    if (!exercise?.solution) return;
    
    try {
      const solutions = JSON.parse(exercise.solution);
      let correctCount = 0;
      
      Object.entries(answers).forEach(([index, answer]) => {
        const numIndex = Number(index);
        if (solutions[numIndex] && answer.toLowerCase().trim() === solutions[numIndex].toLowerCase().trim()) {
          correctCount++;
        }
      });
      
      const calculatedScore = Math.round((correctCount / totalGaps) * 100);
      setScore(calculatedScore);
      setIsSubmitted(true);
      
      if (onComplete && exercise.id) {
        onComplete(exercise.id, calculatedScore);
      }
    } catch (error) {
      console.error("Error parsing solutions:", error);
    }
  };

  const resetExercise = () => {
    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
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

  const renderContent = () => {
    return parsedContent.map((part, idx) => {
      if (part.type === 'text') {
        return <span key={idx}>{part.content}</span>;
      } else if (part.type === 'gap' && typeof part.index === 'number') {
        return (
          <span key={idx} className="inline-block mx-1">
            <Input
              type="text"
              value={answers[part.index] || ''}
              onChange={(e) => handleInputChange(part.index!, e.target.value)}
              className={`w-24 inline-block ${
                isSubmitted 
                  ? answers[part.index] && JSON.parse(exercise.solution)[part.index]?.toLowerCase().trim() === answers[part.index].toLowerCase().trim()
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                  : ""
              }`}
              disabled={isSubmitted}
              placeholder="..."
            />
            {isSubmitted && (
              <span className="ml-1">
                {answers[part.index] && JSON.parse(exercise.solution)[part.index]?.toLowerCase().trim() === answers[part.index].toLowerCase().trim() 
                  ? <CheckCircle className="inline h-4 w-4 text-green-500" />
                  : <XCircle className="inline h-4 w-4 text-red-500" />
                }
              </span>
            )}
          </span>
        );
      }
      return null;
    });
  };

  const renderScoreMessage = () => {
    if (score >= 80) {
      return (
        <div className="flex items-center text-green-600">
          <CheckCircle className="mr-2 h-5 w-5" />
          <span>Excellent! You scored {score}%</span>
        </div>
      );
    } else if (score >= 60) {
      return (
        <div className="flex items-center text-yellow-600">
          <AlertCircle className="mr-2 h-5 w-5" />
          <span>Good job! You scored {score}%</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-red-600">
          <XCircle className="mr-2 h-5 w-5" />
          <span>Keep practicing. You scored {score}%</span>
        </div>
      );
    }
  };

  if (!exercise) {
    return <div>Loading exercise...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{exercise.title}</CardTitle>
          {renderDifficultyBadge()}
        </div>
        <CardDescription>
          Fill in the gaps with the correct German words.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-lg leading-relaxed">
          {renderContent()}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-4">
        {isSubmitted && (
          <div className="w-full mb-4">
            {renderScoreMessage()}
          </div>
        )}
        <div className="flex space-x-4">
          {!isSubmitted ? (
            <Button onClick={checkAnswers} disabled={Object.keys(answers).length === 0}>
              Check Answers
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