import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Search, BookText, Clock5, Handshake } from "lucide-react";
import ActivityTable from "../components/Dashboard/ActivityTable";
import { validateAdminToken } from "../services/authServices";

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const profile = localStorage.getItem("user");
      setUser(JSON.parse(profile));
      // console.log("Token:", token);

      if (!token) {
        navigate("/");
        return;
      }

      try {
        const response = await validateAdminToken(token);
        // console.log('Response:', response);
        setIsAuthenticated(true);
        setUserRole(response.role);
      } catch (error) {
        console.error("Authentication check failed:", error);
        navigate("/");
      }
    };

    checkAuth();
  }, [navigate]);

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }
  const bankai = userRole === "admin" ? user.student : user.admin;
  // console.log(bankai)

  return (
    <>
      <div className="w-full flex mt-12 md:mt-0 flex-col gap-4 px-4 py-4 items-center">
        <div className="w-full px-4 flex-col md:flex-row flex py-5 gap-5">
          <div className="w-full md:w-1/3 flex bg-gradient-to-r gap-2 from-violet-200 to-pink-200 rounded-3xl text-violet-950 items-start px-8 flex-col py-10 ">
            <h1 className="text-3xl font-bold">Hello {bankai && bankai.name} 👋!</h1>
            <p className="text-lg popp">Welcome to the dashboard</p>
          </div>
          <div className="w-full md:w-2/3 stats shadow border">
            <div className="stat flex justify-around px-6 items-center flex-row-reverse">
              <div className="stat-figure ">
                <Handshake className="size-10 text-zinc-500" />
              </div>
              <div className="flex flex-col items-start gap-2">
                <div className="stat-title text-xl">Borrowed books</div>
                <div className="stat-value popp">375</div>
              </div>
              {/* <div className="stat-desc">Jan 1st - Feb 1st</div> */}
            </div>
            <div className="stat flex justify-around px-6 items-center flex-row-reverse">
              <div className="stat-figure ">
                <Clock5 className="size-10 text-zinc-500" />
              </div>
              <div className="flex flex-col items-start gap-2">
                <div className="stat-title text-xl">Overdue</div>
                <div className="stat-value popp">375</div>
              </div>
              {/* <div className="stat-desc">Jan 1st - Feb 1st</div> */}
            </div>
            <div className="stat flex justify-around px-6 items-center flex-row-reverse">
              <div className="stat-figure ">
                <BookText className="size-10 text-zinc-500" />
              </div>
              <div className="flex flex-col items-start gap-2">
                <div className="stat-title text-xl">Available books</div>
                <div className="stat-value popp">25,785</div>
              </div>
              {/* <div className="stat-desc">Jan 1st - Feb 1st</div> */}
            </div>
          </div>
        </div>
        <ActivityTable />
      </div>
    </>
  );
};

export default Dashboard;
