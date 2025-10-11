import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { AnimatedBackground, FloatingButton } from "@/components/ui/animated-background";
import { Target, Shield, Zap, Users, GraduationCap, Rocket, Heart, Award, Building2, Globe, Lock, Lightbulb } from 'lucide-react';

const About = () => {
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
        staggerChildren: 0.2,
        delayChildren: 0.3
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

  const values = [
    {
      icon: Target,
      title: "Educational Focus",
      description: "We believe AI tutoring should be curriculum-specific, not generic. Every answer should align with what students actually need to learn.",
      color: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-400"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Educational data is sacred. We ensure complete data privacy with institution-specific silos and enterprise-grade security.",
      color: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-400"
    },
    {
      icon: Zap,
      title: "Accessible Innovation",
      description: "Making advanced AI tutoring accessible to all educational institutions, from small coaching centers to large universities.",
      color: "from-yellow-500/20 to-orange-500/20",
      iconColor: "text-yellow-400"
    },
    {
      icon: Users,
      title: "Partnership Approach",
      description: "We work closely with educators to understand their needs and continuously improve our platform based on real feedback.",
      color: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-400"
    }
  ];

  const team = [
    {
      icon: Building2,
      role: "Product Development",
      description: "Building the future of AI-powered education with focus on curriculum alignment and student outcomes.",
      color: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-400"
    },
    {
      icon: Lightbulb,
      role: "AI Research", 
      description: "Developing advanced NLP models specifically optimized for educational content and syllabus-based responses.",
      color: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-400"
    },
    {
      icon: GraduationCap,
      role: "Educational Technology",
      description: "Understanding institutional needs and creating user-friendly interfaces for both administrators and students.",
      color: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-400"
    },
    {
      icon: Lock,
      role: "Data Security",
      description: "Ensuring enterprise-grade security and compliance for educational institutions of all sizes.",
      color: "from-red-500/20 to-orange-500/20",
      iconColor: "text-red-400"
    }
  ];

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground particleCount={25} />
      <Header />
      
      <section className="relative min-h-screen bg-gradient-to-b from-gray-900 via-[#030303] to-gray-900 py-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-4 md:px-6 pt-16">
          {/* Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.1] mb-6"
            >
              <Heart className="h-4 w-4 text-pink-400" />
              <span className="text-sm text-white/70 tracking-wide">About Acadira</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-purple-200">
                Empowering Education
              </span>
              <br />
              <span className="text-white/90">with AI</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
              Acadira by Xovaxy is revolutionizing how educational institutions 
              provide personalized AI tutoring aligned with their specific curriculum.
            </p>
          </motion.div>

          {/* Vision & Mission */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerChildren}
            className="max-w-5xl mx-auto mb-20"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                variants={cardVariants}
                className="relative p-8 bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-white/10 rounded-2xl backdrop-blur-sm"
              >
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                    <GraduationCap className="h-8 w-8 text-blue-400" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">Our Vision</h2>
                  <p className="text-lg text-blue-200 font-medium">
                    "Empowering education with AI tailored for every institution"
                  </p>
                  <p className="text-white/70 leading-relaxed">
                    We envision a world where every student has access to a personalized AI tutor 
                    that understands their exact curriculum and helps them excel in their studies.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={cardVariants}
                className="relative p-8 bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-white/10 rounded-2xl backdrop-blur-sm"
              >
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto">
                    <Rocket className="h-8 w-8 text-purple-400" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">Our Story</h2>
                  <p className="text-white/70 leading-relaxed">
                    Acadira was created to solve a critical problem in education: students were using 
                    generic AI chatbots that often provided irrelevant or incorrect information not 
                    aligned with their syllabus. We built Acadira to ensure students learn with 
                    accurate, syllabus-specific AI tutors instead of generic chatbots.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Values */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Values</h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                The principles that guide everything we do at Acadira.
              </p>
            </div>
            
            <motion.div
              variants={staggerChildren}
              className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
            >
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  className="relative p-6 bg-white/[0.02] border border-white/[0.1] rounded-xl backdrop-blur-sm hover:bg-white/[0.05] transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${value.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <value.icon className={`h-6 w-6 ${value.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                  <p className="text-white/70 leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Team */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Team</h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                Dedicated experts working to transform educational technology.
              </p>
            </div>
            
            <motion.div
              variants={staggerChildren}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
            >
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  className="relative p-6 bg-white/[0.02] border border-white/[0.1] rounded-xl backdrop-blur-sm hover:bg-white/[0.05] transition-all duration-300 group text-center"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${member.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <member.icon className={`h-8 w-8 ${member.iconColor}`} />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{member.role}</h3>
                  <p className="text-sm text-white/70 leading-relaxed">{member.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Xovaxy */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="max-w-4xl mx-auto text-center mb-20"
          >
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Powered by Xovaxy
                </h2>
                <p className="text-white/60 max-w-2xl mx-auto">
                  Acadira is proudly developed under Xovaxy, ensuring enterprise-grade 
                  reliability, security, and innovation in educational technology.
                </p>
              </div>
              
              <div className="relative p-8 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border border-yellow-500/20 rounded-2xl backdrop-blur-sm">
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto">
                    <Zap className="h-8 w-8 text-yellow-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">Xovaxy Technologies</h3>
                    <p className="text-white/70">
                      A technology company focused on building AI-powered solutions 
                      that solve real-world problems in education, productivity, and innovation.
                    </p>
                  </div>
                  <div className="flex items-center justify-center space-x-6 text-sm text-white/60">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>AI Innovation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span>Enterprise Solutions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      <span>Educational Focus</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-white/10">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Ready to Transform Your Institution?
                </h2>
                <p className="text-white/70 max-w-2xl mx-auto">
                  Join the educational institutions already using Acadira to provide 
                  their students with curriculum-aligned AI tutoring.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Book a Demo
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/5 transition-colors"
                  >
                    Contact Us
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030303] to-transparent pointer-events-none" />
      </section>
      
      <Footer />
      <FloatingButton onClick={scrollToTop} icon="↑" />
    </div>
  );
};

export default About;