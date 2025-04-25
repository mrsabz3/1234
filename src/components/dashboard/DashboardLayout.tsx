import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Calculator, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Home
} from "lucide-react";
import { fine } from "@/lib/fine";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const session = await fine.auth.getSession();
        if (session?.data?.user) {
          setUserData(session.data.user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { 
      name: "Home", 
      path: "/", 
      icon: <Home className="h-5 w-5 mr-3" /> 
    },
    { 
      name: "Dashboard", 
      path: "/dashboard", 
      icon: <BarChart3 className="h-5 w-5 mr-3" /> 
    },
    { 
      name: "German Exercises", 
      path: "/german-exercises", 
      icon: <BookOpen className="h-5 w-5 mr-3" /> 
    },
    { 
      name: "Math Exercises", 
      path: "/math-exercises", 
      icon: <Calculator className="h-5 w-5 mr-3" /> 
    },
    { 
      name: "Settings", 
      path: "/settings", 
      icon: <Settings className="h-5 w-5 mr-3" /> 
    }
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar for desktop */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-primary">StudienkollegPrep</span>
            </Link>
            <button 
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={closeSidebar}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {userData && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">
                    {userData.name?.charAt(0) || userData.email?.charAt(0) || "U"}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {userData.name || "User"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {userData.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={closeSidebar}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Link to="/logout">
              <Button variant="outline" className="w-full flex items-center justify-center">
                <LogOut className="h-5 w-5 mr-2" />
                <span>Log Out</span>
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <button 
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={toggleSidebar}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="text-xl font-semibold text-gray-800 dark:text-white lg:hidden">
              StudienkollegPrep
            </div>
            <div className="flex items-center space-x-4">
              {/* Add notification icons or user dropdown here if needed */}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 md:p-6">
          {children}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}
    </div>
  );
}