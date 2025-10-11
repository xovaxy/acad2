'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Building2, Users, Award } from 'lucide-react';

// Custom brand scroller for educational institutions
const EducationBrandScroller = () => {
  const educationBrands = [
    { name: "Harvard University", icon: "🎓" },
    { name: "MIT", icon: "🔬" },
    { name: "Stanford", icon: "🏛️" },
    { name: "Oxford", icon: "📚" },
    { name: "Cambridge", icon: "🎯" },
    { name: "Yale", icon: "⭐" },
    { name: "Princeton", icon: "🏆" },
    { name: "Columbia", icon: "🌟" }
  ];

  return (
    <div className="group flex overflow-hidden py-4 [--gap:3rem] [gap:var(--gap)] flex-row max-w-full [--duration:30s] [mask-image:linear-gradient(to_right,_rgba(0,_0,_0,_0),rgba(0,_0,_0,_1)_10%,rgba(0,_0,_0,_1)_90%,rgba(0,_0,_0,_0))]">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <div
            className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row"
            key={i}
          >
            {educationBrands.map((brand, index) => (
              <div key={index} className="flex items-center min-w-[200px] gap-3 px-4">
                <span className="text-2xl">{brand.icon}</span>
                <p className="text-lg font-semibold text-white/70 whitespace-nowrap">{brand.name}</p>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};

const EducationBrandScrollerReverse = () => {
  const techBrands = [
    { name: "Google Education", icon: "🔍" },
    { name: "Microsoft EDU", icon: "💻" },
    { name: "Apple Education", icon: "🍎" },
    { name: "Khan Academy", icon: "📖" },
    { name: "Coursera", icon: "🎓" },
    { name: "edX", icon: "📚" },
    { name: "Udacity", icon: "🚀" },
    { name: "Blackboard", icon: "📋" }
  ];

  return (
    <div className="group flex overflow-hidden py-4 [--gap:3rem] [gap:var(--gap)] flex-row max-w-full [--duration:35s] [mask-image:linear-gradient(to_right,_rgba(0,_0,_0,_0),rgba(0,_0,_0,_1)_10%,rgba(0,_0,_0,_1)_90%,rgba(0,_0,_0,_0))]">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <div
            className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee-reverse flex-row"
            key={i}
          >
            {techBrands.map((brand, index) => (
              <div key={index} className="flex items-center min-w-[200px] gap-3 px-4">
                <span className="text-2xl">{brand.icon}</span>
                <p className="text-lg font-semibold text-white/70 whitespace-nowrap">{brand.name}</p>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};

export const AcadiraTrustedBy = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const }
    }
  };

  const stats = [
    { icon: Building2, number: "500+", label: "Partner Institutions" },
    { icon: Users, number: "50K+", label: "Active Students" },
    { icon: GraduationCap, number: "1M+", label: "Courses Completed" },
    { icon: Award, number: "98%", label: "Success Rate" }
  ];

  return (
    <section className="relative py-20 bg-gradient-to-b from-gray-900 via-[#030303] to-gray-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/2 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.1] mb-6"
          >
            <Award className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-white/70 tracking-wide">Trusted Worldwide</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-purple-200">
              Trusted by Leading
            </span>
            <br />
            <span className="text-white/90">Educational Institutions</span>
          </h2>
          
          <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
            Join thousands of institutions and millions of students who trust Acadira 
            for their educational journey and academic success.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, staggerChildren: 0.1 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="h-8 w-8 text-blue-400" />
              </div>
              <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300 mb-2">
                {stat.number}
              </div>
              <div className="text-white/60 text-sm md:text-base">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Brand Scrollers */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1 }}
        >
          <div className="text-center mb-8">
            <h3 className="text-xl md:text-2xl font-semibold text-white/80 mb-2">
              Partner Universities & Institutions
            </h3>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
          
          <EducationBrandScroller />
          
          <div className="text-center my-8">
            <h3 className="text-xl md:text-2xl font-semibold text-white/80 mb-2">
              Technology & Platform Partners
            </h3>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
          </div>
          
          <EducationBrandScrollerReverse />
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-white/60 text-lg mb-6">
            Ready to join the world's leading educational platform?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105">
              Get Started Today
            </button>
            <button className="px-8 py-3 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300">
              Learn More
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030303] to-transparent pointer-events-none" />
    </section>
  );
};
