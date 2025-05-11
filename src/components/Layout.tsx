
import { Link, useLocation } from "react-router-dom";
import { Shirt, Home, LayoutGrid, Combine, User3D } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

const navItems = [
  { title: "Home", path: "/", icon: <Home className="w-5 h-5" /> },
  { title: "Closet", path: "/closet", icon: <Shirt className="w-5 h-5" /> },
  { title: "Suggestions", path: "/suggestions", icon: <Combine className="w-5 h-5" /> },
  { title: "3D Preview", path: "/outfit-preview", icon: <User3D className="w-5 h-5" /> },
];

const Layout = ({ children, hideNav = false }: LayoutProps) => {
  const location = useLocation();
  
  return (
    <div className="flex flex-col min-h-screen">
      {!hideNav && (
        <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur">
          <div className="container flex items-center justify-between h-14 px-4">
            <Link to="/" className="flex items-center gap-2">
              <LayoutGrid className="h-5 w-5 text-primary" />
              <span className="font-medium">Closet Fusion</span>
            </Link>
          </div>
        </header>
      )}
      
      <main className="flex-1">{children}</main>
      
      {!hideNav && (
        <div className="w-full h-16 bg-background/95 backdrop-blur-sm fixed bottom-0 border-t z-50">
          <nav className="container h-full mx-auto px-4">
            <ul className="flex items-center justify-around h-full">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex flex-col items-center gap-1 px-3 py-1.5 ${
                      location.pathname === item.path
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="text-xs">{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Layout;
