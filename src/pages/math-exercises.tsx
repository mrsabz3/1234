import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MathExercise } from "@/components/exercises/MathExercise";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calculator, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { fine } from "@/lib/fine";
import { ProtectedRoute } from "@/components/auth/route-components";
import type { Schema } from "@/lib/db-types";

type MathExercise = Schema["mathExercises"];

function MathExercisesContent() {
  const [exercises, setExercises] = useState<MathExercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<MathExercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [userProgress, setUserProgress] = useState<Record<number, boolean>>({});
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const session = await fine.auth.getSession();
        if (session?.data?.user) {
          setUserData(session.data.user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        // Fetch all Math exercises
        const mathExercises = await fine.table("mathExercises").select();
        setExercises(mathExercises);
        setFilteredExercises(mathExercises);
        
        // If user is logged in, fetch their progress
        if (userData?.id) {
          const progress = await fine.table("userProgress")
            .select()
            .eq("userId", userData.id);
          
          // Create a map of exerciseId -> completed status
          const progressMap: Record<number, boolean> = {};
          progress.forEach((item: any) => {
            progressMap[item.exerciseId] = item.completed;
          });
          
          setUserProgress(progressMap);
        }
      } catch (error) {
        console.error("Error fetching exercises:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userData) {
      fetchExercises();
    }
  }, [userData]);

  useEffect(() => {
    // Filter exercises based on search query, active tab, and category
    let filtered = [...exercises];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(exercise => 
        exercise.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply difficulty filter
    if (activeTab !== "all") {
      filtered = filtered.filter(exercise => exercise.difficulty.toLowerCase() === activeTab);
    }
    
    // Apply category filter
    if (activeCategory !== "all") {
      filtered = filtered.filter(exercise => exercise.category === activeCategory);
    }
    
    setFilteredExercises(filtered);
  }, [searchQuery, activeTab, activeCategory, exercises]);

  const handleExerciseComplete = async (exerciseId: number, score: number) => {
    if (!userData?.id) return;
    
    try {
      // Check if progress entry already exists
      const existingProgress = await fine.table("userProgress")
        .select()
        .eq("userId", userData.id)
        .eq("exerciseId", exerciseId);
      
      if (existingProgress && existingProgress.length > 0) {
        // Update existing progress
        await fine.table("userProgress")
          .update({
            completed: true,
            score,
            completedAt: new Date().toISOString()
          })
          .eq("userId", userData.id)
          .eq("exerciseId", exerciseId);
      } else {
        // Create new progress entry
        await fine.table("userProgress").insert({
          userId: userData.id,
          exerciseId,
          completed: true,
          score,
          completedAt: new Date().toISOString()
        });
      }
      
      // Update local state
      setUserProgress(prev => ({
        ...prev,
        [exerciseId]: true
      }));
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  // Sample Math exercises for initial data
  const sampleExercises: MathExercise[] = [
    {
      id: 1,
      title: "Basic Algebra",
      content: "Solve for x: 2x + 5 = 15",
      solution: "5",
      difficulty: "Easy",
      category: "Algebra"
    },
    {
      id: 2,
      title: "Geometry Problem",
      content: "Calculate the area of a circle with radius 4 cm. Use π = 3.14.",
      solution: "50.24",
      difficulty: "Medium",
      category: "Geometry"
    },
    {
      id: 3,
      title: "Calculus Derivative",
      content: "Find the derivative of f(x) = x² + 3x + 2",
      solution: "2x + 3",
      difficulty: "Hard",
      category: "Calculus"
    }
  ];

  // Insert sample exercises if none exist
  useEffect(() => {
    const insertSampleExercises = async () => {
      if (exercises.length === 0 && !isLoading) {
        try {
          await fine.table("mathExercises").insert(sampleExercises);
          setExercises(sampleExercises);
          setFilteredExercises(sampleExercises);
        } catch (error) {
          console.error("Error inserting sample exercises:", error);
        }
      }
    };

    insertSampleExercises();
  }, [exercises, isLoading]);

  // Get unique categories
  const categories = ["all", ...new Set(exercises.map(ex => ex.category))];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center">
            <Calculator className="mr-2 h-6 w-6" />
            Mathematics Exercises
          </h1>
          <p className="text-muted-foreground mt-2">
            Practice your math skills with these exercises covering various topics.
          </p>
        </div>

        <div className="flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search exercises..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Difficulty Level</h3>
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Levels</TabsTrigger>
                <TabsTrigger value="easy">Easy</TabsTrigger>
                <TabsTrigger value="medium">Medium</TabsTrigger>
                <TabsTrigger value="hard">Hard</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Category</h3>
            <Tabs defaultValue="all" onValueChange={setActiveCategory}>
              <TabsList className="flex flex-wrap">
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="mt-6">
          <ExercisesList 
            exercises={filteredExercises} 
            isLoading={isLoading} 
            userProgress={userProgress}
            onComplete={handleExerciseComplete}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

interface ExercisesListProps {
  exercises: MathExercise[];
  isLoading: boolean;
  userProgress: Record<number, boolean>;
  onComplete: (exerciseId: number, score: number) => void;
}

function ExercisesList({ exercises, isLoading, userProgress, onComplete }: ExercisesListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-pulse text-center">
          <p>Loading exercises...</p>
        </div>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Calculator className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">No exercises found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {exercises.map((exercise) => (
        <Card key={exercise.id} className="relative">
          {userProgress[exercise.id!] && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                Completed
              </Badge>
            </div>
          )}
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{exercise.title}</CardTitle>
                <CardDescription>
                  Difficulty: {exercise.difficulty} | Category: {exercise.category}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <MathExercise 
              exercise={exercise} 
              onComplete={onComplete}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function MathExercises() {
  return (
    <ProtectedRoute Component={MathExercisesContent} />
  );
}