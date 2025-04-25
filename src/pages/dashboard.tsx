import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Calculator, TrendingUp, Award } from "lucide-react";
import { fine } from "@/lib/fine";
import { ProtectedRoute } from "@/components/auth/route-components";

function DashboardContent() {
  const [germanProgress, setGermanProgress] = useState(0);
  const [mathProgress, setMathProgress] = useState(0);
  const [totalExercises, setTotalExercises] = useState({ german: 0, math: 0 });
  const [completedExercises, setCompletedExercises] = useState({ german: 0, math: 0 });
  const [isLoading, setIsLoading] = useState(true);
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
    const fetchExercisesData = async () => {
      try {
        // Fetch German exercises
        const germanExercises = await fine.table("germanExercises").select();
        
        // Fetch Math exercises
        const mathExercises = await fine.table("mathExercises").select();
        
        // Fetch user progress if user is logged in
        if (userData?.id) {
          const userProgress = await fine.table("userProgress")
            .select()
            .eq("userId", userData.id);
          
          // Calculate completed exercises
          const completedGerman = userProgress.filter(
            (progress: any) => progress.completed && 
            germanExercises.some((ex: any) => ex.id === progress.exerciseId)
          ).length;
          
          const completedMath = userProgress.filter(
            (progress: any) => progress.completed && 
            mathExercises.some((ex: any) => ex.id === progress.exerciseId)
          ).length;
          
          setCompletedExercises({
            german: completedGerman,
            math: completedMath
          });
          
          // Calculate progress percentages
          setGermanProgress(germanExercises.length > 0 
            ? Math.round((completedGerman / germanExercises.length) * 100) 
            : 0);
          
          setMathProgress(mathExercises.length > 0 
            ? Math.round((completedMath / mathExercises.length) * 100) 
            : 0);
        }
        
        setTotalExercises({
          german: germanExercises.length,
          math: mathExercises.length
        });
        
      } catch (error) {
        console.error("Error fetching exercises data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userData) {
      fetchExercisesData();
    }
  }, [userData]);

  // Mock data for recent activity
  const recentActivity = [
    { type: "german", action: "Completed", title: "Basic Vocabulary Exercise", date: "2 hours ago" },
    { type: "math", action: "Started", title: "Algebra Fundamentals", date: "Yesterday" },
    { type: "german", action: "Scored 80%", title: "Grammar Practice", date: "3 days ago" }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back{userData?.name ? `, ${userData.name}` : ""}! Track your progress and continue your preparation.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">German Progress</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{germanProgress}%</div>
              <Progress value={germanProgress} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {completedExercises.german} of {totalExercises.german} exercises completed
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Math Progress</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mathProgress}%</div>
              <Progress value={mathProgress} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {completedExercises.math} of {totalExercises.math} exercises completed
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : `${Math.round((germanProgress + mathProgress) / 2)}%`}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Combined performance score
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Achievements</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : completedExercises.german + completedExercises.math}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Total exercises completed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Exercise Categories */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>German Exercises</CardTitle>
              <CardDescription>
                Practice your German language skills with Lückentext exercises
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <BookOpen className="h-10 w-10 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    {isLoading ? "Loading..." : `${totalExercises.german} exercises available`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Focus on vocabulary, grammar, and comprehension
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link to="/german-exercises">
                <Button>Start German Practice</Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Mathematics Exercises</CardTitle>
              <CardDescription>
                Improve your math skills with practice problems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Calculator className="h-10 w-10 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    {isLoading ? "Loading..." : `${totalExercises.math} exercises available`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Covers algebra, geometry, and basic calculus
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link to="/math-exercises">
                <Button>Start Math Practice</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest exercise attempts and completions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  {activity.type === "german" ? (
                    <BookOpen className="h-5 w-5 text-primary" />
                  ) : (
                    <Calculator className="h-5 w-5 text-primary" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{activity.action} <span className="font-bold">{activity.title}</span></p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute Component={DashboardContent} />
  );
}