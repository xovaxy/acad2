import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, Loader2, Building2, User, Lock, Mail, Eye, EyeOff } from "lucide-react";

const AdminLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Check if user is an admin or super_admin
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
          .single();

        if (profileError) {
          await supabase.auth.signOut();
          throw new Error("Unable to fetch profile. Please try again.");
        }

        if (!profile || !["admin", "super_admin"].includes(profile.role)) {
          await supabase.auth.signOut();
          throw new Error("This account is not registered as an admin");
        }

        toast({
          title: "Welcome back!",
          description: "Successfully logged in",
        });

        // Redirect based on role
        if (profile.role === "super_admin") {
          navigate("/superadmin");
        } else {
          navigate("/admin");
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`,
          },
        });

        if (error) throw error;

        if (data.user) {
          // Create institution
          const { data: institution, error: institutionError } = await supabase
            .from("institutions")
            .insert({
              name: institutionName,
              email: email,
            })
            .select()
            .single();

          if (institutionError) throw institutionError;

          // Create admin profile
          const { error: profileError } = await supabase.from("profiles").insert({
            user_id: data.user.id,
            email: email,
            full_name: fullName,
            role: "admin",
            institution_id: institution.id,
          });

          if (profileError) throw profileError;

          toast({
            title: "Institution registered!",
            description: "You can now manage your curriculum and students",
          });

          navigate("/admin");
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground particleCount={25} />
      
      <section className="relative min-h-screen bg-gradient-to-b from-gray-900 via-[#030303] to-gray-900 py-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-4 md:px-6 flex items-center justify-center min-h-screen">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="w-full max-w-md"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-block">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 hover:scale-105 transition-transform duration-300">
                  <GraduationCap className="h-10 w-10 text-blue-400" />
                </div>
              </Link>
              <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-purple-300 transition-all duration-300">
                Acadira
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-white mt-4 mb-2">
                {isLogin ? "Admin Login" : "Register Institution"}
              </h1>
              <p className="text-white/60">
                {isLogin ? "Access your admin dashboard" : "Create your institution account"}
              </p>
            </div>

            {/* Login/Register Card */}
            <div className="relative p-8 bg-white/[0.02] border border-white/[0.1] rounded-2xl backdrop-blur-sm">
              <form onSubmit={handleAuth} className="space-y-6">
                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <label htmlFor="institutionName" className="text-sm font-medium text-white">
                        Institution Name
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                        <input
                          id="institutionName"
                          type="text"
                          value={institutionName}
                          onChange={(e) => setInstitutionName(e.target.value)}
                          required
                          placeholder="University Name"
                          className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="fullName" className="text-sm font-medium text-white">
                        Your Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                        <input
                          id="fullName"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          placeholder="John Doe"
                          className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-white">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="admin@university.edu"
                      className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-white">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-3 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                      <span>Please wait...</span>
                    </>
                  ) : (
                    <>
                      {isLogin ? <Building2 className="h-5 w-5" /> : <User className="h-5 w-5" />}
                      <span>{isLogin ? "Login" : "Register Institution"}</span>
                    </>
                  )}
                </motion.button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {isLogin
                    ? "New institution? Register here"
                    : "Already registered? Login"}
                </button>
              </div>

              <div className="mt-4 text-center">
                <Link to="/" className="text-sm text-white/60 hover:text-white/80 transition-colors">
                  ← Back to home
                </Link>
              </div>

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
    </div>
  );
};

export default AdminLogin;
