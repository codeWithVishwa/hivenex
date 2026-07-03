import { Routes, Route } from "react-router-dom";
import Site from "./pages/Site";
import Admin from "./pages/Admin";
import BlogPost from "./pages/BlogPost";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Site />} />
      <Route path="/blog/:id" element={<BlogPost />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
