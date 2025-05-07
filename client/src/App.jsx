import React, { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import BooksCatalogue from "./pages/BooksCatalogue";
import BorrowBooks from "./pages/BorrowBooks";
import ReturnBooks from "./pages/ReturnBooks";
import Overdue from "./pages/Overdue";
import ActivityLog from "./pages/ActivityLog";
import Navbar from "./components/Navbar";
import AddNewBook from "./components/AddNewBook";
import { Toaster } from "sonner";
import StudentDashboard from "./pages/SDashboard"; // Import student dashboard
import StudentActivityLog from "./pages/StudentActivityLog";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === "/";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType"); // Get user type from local storage

    document.title = "SK Library Management System";

    // Redirect to login page if token is not present
    if (!token && !isLoginPage) {
      navigate("/");
    }
  }, [navigate, isLoginPage]);

  return (
    <>
      <div className="w-full flex flex-row items-start">
        {!isLoginPage &&
          <div className="md:sticky top-0">
            <Sidebar />
          </div>
        }
        <div className="w-full flex flex-col">
          {!isLoginPage &&
            <div className="md:flex hidden">
              <Navbar />
            </div>
          }
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/books" element={<BooksCatalogue />} />
            <Route path="/borrow" element={<BorrowBooks />} />
            <Route path="/returnbooks" element={<ReturnBooks />} />
            <Route path="/overdues" element={<Overdue />} />
            <Route path="/activity" element={<ActivityLog />} />
            <Route path="/student-activity" element={<StudentActivityLog />} />
            <Route path="/addnew" element={<AddNewBook />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </div>
        <Toaster richColors position="top-center" />
      </div>
    </>
  );
};

export default App;
