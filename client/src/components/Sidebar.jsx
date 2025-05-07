import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Library,
  HandHelping,
  BookCheck,
  Clock8,
  ChartColumn,
} from "lucide-react";
import bankai from "../assets/bankai.png";

const Icon = ({ IconComponent, ...props }) => (
  <IconComponent {...props} className="w-5 h-5" />
);

const NavItem = ({ to, icon: IconComponent, children, badge }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const activeClass = isActive
    ? "text-zinc-50 px-4 bg-black hover:text-black"
    : "text-muted-foreground";

  return (
    <li>
      <Link
        to={to}
        className={`flex items-center p-2 space-x-3 rounded-lg hover:bg-gray-100 ${activeClass}`}
      >
        <Icon IconComponent={IconComponent} />
        <span>{children}</span>
      </Link>
    </li>
  );
};

const NavSection = ({ title, children }) => (
  <div>
    <h3 className="text-xs font-semibold text-muted-foreground">{title}</h3>
    <ul className="mt-2 space-y-2">{children}</ul>
  </div>
);

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const roleType = localStorage.getItem("userType");
  const profile = JSON.parse(localStorage.getItem("user"));
  const bankaid = roleType === "admin" ? profile.admin : profile.student;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    window.location.href = "/";
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex h-screen">
      <div className="fixed w-full z-50 top-0 md:hidden flex justify-between items-center p-4 bg-gray-100 border-b">
        <img src={bankai} className="w-24" alt="Logo" />
        <button
          onClick={toggleSidebar}
          className="text-gray-800 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            ></path>
          </svg>
        </button>
      </div>
      <div
        className={`fixed md:relative md:translate-x-0 top-0 left-0 h-full bg-white border-r transition-transform z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{ width: "16rem" }}
      >
        <aside className="flex flex-col justify-between h-full">
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-start px-4 h-24 border-b">
              <img src={bankai} className="w-full" alt="Logo" />
            </div>
            <nav className="p-4 space-y-4 overflow-y-auto">
              <NavSection title="MAIN">
                {roleType === "admin" && (
                  <>
                    <NavItem to="/dashboard" icon={LayoutDashboardIcon}>
                      Dashboard
                    </NavItem>
                    <NavItem to="/books" icon={Library}>
                      Books Catalogue
                    </NavItem>
                    <NavItem to="/borrow" icon={HandHelping}>
                      Issue Books
                    </NavItem>
                    <NavItem to="/returnbooks" icon={BookCheck}>
                      Return Books
                    </NavItem>
                    {/* <NavItem to="/students" icon={GroupIcon}>
                      Students
                    </NavItem> */}
                    {/* <NavItem to="/overdues" icon={Clock8}>
                      Overdues
                    </NavItem> */}
                    <NavItem to="/activity" icon={ChartColumn}>
                      Activity log
                    </NavItem>
                  </>
                )}
                {roleType === "student" && (
                  <>
                    <NavItem to="/student-dashboard" icon={LayoutDashboardIcon}>
                      Dashboard
                    </NavItem>
                    <NavItem to="/books" icon={Library}>
                      Search Books
                    </NavItem>
                    <NavItem to="/student-activity" icon={ChartColumn}>
                      My Activity log
                    </NavItem>
                  </>
                )}
              </NavSection>
            </nav>
          </div>
          <div className="w-full flex flex-col items-center">
            <div className="w-full flex items-center p-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center p-2 bg-red-500 text-white rounded-lg"
              >
                Logout
              </button>
            </div>
            <div className="hover:bg-zinc-100 group cursor-pointer flex items-center justify-start w-full p-4 border-t">
              <img src={'https://avatar.iran.liara.run/public/boy?username=' + bankaid?.name} className="w-10 h-10 rounded-full" alt="Profile" />
              <div className="ml-3">
                <h3 className="text-sm font-semibold">
                  {bankaid && bankaid.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {bankaid && bankaid.email}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const GroupIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const LayoutDashboardIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

export default Sidebar;
