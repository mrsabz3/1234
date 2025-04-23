import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import CounterControls from "./CounterControls";
import CustomValueInput from "./CustomValueInput";

const Counter = () => {
  const [count, setCount] = useState<number>(0);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);
  const reset = () => setCount(0);
  const setCustomValue = (value: number) => setCount(value);

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-medium text-muted-foreground mb-2">Current Count</h2>
            <div className="text-7xl font-bold py-6 px-8 rounded-lg bg-secondary text-primary">
              {count}
            </div>
          </div>
          
          <CounterControls 
            increment={increment} 
            decrement={decrement} 
            reset={reset} 
          />
          
          <CustomValueInput setCustomValue={setCustomValue} />
        </div>
      </CardContent>
    </Card>
  );
};

export default Counter;