import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, BookOpen } from "lucide-react";
import { fine } from "@/lib/fine";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [isPending, setIsPending] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const getSession = async () => {
      try {
        const sessionData = await fine.auth.getSession();
        setSession(sessionData);
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setIsPending(false);
      }
    };

    getSession();
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md dark:bg-gray-900" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">StudienkollegPrep</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              Home
            </Link>
            {!isPending && session?.data && (
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/dashboard") ? "text-primary" : "text-gray-600 dark:text-gray-300"
                }`}
              >
                Dashboard
              </Link>
            )}
            <Link
              to="#features"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-primary dark:text-gray-300"
            >
              Features
            </Link>
            <Link
              to="#pricing"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-primary dark:text-gray-300"
            >
              Pricing
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!isPending && !session?.data ? (
              <>
                <Link to="/login">
                  <Button variant="outline">Log In</Button>
                </Link>
                <Link to="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            ) : !isPending ? (
              <Link to="/logout">
                <Button variant="outline">Log Out</Button>
              </Link>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
            <nav className="flex flex-col space-y-4 px-4">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/") ? "text-primary" : "text-gray-600 dark:text-gray-300"
                }`}
                onClick={closeMenu}
              >
                Home
              </Link>
              {!isPending && session?.data && (
                <Link
                  to="/dashboard"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive("/dashboard") ? "text-primary" : "text-gray-600 dark:text-gray-300"
                  }`}
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
              )}
              <Link
                to="#features"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-primary dark:text-gray-300"
                onClick={closeMenu}
              >
                Features
              </Link>
              <Link
                to="#pricing"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-primary dark:text-gray-300"
                onClick={closeMenu}
              >
                Pricing
              </Link>
              
              {!isPending && !session?.data ? (
                <>
                  <Link to="/login" onClick={closeMenu}>
                    <Button variant="outline" className="w-full">Log In</Button>
                  </Link>
                  <Link to="/signup" onClick={closeMenu}>
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </>
              ) : !isPending ? (
                <Link to="/logout" onClick={closeMenu}>
                  <Button variant="outline" className="w-full">Log Out</Button>
                </Link>
              ) : null}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}