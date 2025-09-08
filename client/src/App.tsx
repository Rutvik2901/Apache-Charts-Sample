import React from "react";
import UsersChart from "./components/UsersChart";

const App: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">User Data</h1>
      <UsersChart />
    </div>
  );
};

export default App;
