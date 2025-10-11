'use client';

import { motion } from "framer-motion";
import { GraduationCap, Users, Building2, Crown } from "lucide-react";
import { PricingCard } from "@/components/ui/dark-gradient-pricing";

export const AcadiraPricing = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const }
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

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-[#030303] to-gray-900 text-foreground">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 md:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          className="mb-16 space-y-6 text-center"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.1] mb-6"
          >
            <Crown className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-white tracking-wide">Choose Your Plan</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="text-white">
              Simple, Transparent
            </span>
            <br />
            <span className="text-white">Pricing</span>
          </h2>
          
          <p className="text-lg md:text-xl text-white max-w-3xl mx-auto leading-relaxed">
            Choose between our complete solution or enterprise package. 
            Transform your educational institution with our AI-powered learning platform.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerChildren}
          className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto justify-center items-stretch"
        >
          <motion.div variants={cardVariants} className="flex-1 min-w-0 lg:max-w-sm">
            <PricingCard
              tier="Acadira Complete"
              price="₹80,000"
              bestFor="Complete AI-powered education solution"
              CTA="Get Started Today"
              benefits={[
                { text: "Unlimited students", checked: true },
                { text: "Advanced AI features", checked: true },
                { text: "Advanced analytics & insights", checked: true },
                { text: "Parent dashboard", checked: true },
                { text: "Unlimited courses", checked: true },
                { text: "Custom branding", checked: true },
                { text: "24/7 priority support", checked: true },
                { text: "Dedicated account manager", checked: true },
              ]}
              className="border-blue-500/30 bg-gradient-to-br from-blue-900/20 to-purple-900/20 ring-2 ring-blue-500/20 shadow-2xl"
            />
          </motion.div>

          <motion.div variants={cardVariants} className="flex-1 min-w-0 lg:max-w-sm">
            <PricingCard
              tier="Enterprise Custom"
              price="Custom Quote"
              bestFor="Tailored solutions for large organizations"
              CTA="Contact Sales"
              benefits={[
                { text: "Everything in Complete", checked: true },
                { text: "Custom integrations", checked: true },
                { text: "On-premise deployment", checked: true },
                { text: "Custom AI model training", checked: true },
                { text: "Multi-tenant architecture", checked: true },
                { text: "Advanced security features", checked: true },
                { text: "Custom reporting & dashboards", checked: true },
                { text: "Dedicated infrastructure", checked: true },
              ]}
              className="border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-pink-900/20 ring-2 ring-purple-500/20 shadow-2xl"
            />
          </motion.div>

        </motion.div>

        {/* Additional Features Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          className="mt-20 text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-8">
            All plans include these powerful features
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div
              variants={cardVariants}
              className="flex flex-col items-center p-6 rounded-xl bg-white/[0.02] border border-white/[0.1]"
            >
              <GraduationCap className="h-12 w-12 text-blue-400 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">AI-Powered Learning</h4>
              <p className="text-white text-sm text-center">
                Personalized learning paths powered by advanced AI algorithms
              </p>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="flex flex-col items-center p-6 rounded-xl bg-white/[0.02] border border-white/[0.1]"
            >
              <Users className="h-12 w-12 text-green-400 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Collaborative Tools</h4>
              <p className="text-white text-sm text-center">
                Enable seamless collaboration between students, teachers, and parents
              </p>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="flex flex-col items-center p-6 rounded-xl bg-white/[0.02] border border-white/[0.1]"
            >
              <Building2 className="h-12 w-12 text-purple-400 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Institution Management</h4>
              <p className="text-white text-sm text-center">
                Comprehensive tools for managing courses, students, and progress
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Transform Education?
            </h3>
            <p className="text-white mb-6 max-w-2xl mx-auto">
              Join thousands of educators who are already using Acadira to create 
              personalized learning experiences for their students.
            </p>
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Book Demo
              </motion.button>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030303] to-transparent pointer-events-none" />
    </section>
  );
};
