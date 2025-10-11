'use client';

import { motion } from 'framer-motion';
import { Brain, Users, Target, Zap, BookOpen, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

const AboutAcadira = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const }
    }
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Advanced artificial intelligence adapts to each student's learning style and pace, providing personalized educational experiences."
    },
    {
      icon: Users,
      title: "Collaborative Environment",
      description: "Connect with peers, instructors, and mentors in a dynamic learning community that fosters growth and knowledge sharing."
    },
    {
      icon: Target,
      title: "Goal-Oriented Approach",
      description: "Set and track academic goals with precision, receiving tailored recommendations to achieve your educational objectives."
    },
    {
      icon: Zap,
      title: "Instant Feedback",
      description: "Get real-time insights on your progress with intelligent analytics that help you improve continuously."
    },
    {
      icon: BookOpen,
      title: "Comprehensive Curriculum",
      description: "Access a vast library of courses and resources designed by education experts and industry professionals."
    },
    {
      icon: Award,
      title: "Achievement Recognition",
      description: "Earn certificates, badges, and credentials that validate your skills and knowledge in the professional world."
    }
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-gray-900 via-[#030303] to-gray-900 py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="max-w-6xl mx-auto"
        >
          {/* Header Section */}
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.1] mb-6"
            >
              <Brain className="h-4 w-4 text-indigo-400" />
              <span className="text-sm text-white/70 tracking-wide">About Acadira</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-rose-200">
                Revolutionizing
              </span>
              <br />
              <span className="text-white/90">Education</span>
            </h2>
            
            <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
              Acadira is more than just a learning platform—it's your intelligent companion on the journey to academic excellence. 
              We combine cutting-edge AI technology with proven educational methodologies to create personalized learning experiences 
              that adapt to your unique needs and goals.
            </p>
          </motion.div>

          {/* Mission Statement */}
          <motion.div 
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-transparent to-rose-500/20 blur-xl" />
              <div className="relative bg-white/[0.02] border border-white/[0.1] rounded-2xl p-8 md:p-12 backdrop-blur-sm">
                <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4">Our Mission</h3>
                <p className="text-lg text-white/70 leading-relaxed">
                  "To democratize quality education by making personalized, AI-driven learning accessible to every student, 
                  empowering them to unlock their full potential and achieve their academic dreams."
                </p>
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group relative"
              >
                <div className="relative h-full bg-white/[0.02] border border-white/[0.1] rounded-xl p-6 backdrop-blur-sm hover:bg-white/[0.05] transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-rose-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-rose-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-6 w-6 text-indigo-300" />
                    </div>
                    
                    <h4 className="text-xl font-semibold text-white mb-3 group-hover:text-indigo-200 transition-colors duration-300">
                      {feature.title}
                    </h4>
                    
                    <p className="text-white/60 leading-relaxed group-hover:text-white/70 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            variants={fadeInUp}
            className="mt-20 text-center"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "10K+", label: "Active Students" },
                { number: "500+", label: "Courses Available" },
                { number: "95%", label: "Success Rate" },
                { number: "24/7", label: "AI Support" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="relative group"
                >
                  <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-rose-300 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-white/60 text-sm md:text-base group-hover:text-white/80 transition-colors duration-300">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030303] to-transparent pointer-events-none" />
    </section>
  );
};

export default AboutAcadira;
