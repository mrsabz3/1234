import { Button } from "@/components/ui/button";
import { Plus, Minus, RotateCcw } from "lucide-react";

interface CounterControlsProps {
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

const CounterControls = ({ increment, decrement, reset }: CounterControlsProps) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <Button 
        onClick={decrement} 
        variant="outline" 
        size="lg" 
        className="h-14 w-14 rounded-full border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
      >
        <Minus className="h-6 w-6" />
        <span className="sr-only">Decrement</span>
      </Button>
      
      <Button 
        onClick={reset} 
        variant="outline" 
        size="lg" 
        className="h-14 w-14 rounded-full border-2 border-muted-foreground text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <RotateCcw className="h-5 w-5" />
        <span className="sr-only">Reset</span>
      </Button>
      
      <Button 
        onClick={increment} 
        variant="outline" 
        size="lg" 
        className="h-14 w-14 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">Increment</span>
      </Button>
    </div>
  );
};

export default CounterControls;