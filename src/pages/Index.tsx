
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";

const Index = () => {
  return (
    <Layout>
      <div className="container px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-semibold mb-4 tracking-tight">
              Build Your Perfect Wardrobe
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload your clothing items and get AI-powered outfit suggestions based on color, style, and fabric compatibility.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
          >
            <div className="bg-secondary/50 rounded-lg p-6 md:p-8 flex flex-col">
              <h2 className="text-2xl font-medium mb-2">Upload Your Clothes</h2>
              <p className="text-muted-foreground mb-4">
                Add up to 20 tops and 20 bottoms to your digital closet.
              </p>
              <div className="mt-auto">
                <Button asChild>
                  <Link to="/closet">Get Started</Link>
                </Button>
              </div>
            </div>

            <div className="bg-secondary/50 rounded-lg p-6 md:p-8 flex flex-col">
              <h2 className="text-2xl font-medium mb-2">Smart Suggestions</h2>
              <p className="text-muted-foreground mb-4">
                Our AI analyzes color, style, and fabric to create the perfect outfit combinations.
              </p>
              <div className="mt-auto">
                <Button asChild variant="outline">
                  <Link to="/suggestions">View Suggestions</Link>
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-accent/30 rounded-lg p-6 md:p-8"
          >
            <h2 className="text-2xl font-medium mb-4 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-accent w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-semibold">1</span>
                </div>
                <h3 className="font-medium mb-2">Upload Your Clothes</h3>
                <p className="text-sm text-muted-foreground">
                  Add images of your tops and bottoms to your virtual closet.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-accent w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-semibold">2</span>
                </div>
                <h3 className="font-medium mb-2">AI Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Our system analyzes colors, styles, and fabrics of your clothing.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-accent w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-semibold">3</span>
                </div>
                <h3 className="font-medium mb-2">Get Suggestions</h3>
                <p className="text-sm text-muted-foreground">
                  View personalized outfit combinations ranked by compatibility.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
