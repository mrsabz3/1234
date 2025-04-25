export type Schema = {
  exercises: {
    id?: number;
    type: string;
    title: string;
    content: string;
    difficulty: string;
    createdAt?: string;
  };
  germanExercises: {
    id?: number;
    title: string;
    content: string;
    solution: string;
    difficulty: string;
  };
  mathExercises: {
    id?: number;
    title: string;
    content: string;
    solution: string;
    difficulty: string;
    category: string;
  };
  userProgress: {
    id?: number;
    userId: string;
    exerciseId: number;
    completed?: boolean;
    score?: number | null;
    completedAt?: string | null;
  };
}