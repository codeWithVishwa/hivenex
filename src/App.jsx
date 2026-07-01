import { Routes, Route } from "react-router-dom";
import Site from "./pages/Site";
import Admin from "./pages/Admin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Site />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
