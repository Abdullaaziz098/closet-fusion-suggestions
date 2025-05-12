
import { Link, useLocation } from "react-router-dom";
import { Shirt, Home, Combine, Image } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

const navItems = [
  { title: "Home", path: "/", icon: <Home className="w-6 h-6" /> },
  { title: "Closet", path: "/closet", icon: <Shirt className="w-6 h-6" /> },
  { title: "Suggestions", path: "/suggestions", icon: <Combine className="w-6 h-6" /> },
  { title: "Preview", path: "/outfit-preview", icon: <Image className="w-6 h-6" /> },
];

const Layout = ({ children, hideNav = false }: LayoutProps) => {
  const location = useLocation();
  
  return (
    <div className="flex flex-col min-h-screen bg-ios-background text-ios-text">
      {!hideNav && (
        <header className="ios-top-bar">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-semibold text-black">Closet Fusion</span>
          </Link>
        </header>
      )}
      
      <main className="flex-1 mt-14 mb-16 px-4 py-6">
        {children}
      </main>
      
      {!hideNav && (
        <div className="ios-nav">
          <nav className="container h-full mx-auto px-4">
            <ul className="flex items-center justify-around h-full">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`ios-tab ${isActive ? 'active' : ''}`}
                    >
                      <span>{item.icon}</span>
                      <span className="text-xs">{item.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Layout;
