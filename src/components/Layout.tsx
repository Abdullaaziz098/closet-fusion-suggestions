
import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Shirt, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Close mobile menu when route changes or on desktop
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: "/", label: "Home", icon: <Home className="h-4 w-4" /> },
    { to: "/closet", label: "My Closet", icon: <Shirt className="h-4 w-4" /> },
    { to: "/suggestions", label: "Suggestions", icon: <Wand2 className="h-4 w-4" /> }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4">
          <Link to="/" className="flex items-center gap-2 mr-6">
            <motion.span 
              className="font-semibold text-xl tracking-tight hidden sm:inline-block"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              Closet Fusion
            </motion.span>
            <motion.span 
              className="font-semibold text-lg tracking-tight sm:hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              CF
            </motion.span>
          </Link>
          
          {!isMobile ? (
            <nav className="flex-1">
              <ul className="flex space-x-1">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.to;
                  return (
                    <li key={link.to}>
                      <Link 
                        to={link.to} 
                        className={`px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors relative ${
                          isActive 
                            ? "text-primary font-medium" 
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        }`}
                      >
                        {link.icon}
                        {link.label}
                        {isActive && (
                          <motion.div
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                            layoutId="navbar-indicator"
                            transition={{ type: "spring", duration: 0.5 }}
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ) : (
            <div className="flex-1 flex justify-end">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          )}
        </div>
      </header>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMobile && isMobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-30 bg-background pt-16"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="container px-4 py-6">
              <ul className="space-y-4">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.to;
                  return (
                    <motion.li 
                      key={link.to}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                    >
                      <Link 
                        to={link.to} 
                        className={`flex items-center gap-3 py-3 px-4 rounded-md w-full ${
                          isActive 
                            ? "bg-primary/10 text-primary font-medium" 
                            : "text-foreground hover:bg-accent/60"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.icon}
                        {link.label}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.main 
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
      
      <footer className="border-t py-6 bg-muted/30">
        <div className="container px-4 md:flex md:items-center md:justify-between text-center md:text-left">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Closet Fusion. All rights reserved.
          </div>
          <div className="mt-4 md:mt-0">
            <ul className="flex items-center justify-center md:justify-end space-x-6">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
