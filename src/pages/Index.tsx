
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Upload, Wand2, Users, Layers, ArrowRight, ImagePlus, Sparkles } from "lucide-react";

const Index = () => {
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

  return (
    <Layout>
      <div className="container px-4 py-8 md:py-16">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block mb-4 p-2 rounded-full bg-primary/10"
            >
              <Sparkles className="h-6 w-6 text-primary" />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 tracking-tight leading-tight">
              Build Your Perfect
              <span className="relative ml-3 inline-block">
                <span className="relative z-10">Wardrobe</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-accent/70 -z-10"></span>
              </span>
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
              <Button asChild size="lg" className="rounded-full">
                <Link to="/closet">
                  Get Started
                  <ArrowRight className="ml-1" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
          >
            <motion.div variants={item} className="card-hover">
              <div className="bg-secondary/50 rounded-lg p-6 md:p-8 flex flex-col h-full">
                <div className="mb-4 p-2 inline-block rounded-full bg-accent/60">
                  <ImagePlus className="h-5 w-5 text-accent-foreground" />
                </div>
                <h2 className="text-2xl font-medium mb-2">Upload Your Clothes</h2>
                <p className="text-muted-foreground mb-6 flex-grow">
                  Add tops and bottoms to your digital closet. We'll analyze their colors, styles, and fabrics for perfect matching.
                </p>
                <div className="mt-auto">
                  <Button asChild>
                    <Link to="/closet" className="group">
                      Get Started
                      <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div variants={item} className="card-hover">
              <div className="bg-secondary/50 rounded-lg p-6 md:p-8 flex flex-col h-full">
                <div className="mb-4 p-2 inline-block rounded-full bg-accent/60">
                  <Wand2 className="h-5 w-5 text-accent-foreground" />
                </div>
                <h2 className="text-2xl font-medium mb-2">Smart Suggestions</h2>
                <p className="text-muted-foreground mb-6 flex-grow">
                  Our AI analyzes color, style, and fabric to create the perfect outfit combinations ranked by compatibility.
                </p>
                <div className="mt-auto">
                  <Button asChild variant="outline">
                    <Link to="/suggestions" className="group">
                      View Suggestions
                      <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="bg-accent/30 rounded-lg p-6 md:p-10"
          >
            <h2 className="text-2xl font-medium mb-8 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                className="text-center"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-accent/70 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="font-medium text-lg mb-2">Upload Your Clothes</h3>
                <p className="text-sm text-muted-foreground">
                  Add images of your tops and bottoms to your virtual closet with style information.
                </p>
              </motion.div>

              <motion.div 
                className="text-center"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-accent/70 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                  <Layers className="h-6 w-6 text-accent-foreground" />
                </div>
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
                <div className="bg-accent/70 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="font-medium text-lg mb-2">Get Suggestions</h3>
                <p className="text-sm text-muted-foreground">
                  View personalized outfit combinations with matching scores and weekly planning.
                </p>
              </motion.div>
            </div>
            
            <div className="mt-10 text-center">
              <Button asChild size="lg">
                <Link to="/closet">
                  Start Building Your Wardrobe
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
