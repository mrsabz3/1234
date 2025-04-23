import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomValueInputProps {
  setCustomValue: (value: number) => void;
}

const CustomValueInput = ({ setCustomValue }: CustomValueInputProps) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numValue = Number(inputValue);
    
    if (!isNaN(numValue)) {
      setCustomValue(numValue);
      setInputValue("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-2">
      <Label htmlFor="custom-value" className="text-sm font-medium">
        Set Custom Value
      </Label>
      <div className="flex gap-2">
        <Input
          id="custom-value"
          type="number"
          placeholder="Enter a number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={!inputValue}>Set</Button>
      </div>
    </form>
  );
};

export default CustomValueInput;