import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { AnimatedBackground, FloatingButton } from "@/components/ui/animated-background";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, GraduationCap, Building2, User, Lock, Mail, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [institutionEmail, setInstitutionEmail] = useState("");
  const [institutionPassword, setInstitutionPassword] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("institution");
  const [showInstitutionPassword, setShowInstitutionPassword] = useState(false);
  const [showStudentPassword, setShowStudentPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleInstitutionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: institutionEmail,
        password: institutionPassword,
      });

      if (error) throw error;

      // Check user role
      const { data: user } = await supabase.auth.getUser();
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", user.user?.id)
        .single();

      console.log("Login - User ID:", user.user?.id);
      console.log("Login - Profile data:", profile);
      console.log("Login - Profile error:", profileError);

      if (profileError || !profile) {
        await supabase.auth.signOut();
        throw new Error(`Unable to fetch profile: ${profileError?.message || 'Profile not found'}. Please ensure your account has been properly set up.`);
      }

      if (profile.role === "student") {
        await supabase.auth.signOut();
        throw new Error("Please use the student login tab");
      }

      toast({
        title: "Welcome back!",
        description: "Successfully logged in",
      });

      // Navigate based on role
      if (profile.role === "super_admin") {
        navigate("/superadmin");
      } else {
        navigate("/admin");
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: studentEmail,
        password: studentPassword,
      });

      if (error) throw error;

      // Check if user is a student
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (profile?.role !== "student") {
        await supabase.auth.signOut();
        throw new Error("This account is not registered as a student. Please use the institution login tab.");
      }

      toast({
        title: "Welcome back!",
        description: "Successfully logged in",
      });

      navigate("/student");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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

        <div className="relative z-10 container mx-auto px-4 md:px-6 pt-16 flex items-center justify-center min-h-screen">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="w-full max-w-md"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                <GraduationCap className="h-10 w-10 text-blue-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Welcome to Acadira
              </h1>
              <p className="text-white/60">
                Sign in to access your AI tutoring platform
              </p>
            </div>

            {/* Login Card */}
            <div className="relative p-8 bg-white/[0.02] border border-white/[0.1] rounded-2xl backdrop-blur-sm">
              {/* Tab Buttons */}
              <div className="flex mb-8 bg-white/[0.05] rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("institution")}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all duration-300 ${
                    activeTab === "institution"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-white/70 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  <Building2 className="h-4 w-4" />
                  <span className="font-medium">Institution</span>
                </button>
                <button
                  onClick={() => setActiveTab("student")}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all duration-300 ${
                    activeTab === "student"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-white/70 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span className="font-medium">Student</span>
                </button>
              </div>

              {/* Institution Login Form */}
              {activeTab === "institution" && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleInstitutionSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="institution-email" className="text-sm font-medium text-white">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                        <input
                          id="institution-email"
                          type="email"
                          placeholder="admin@institution.edu"
                          value={institutionEmail}
                          onChange={(e) => setInstitutionEmail(e.target.value)}
                          disabled={loading}
                          required
                          className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="institution-password" className="text-sm font-medium text-white">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                        <input
                          id="institution-password"
                          type={showInstitutionPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={institutionPassword}
                          onChange={(e) => setInstitutionPassword(e.target.value)}
                          disabled={loading}
                          required
                          className="w-full pl-10 pr-12 py-3 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setShowInstitutionPassword(!showInstitutionPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70"
                        >
                          {showInstitutionPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                      className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <Building2 className="h-5 w-5" />
                          <span>Sign In to Admin Dashboard</span>
                        </>
                      )}
                    </motion.button>
                  </form>

                  <div className="mt-6 space-y-4">
                    <div className="text-center">
                      <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                        Forgot your password?
                      </Link>
                    </div>
                    <div className="text-center">
                      <span className="text-sm text-white/60">Don't have an account? </span>
                      <Link to="/pricing" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                        Subscribe to Acadira
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Student Login Form */}
              {activeTab === "student" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleStudentSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="student-email" className="text-sm font-medium text-white">
                        Student Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                        <input
                          id="student-email"
                          type="email"
                          placeholder="student@institution.edu"
                          value={studentEmail}
                          onChange={(e) => setStudentEmail(e.target.value)}
                          disabled={loading}
                          required
                          className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="student-password" className="text-sm font-medium text-white">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                        <input
                          id="student-password"
                          type={showStudentPassword ? "text" : "password"}
                          placeholder="Institution provided password"
                          value={studentPassword}
                          onChange={(e) => setStudentPassword(e.target.value)}
                          disabled={loading}
                          required
                          className="w-full pl-10 pr-12 py-3 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setShowStudentPassword(!showStudentPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70"
                        >
                          {showStudentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                      className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <User className="h-5 w-5" />
                          <span>Access AI Tutor</span>
                        </>
                      )}
                    </motion.button>
                  </form>

                  <div className="mt-6 space-y-4">
                    <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-lg p-4 border border-blue-500/20">
                      <p className="text-sm text-blue-200">
                        <strong>Note:</strong> Student credentials are provided by your institution. 
                        Contact your administrator if you need access.
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <Link to="/contact" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                        Need help with student login?
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-xs text-white/50">
                  Secured by Xovaxy • Enterprise-grade security
                </p>
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

export default Login;