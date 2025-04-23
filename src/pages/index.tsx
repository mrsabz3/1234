import Counter from "@/components/Counter";

const Index = () => {
  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="w-full max-w-md text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Counter App</h1>
        <p className="text-muted-foreground">A simple counter application built with React</p>
      </div>
      
      <Counter />
      
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>Click the buttons to change the counter value</p>
      </footer>
    </main>
  );
};

export default Index;