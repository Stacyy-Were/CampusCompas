import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import FindInstitution from "./pages/FindInstitution";
import Institutions from "./pages/Institutions";
import AboutUs from "./pages/AboutUs";
import ForSchools from "./pages/ForSchools";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";
import SchoolProtectedRoute from "./components/SchoolProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/find" element={<FindInstitution />} />
        <Route path="/institutions" element={<Institutions />} />
        <Route path="/about" element={<AboutUs />} />
        <Route
          path="/schools"
          element={
            <SchoolProtectedRoute>
              <ForSchools />
            </SchoolProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
