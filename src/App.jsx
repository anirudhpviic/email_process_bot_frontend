import React, { useState } from "react";
import { Button } from "./components/ui/button";
import Home from "./pages/home";
import Analyze from "./pages/analyze";

const App = () => {
  const [page, setPage] = useState("home");
  return (
    <div>
      <div className="flex gap-4 mx-8 mt-4">
        <Button
          onClick={() => setPage("home")}
          className={`${page === "analyze" ? "bg-gray-400" : ""}`}
        >
          Home
        </Button>
        <Button
          onClick={() => setPage("analyze")}
          className={`${page === "home" ? "bg-gray-400" : ""}`}
        >
          Analyze
        </Button>
      </div>
      {page === "home" ? <Home /> : <Analyze />}
    </div>
  );
};

export default App;
