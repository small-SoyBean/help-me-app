import './App.css'
import { TestComponent } from "./components/TestComponent.tsx";

function App() {
  return (
    <>
      <h1>HelpMe</h1>
      <TestComponent
          title="11/12/2026"
          description="Initial build. Woo hoo!"
      />
    </>
  );
}

export default App
