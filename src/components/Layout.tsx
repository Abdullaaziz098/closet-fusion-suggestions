
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-semibold text-xl tracking-tight">Closet Fusion</span>
          </Link>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/closet" className="hover:text-primary transition-colors">
                  My Closet
                </Link>
              </li>
              <li>
                <Link to="/suggestions" className="hover:text-primary transition-colors">
                  Suggestions
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t py-4">
        <div className="container px-4 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} Closet Fusion. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
