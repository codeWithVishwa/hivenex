import { Routes, Route } from "react-router-dom";
import Site from "./pages/Site";
import Admin from "./pages/Admin";
import BlogPost from "./pages/BlogPost";
import ProjectDetail from "./pages/ProjectDetail";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Site />} />
      <Route path="/blog/:id" element={<BlogPost />} />
      <Route path="/work/:id" element={<ProjectDetail />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
