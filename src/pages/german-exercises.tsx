import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { GermanExercise } from "@/components/exercises/GermanExercise";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { fine } from "@/lib/fine";
import { ProtectedRoute } from "@/components/auth/route-components";
import type { Schema } from "@/lib/db-types";

type GermanExercise = Schema["germanExercises"];

function GermanExercisesContent() {
  const [exercises, setExercises] = useState<GermanExercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<GermanExercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
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
        // Fetch all German exercises
        const germanExercises = await fine.table("germanExercises").select();
        setExercises(germanExercises);
        setFilteredExercises(germanExercises);
        
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
    // Filter exercises based on search query and active tab
    let filtered = [...exercises];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(exercise => 
        exercise.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter(exercise => exercise.difficulty.toLowerCase() === activeTab);
    }
    
    setFilteredExercises(filtered);
  }, [searchQuery, activeTab, exercises]);

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

  // Sample German exercises for initial data
  const sampleExercises: GermanExercise[] = [
    {
      id: 1,
      title: "Basic German Vocabulary",
      content: "Ich [gehe] jeden Tag zur Schule. Mein [Bruder] ist älter als ich. Wir [wohnen] in einer kleinen Stadt.",
      solution: JSON.stringify(["gehe", "Bruder", "wohnen"]),
      difficulty: "Easy"
    },
    {
      id: 2,
      title: "German Grammar Practice",
      content: "Die Studenten [lernen] Deutsch. Der Professor [erklärt] die Grammatik. Wir [verstehen] die Regeln gut.",
      solution: JSON.stringify(["lernen", "erklärt", "verstehen"]),
      difficulty: "Medium"
    },
    {
      id: 3,
      title: "Advanced German Text",
      content: "Die [Wissenschaftler] haben eine neue Methode [entwickelt]. Diese Entdeckung wird die [Forschung] revolutionieren.",
      solution: JSON.stringify(["Wissenschaftler", "entwickelt", "Forschung"]),
      difficulty: "Hard"
    }
  ];

  // Insert sample exercises if none exist
  useEffect(() => {
    const insertSampleExercises = async () => {
      if (exercises.length === 0 && !isLoading) {
        try {
          await fine.table("germanExercises").insert(sampleExercises);
          setExercises(sampleExercises);
          setFilteredExercises(sampleExercises);
        } catch (error) {
          console.error("Error inserting sample exercises:", error);
        }
      }
    };

    insertSampleExercises();
  }, [exercises, isLoading]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center">
            <BookOpen className="mr-2 h-6 w-6" />
            German Exercises
          </h1>
          <p className="text-muted-foreground mt-2">
            Practice your German language skills with these Lückentext exercises.
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

        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Levels</TabsTrigger>
            <TabsTrigger value="easy">Easy</TabsTrigger>
            <TabsTrigger value="medium">Medium</TabsTrigger>
            <TabsTrigger value="hard">Hard</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <ExercisesList 
              exercises={filteredExercises} 
              isLoading={isLoading} 
              userProgress={userProgress}
              onComplete={handleExerciseComplete}
            />
          </TabsContent>
          <TabsContent value="easy" className="mt-6">
            <ExercisesList 
              exercises={filteredExercises} 
              isLoading={isLoading} 
              userProgress={userProgress}
              onComplete={handleExerciseComplete}
            />
          </TabsContent>
          <TabsContent value="medium" className="mt-6">
            <ExercisesList 
              exercises={filteredExercises} 
              isLoading={isLoading} 
              userProgress={userProgress}
              onComplete={handleExerciseComplete}
            />
          </TabsContent>
          <TabsContent value="hard" className="mt-6">
            <ExercisesList 
              exercises={filteredExercises} 
              isLoading={isLoading} 
              userProgress={userProgress}
              onComplete={handleExerciseComplete}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

interface ExercisesListProps {
  exercises: GermanExercise[];
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
          <BookOpen className="h-10 w-10 text-muted-foreground mb-4" />
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
            <CardTitle>{exercise.title}</CardTitle>
            <CardDescription>
              Difficulty: {exercise.difficulty}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GermanExercise 
              exercise={exercise} 
              onComplete={onComplete}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function GermanExercises() {
  return (
    <ProtectedRoute Component={GermanExercisesContent} />
  );
}