import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AnimatedBackground, FloatingButton } from "@/components/ui/animated-background";

const HowItWorks = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const steps = [
    {
      step: "01",
      title: "Institution Subscribes",
      description: "Your educational institution subscribes to Acadira for ₹80,000/year, getting complete access to the platform.",
      icon: "💳",
      details: ["Annual subscription model", "Complete platform access", "Admin dashboard included", "Unlimited student accounts"]
    },
    {
      step: "02", 
      title: "Admin Uploads Curriculum",
      description: "Institution administrators upload curriculum PDFs, notes, question banks, and syllabus materials through the secure dashboard.",
      icon: "📚",
      details: ["PDF curriculum upload", "Notes and materials", "Question bank integration", "Secure file processing"]
    },
    {
      step: "03",
      title: "AI Ingests & Builds Tutor", 
      description: "Acadira's AI processes your curriculum and creates a private, syllabus-specific AI tutor for your students.",
      icon: "🤖",
      details: ["AI curriculum analysis", "Knowledge base creation", "Private tutor instance", "Syllabus alignment"]
    },
    {
      step: "04",
      title: "Students Access AI Tutor",
      description: "Students log in with institution-provided credentials and access their personalized, curriculum-aligned AI tutor.",
      icon: "🎓",
      details: ["Secure student login", "Curriculum-specific answers", "24/7 availability", "Progress tracking"]
    }
  ];

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground particleCount={25} />
      <Header />
      
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-[#030303] to-gray-900 pt-24 pb-16">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-center space-y-6 mb-16"
          >
            <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.1] mb-6">
              <span className="text-sm text-white tracking-wide">How It Works</span>
            </motion.div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
              Simple Steps to Transform
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
                Your Curriculum
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              From subscription to AI tutoring in 4 easy steps. See how Acadira transforms 
              your institution's curriculum into an intelligent tutoring system.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerChildren}
            className="space-y-20 mb-20"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}
              >
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="flex items-center space-x-4">
                    <div className="text-5xl">{step.icon}</div>
                    <div className="flex items-center space-x-3">
                      <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">{step.step}</span>
                      <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                    </div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">{step.title}</h2>
                  <p className="text-lg text-white/70 leading-relaxed">{step.description}</p>
                  <ul className="space-y-3">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                        <span className="text-white/80">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Card className={`border border-white/10 bg-gradient-to-br from-gray-900/50 to-gray-800/50 shadow-2xl ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <CardContent className="p-8">
                    <div className="aspect-video bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl flex items-center justify-center border border-white/5">
                      <span className="text-8xl opacity-60">{step.icon}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="bg-gradient-to-r from-red-900/20 to-red-800/20 border border-red-500/30 rounded-xl p-8 mb-16"
          >
            <div className="flex items-start space-x-4">
              <div className="text-red-400 text-2xl">🛑</div>
              <div>
                <h3 className="font-semibold text-red-300 mb-3 text-lg">Important: Subscription Required</h3>
                <p className="text-red-200/80 leading-relaxed">
                  Students can only access the AI Tutor after their institution has an active subscription. 
                  Unsubscribed visitors will see a "Subscription Required" screen when attempting to access the tutor.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-center space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to Get Started?</h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/demo">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg"
                >
                  Book a Demo
                </motion.button>
              </Link>
              <Link to="/pricing">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/5 transition-colors text-lg"
                >
                  View Pricing
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
      <FloatingButton onClick={scrollToTop} icon="↑" />
    </div>
  );
};

export default HowItWorks;