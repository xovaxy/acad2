import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { AnimatedBackground, FloatingButton } from "@/components/ui/animated-background";
import { Mail, Phone, MessageSquare, Calendar, Clock, MapPin, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
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

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      detail: "contact@xovaxy.in",
      description: "Send us an email and we'll respond within 24 hours",
      color: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-400"
    },
    {
      icon: MessageSquare,
      title: "Instagram",
      detail: "@xovaxy.ai",
      description: "Follow us for updates and educational content",
      color: "from-pink-500/20 to-purple-500/20",
      iconColor: "text-pink-400"
    },
    {
      icon: Calendar,
      title: "Demo Call",
      detail: "Book a Demo",
      description: "Schedule a personalized demo of Acadira platform",
      color: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-400"
    },
    {
      icon: Phone,
      title: "Sales Inquiry",
      detail: "Enterprise Sales",
      description: "Contact our sales team for institutional pricing",
      color: "from-orange-500/20 to-red-500/20",
      iconColor: "text-orange-400"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert("Thank you for your message! We'll get back to you within 24 hours.");
  };

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
              <MessageSquare className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-white/70 tracking-wide">Contact Us</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-purple-200">
                Get in Touch
              </span>
              <br />
              <span className="text-white/90">with Acadira</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
              Ready to bring AI-powered tutoring to your institution? 
              Contact us for demos, pricing, or any questions about Acadira.
            </p>
          </motion.div>

          {/* Contact Methods */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerChildren}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 max-w-6xl mx-auto"
          >
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className="relative p-6 bg-white/[0.02] border border-white/[0.1] rounded-xl backdrop-blur-sm hover:bg-white/[0.05] transition-all duration-300 group text-center"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${method.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <method.icon className={`h-8 w-8 ${method.iconColor}`} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-white">{method.title}</h3>
                  <p className={`${method.iconColor} font-medium`}>{method.detail}</p>
                  <p className="text-sm text-white/70">{method.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="max-w-6xl mx-auto mb-20"
          >
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    Book a Demo with Acadira
                  </h2>
                  <p className="text-lg text-white/70 leading-relaxed">
                    Fill out the form and our team will reach out to schedule a 
                    personalized demo of the Acadira platform for your institution.
                  </p>
                </div>
                
                <div className="space-y-4">
                  {[
                    "See how curriculum upload works",
                    "Experience the AI tutor interface", 
                    "Explore admin dashboard features",
                    "Discuss institutional pricing"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-white/80">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="relative p-6 bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-green-500/20 rounded-xl backdrop-blur-sm">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center">
                      <Clock className="h-6 w-6 text-green-400" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-white">Demo Duration</h3>
                      <p className="text-sm text-white/70">
                        Our demos typically last 30-45 minutes and can be customized 
                        to focus on your institution's specific needs.
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-green-300">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>Available Monday-Friday, 9 AM - 6 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative p-8 bg-white/[0.02] border border-white/[0.1] rounded-2xl backdrop-blur-sm">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <Send className="h-6 w-6 text-blue-400" />
                    <h3 className="text-xl font-semibold text-white">Contact Form</h3>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-white">Name *</label>
                        <input 
                          id="name" 
                          placeholder="Your full name"
                          required
                          className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="institution" className="text-sm font-medium text-white">Institution *</label>
                        <input 
                          id="institution" 
                          placeholder="School/College name"
                          required
                          className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-white">Email *</label>
                        <input 
                          id="email" 
                          type="email"
                          placeholder="your@email.com"
                          required
                          className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium text-white">Phone</label>
                        <input 
                          id="phone" 
                          type="tel"
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-white">Message</label>
                      <textarea 
                        id="message"
                        placeholder="Tell us about your institution and how Acadira can help..."
                        rows={4}
                        className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent resize-none"
                      />
                    </div>
                    
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Send className="h-5 w-5" />
                      <span>Send Message & Book Demo</span>
                    </motion.button>
                    
                    <p className="text-xs text-white/50 text-center">
                      By submitting this form, you agree to our privacy policy. 
                      We'll only use your information to schedule demos and provide relevant updates.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
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
                  Prefer Direct Contact?
                </h2>
                <p className="text-white/70 max-w-2xl mx-auto">
                  Reach out to us directly through email or social media for immediate assistance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.a
                    href="mailto:contact@xovaxy.in"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center space-x-2 px-8 py-3 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/5 transition-colors"
                  >
                    <Mail className="h-5 w-5" />
                    <span>Email Us</span>
                  </motion.a>
                  <motion.a
                    href="https://instagram.com/xovaxy.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center space-x-2 px-8 py-3 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/5 transition-colors"
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span>Follow on Instagram</span>
                  </motion.a>
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

export default Contact;