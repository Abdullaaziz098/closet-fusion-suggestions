
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { 
  Upload, 
  Wand2, 
  Users, 
  Layers, 
  ArrowRight, 
  ImagePlus, 
  Sparkles, 
  Shirt, 
  TrendingUp,
  CheckCircle2,
  Star,
  Award
} from "lucide-react";
import { useState, useEffect } from "react";

const Index = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({
    features: false,
    testimonials: false,
    stats: false
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Check visibility based on scroll position
      setIsVisible({
        features: window.scrollY > 300,
        testimonials: window.scrollY > 800,
        stats: window.scrollY > 1200
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation variants for staggered children
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Floating animation for decorative elements
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "reverse" as const, // Fixed: Using type assertion
      ease: "easeInOut"
    }
  };

  const statCounters = [
    { value: 10000, label: "Outfits Created", icon: <Shirt className="w-6 h-6 text-primary" /> },
    { value: 95, label: "User Satisfaction", icon: <CheckCircle2 className="w-6 h-6 text-primary" /> },
    { value: 5000, label: "Active Users", icon: <Users className="w-6 h-6 text-primary" /> },
    { value: 25000, label: "Clothing Items", icon: <TrendingUp className="w-6 h-6 text-primary" /> }
  ];

  // Counter animation
  const [counters, setCounters] = useState(statCounters.map(() => 0));
  
  useEffect(() => {
    if (isVisible.stats) {
      const intervals = statCounters.map((stat, index) => {
        return setInterval(() => {
          setCounters(prev => {
            const newCounters = [...prev];
            if (newCounters[index] < stat.value) {
              newCounters[index] = Math.min(
                newCounters[index] + Math.ceil(stat.value / 50), 
                stat.value
              );
            }
            return newCounters;
          });
        }, 30);
      });
      
      return () => intervals.forEach(interval => clearInterval(interval));
    }
  }, [isVisible.stats]);

  const testimonialsData = [
    {
      name: "Sarah J.",
      avatar: "S",
      quote: "This app completely transformed my morning routine. No more stressing about what to wear!",
      rating: 5
    },
    {
      name: "Michael T.",
      avatar: "M",
      quote: "The AI suggestions are surprisingly accurate. I've discovered new combinations I never thought of.",
      rating: 5
    },
    {
      name: "Emma R.",
      avatar: "E",
      quote: "As someone who struggles with fashion choices, this app has been a game-changer for my confidence.",
      rating: 4
    }
  ];

  return (
    <Layout>
      <motion.div 
        className="parallax-container" 
        style={{ 
          backgroundPositionY: `-${scrollY * 0.5}px`
        }}
      >
        {/* Hero Section */}
        <div className="container px-4 py-8 md:py-16">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16 relative"
            >
              {/* Decorative Elements */}
              <motion.div
                className="absolute -top-20 -left-10 md:left-10 text-primary/20 hidden md:block"
                animate={floatingAnimation}
              >
                <Shirt size={60} />
              </motion.div>
              
              <motion.div
                className="absolute top-20 -right-5 md:right-10 text-accent/30 hidden md:block"
                animate={{
                  ...floatingAnimation,
                  transition: {
                    ...floatingAnimation.transition,
                    delay: 1.5
                  }
                }}
              >
                <Wand2 size={50} />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-block mb-4 p-2 rounded-full bg-primary/10"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ 
                    duration: 20, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                >
                  <Sparkles className="h-6 w-6 text-primary" />
                </motion.div>
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 tracking-tight leading-tight">
                Build Your Perfect
                <motion.span 
                  className="relative ml-3 inline-block"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <span className="relative z-10">Wardrobe</span>
                  <motion.span 
                    className="absolute bottom-1 left-0 right-0 h-3 bg-accent/70 -z-10"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  ></motion.span>
                </motion.span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Upload your clothing items and get AI-powered outfit suggestions based on color, style, and fabric compatibility.
              </p>
              
              <motion.div 
                className="mt-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Button asChild size="lg" className="rounded-full animate-pulse-subtle">
                  <Link to="/closet">
                    Get Started
                    <ArrowRight className="ml-1 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>
              
              {/* Scroll down indicator */}
              <motion.div 
                className="hidden md:flex items-center justify-center mt-16" 
                animate={{ y: [0, 10, 0] }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop" as const
                }}
              >
                <div className="border-2 border-primary/20 rounded-full w-8 h-14 flex items-center justify-center">
                  <motion.div 
                    className="bg-primary w-1.5 h-3 rounded-full"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "loop" as const
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Feature Cards Section */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
            >
              <motion.div variants={item} className="card-hover">
                <div className="bg-secondary/50 rounded-lg p-6 md:p-8 flex flex-col h-full relative overflow-hidden">
                  <motion.div 
                    className="absolute -right-12 -top-12 w-32 h-32 bg-accent/20 rounded-full blur-xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" as const }}
                  />
                  <div className="mb-4 p-2 inline-block rounded-full bg-accent/60">
                    <motion.div
                      whileHover={{ rotate: 15 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      <ImagePlus className="h-5 w-5 text-accent-foreground" />
                    </motion.div>
                  </div>
                  <h2 className="text-2xl font-medium mb-2">Upload Your Clothes</h2>
                  <p className="text-muted-foreground mb-6 flex-grow">
                    Add tops and bottoms to your digital closet. We'll analyze their colors, styles, and fabrics for perfect matching.
                  </p>
                  <div className="mt-auto">
                    <Button asChild>
                      <Link to="/closet" className="group">
                        Get Started
                        <motion.div
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </motion.div>
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={item} className="card-hover">
                <div className="bg-secondary/50 rounded-lg p-6 md:p-8 flex flex-col h-full relative overflow-hidden">
                  <motion.div 
                    className="absolute -left-12 -bottom-12 w-32 h-32 bg-primary/10 rounded-full blur-xl"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" as const }}
                  />
                  <div className="mb-4 p-2 inline-block rounded-full bg-accent/60">
                    <motion.div
                      whileHover={{ rotate: -15 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      <Wand2 className="h-5 w-5 text-accent-foreground" />
                    </motion.div>
                  </div>
                  <h2 className="text-2xl font-medium mb-2">Smart Suggestions</h2>
                  <p className="text-muted-foreground mb-6 flex-grow">
                    Our AI analyzes color, style, and fabric to create the perfect outfit combinations ranked by compatibility.
                  </p>
                  <div className="mt-auto">
                    <Button asChild variant="outline">
                      <Link to="/suggestions" className="group">
                        View Suggestions
                        <motion.div
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </motion.div>
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* How It Works Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-accent/30 rounded-lg p-6 md:p-10 mb-16 relative overflow-hidden glass-card"
            >
              {/* Decorative background shapes */}
              <motion.div 
                className="absolute -right-20 -top-20 w-40 h-40 bg-accent/30 rounded-full blur-xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" as const }}
              />
              
              <motion.div 
                className="absolute -left-20 -bottom-20 w-40 h-40 bg-primary/10 rounded-full blur-xl"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 7, repeat: Infinity, repeatType: "reverse" as const, delay: 1 }}
              />
              
              <h2 className="text-2xl font-medium mb-8 text-center">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div 
                  className="text-center"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.1
                    }}
                    viewport={{ once: true }}
                    className="bg-accent/70 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Upload className="h-6 w-6 text-accent-foreground" />
                  </motion.div>
                  <h3 className="font-medium text-lg mb-2">Upload Your Clothes</h3>
                  <p className="text-sm text-muted-foreground">
                    Add images of your tops and bottoms to your virtual closet with style information.
                  </p>
                </motion.div>

                <motion.div 
                  className="text-center relative"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Connection line */}
                  <div className="hidden md:block absolute top-7 -left-4 w-8 h-0.5 bg-accent/40 -z-10"></div>
                  <div className="hidden md:block absolute top-7 -right-4 w-8 h-0.5 bg-accent/40 -z-10"></div>
                  
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.3
                    }}
                    viewport={{ once: true }}
                    className="bg-accent/70 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 relative"
                  >
                    <Layers className="h-6 w-6 text-accent-foreground" />
                  </motion.div>
                  <h3 className="font-medium text-lg mb-2">AI Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Our system analyzes colors, styles, and fabrics to determine the best combinations.
                  </p>
                </motion.div>

                <motion.div 
                  className="text-center"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.5
                    }}
                    viewport={{ once: true }}
                    className="bg-accent/70 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Sparkles className="h-6 w-6 text-accent-foreground" />
                  </motion.div>
                  <h3 className="font-medium text-lg mb-2">Get Suggestions</h3>
                  <p className="text-sm text-muted-foreground">
                    View personalized outfit combinations with matching scores and weekly planning.
                  </p>
                </motion.div>
              </div>
              
              <div className="mt-10 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Button asChild size="lg" className="hover-lift">
                    <Link to="/closet">
                      Start Building Your Wardrobe
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Testimonials Section */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mb-16"
            >
              <div className="text-center mb-10">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }}
                  viewport={{ once: true }}
                  className="inline-block mb-2 p-2 rounded-full bg-primary/10"
                >
                  <Users className="h-6 w-6 text-primary" />
                </motion.div>
                <h2 className="text-3xl font-medium mb-4">Loved by Fashion Enthusiasts</h2>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  See what our users are saying about their experience with our AI wardrobe assistant.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonialsData.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="bg-background border border-border rounded-lg p-6 relative card-3d"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-medium mr-3">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h3 className="font-medium">{testimonial.name}</h3>
                        <div className="flex text-amber-400">
                          {Array(5).fill(0).map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              className={i < testimonial.rating ? "fill-amber-400" : "text-gray-300"}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                    <div className="absolute -top-2 -left-2 text-primary/10 transform rotate-180">
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.48.11-.894.192-1.23.243-.326.06-.61.09-.87.09-.257 0-.37-.13-.37-.375v-.712c0-.245.083-.41.248-.493 1.164-.59 2.03-1.395 2.602-2.435.57-1.05.855-2.16.855-3.333 0-1.096-.26-2.088-.77-2.773-.51-.685-1.195-1.028-2.05-1.028-.83 0-1.534.34-2.113 1.016-.58.685-.87 1.496-.87 2.435 0 .274.065.532.193.773.127.24.294.45.502.63.206.18.35.36.435.53.085.17.127.34.127.51 0 .199-.057.377-.172.535-.115.158-.207.29-.277.395-.347.515-.523 1.125-.523 1.825 0 .815.175 1.454.523 1.92.35.467.877.7 1.582.7.246 0 .478-.033.694-.1.215-.068.395-.164.54-.29.145-.123.272-.3.383-.524.112-.226.173-.532.173-.916zm10.15 0c0-.88-.23-1.618-.69-2.217-.326-.41-.77-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.48.11-.894.192-1.23.243-.327.06-.61.09-.87.09-.258 0-.37-.13-.37-.375v-.712c0-.245.083-.41.248-.493 1.165-.59 2.03-1.395 2.602-2.435.573-1.05.86-2.16.86-3.333 0-1.096-.26-2.088-.77-2.773-.51-.685-1.195-1.028-2.05-1.028-.83 0-1.534.34-2.112 1.016-.58.685-.87 1.496-.87 2.435 0 .274.064.532.193.773.125.24.294.45.5.63.207.18.35.36.435.53.086.17.13.34.13.51 0 .199-.06.377-.173.535-.115.158-.207.29-.277.395-.347.515-.523 1.125-.523 1.825 0 .815.175 1.454.523 1.92.35.467.877.7 1.582.7.245 0 .478-.33.694-.1.215-.067.394-.163.54-.29.144-.123.27-.3.38-.523.11-.227.17-.532.17-.916z" />
                      </svg>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mb-16 py-10"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-10">
                {statCounters.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center p-6 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-all"
                  >
                    <div className="flex justify-center mb-4">
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold mb-1">
                      {stat.label.includes("User") ? `${counters[index]}%` : counters[index].toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Final CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-center bg-gradient-to-tr from-accent/30 to-primary/10 rounded-2xl p-10 md:p-16 relative overflow-hidden"
            >
              {/* Decorative elements */}
              <motion.div 
                className="absolute top-5 right-5 opacity-20"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Award size={60} />
              </motion.div>
              
              <motion.div 
                className="absolute bottom-5 left-5 opacity-20"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              >
                <Shirt size={70} />
              </motion.div>
              
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
                viewport={{ once: true }}
                className="inline-block mb-2 p-3 rounded-full bg-accent/40"
              >
                <Sparkles className="h-6 w-6 text-accent-foreground" />
              </motion.div>
              
              <h2 className="text-3xl md:text-4xl font-semibold mb-4">
                Transform Your Fashion Today
              </h2>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Join thousands of fashion-forward users who've revolutionized their wardrobe experience.
              </p>
              
              <motion.div
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary/80">
                  <Link to="/closet">
                    Get Started Now
                    <ArrowRight className="ml-1" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Index;
