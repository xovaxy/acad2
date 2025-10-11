'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Brain, Users, Target, Zap, BookOpen, Award, BarChart3, Shield, Cloud, Terminal, Cpu, Lightbulb, GraduationCap, Building2, Heart, UserCheck, Calendar, MessageSquare, TrendingUp, FileText, Bell, Settings, Lock, Globe } from 'lucide-react';

interface BentoItemProps {
    className?: string;
    children: React.ReactNode;
}

// Reusable BentoItem component with animations
const BentoItem: React.FC<BentoItemProps> = ({ className = '', children }) => {
    const itemRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const item = itemRef.current;
        if (!item) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            item.style.setProperty('--mouse-x', `${x}px`);
            item.style.setProperty('--mouse-y', `${y}px`);
        };

        item.addEventListener('mousemove', handleMouseMove);

        return () => {
            item.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <motion.div 
            ref={itemRef} 
            className={`bento-item ${className}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
};

// Main AcadiraFeatures Component
export const AcadiraFeatures = () => {
    const fadeInUp = {
        hidden: { opacity: 0, y: 60 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" as const }
        }
    };

    return (
        <section className="relative min-h-screen bg-gradient-to-b from-gray-900 via-[#030303] to-gray-900 py-20 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
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
                        <Lightbulb className="h-4 w-4 text-blue-400" />
                        <span className="text-sm text-white/70 tracking-wide">Platform Features</span>
                    </motion.div>
                    
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-purple-200">
                            Powerful Features
                        </span>
                        <br />
                        <span className="text-white/90">for Modern Learning</span>
                    </h2>
                    
                    <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
                        Discover the comprehensive suite of AI-powered tools and features that make Acadira 
                        the ultimate platform for personalized education and academic excellence.
                    </p>
                </motion.div>

                <div className="w-full max-w-6xl mx-auto z-10">
                    <div className="bento-grid">
                        <BentoItem className="col-span-2 row-span-2 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                                        <BarChart3 className="h-6 w-6 text-blue-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">AI Learning Analytics</h2>
                                </div>
                                <p className="text-gray-400">Track your learning progress with intelligent analytics that adapt to your study patterns and provide personalized insights.</p>
                            </div>
                            <div className="mt-4 h-48 bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 rounded-lg flex items-center justify-center text-gray-500 border border-gray-700">
                                <div className="text-center">
                                    <BarChart3 className="h-12 w-12 mx-auto mb-2 text-blue-400/50" />
                                    <span>Interactive Analytics Dashboard</span>
                                </div>
                            </div>
                        </BentoItem>

                        <BentoItem>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                                    <Brain className="h-5 w-5 text-green-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white">Smart AI Tutor</h2>
                            </div>
                            <p className="text-gray-400 text-sm">24/7 AI-powered tutoring that understands your learning style and provides instant help.</p>
                        </BentoItem>

                        <BentoItem>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                                    <Shield className="h-5 w-5 text-purple-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white">Secure Learning</h2>
                            </div>
                            <p className="text-gray-400 text-sm">Enterprise-grade security protecting your academic data and progress.</p>
                        </BentoItem>

                        <BentoItem className="row-span-2">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center">
                                    <Cloud className="h-5 w-5 text-orange-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white">Cloud Sync</h2>
                            </div>
                            <p className="text-gray-400 text-sm mb-4">Access your courses and progress from any device with seamless cloud synchronization.</p>
                            <div className="mt-auto pt-4">
                                <div className="h-24 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg flex items-center justify-center border border-orange-500/20">
                                    <Cloud className="h-8 w-8 text-orange-400/70" />
                                </div>
                            </div>
                        </BentoItem>

                        <BentoItem className="col-span-2">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                                    <Users className="h-5 w-5 text-cyan-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white">Collaborative Learning</h2>
                            </div>
                            <p className="text-gray-400 text-sm">Connect with peers, join study groups, and participate in interactive learning sessions with students worldwide.</p>
                        </BentoItem>

                        <BentoItem>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg flex items-center justify-center">
                                    <Award className="h-5 w-5 text-yellow-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white">Achievements</h2>
                            </div>
                            <p className="text-gray-400 text-sm">Earn certificates, badges, and credentials recognized by top institutions.</p>
                        </BentoItem>
                    </div>
                </div>

                {/* Feature Categories */}
                <div className="mt-20 space-y-16">
                    {/* Institute Features */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-6xl mx-auto"
                    >
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                                <Building2 className="h-4 w-4 text-blue-400" />
                                <span className="text-sm text-blue-300 tracking-wide">For Institutes</span>
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-300">
                                    Institute Management
                                </span>
                            </h3>
                            <p className="text-white/60 max-w-2xl mx-auto">
                                Comprehensive tools for educational institutions to manage curriculum, track student progress, and enhance teaching effectiveness.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { icon: Users, title: "Student Management", desc: "Comprehensive student enrollment, tracking, and performance analytics" },
                                { icon: BookOpen, title: "Curriculum Builder", desc: "Create and customize course content with AI-powered recommendations" },
                                { icon: BarChart3, title: "Analytics Dashboard", desc: "Real-time insights into institutional performance and student outcomes" },
                                { icon: UserCheck, title: "Faculty Management", desc: "Teacher onboarding, scheduling, and performance evaluation tools" },
                                { icon: Calendar, title: "Academic Calendar", desc: "Integrated scheduling for classes, exams, and institutional events" },
                                { icon: FileText, title: "Report Generation", desc: "Automated academic reports and compliance documentation" }
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className="relative p-6 bg-blue-500/5 border border-blue-500/20 rounded-xl backdrop-blur-sm hover:bg-blue-500/10 transition-all duration-300 group"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <feature.icon className="h-6 w-6 text-blue-400" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                                    <p className="text-white/60 text-sm">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Student Features */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-6xl mx-auto"
                    >
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
                                <GraduationCap className="h-4 w-4 text-green-400" />
                                <span className="text-sm text-green-300 tracking-wide">For Students</span>
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-emerald-300">
                                    Personalized Learning
                                </span>
                            </h3>
                            <p className="text-white/60 max-w-2xl mx-auto">
                                AI-powered learning experiences tailored to individual learning styles, pace, and academic goals.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { icon: Brain, title: "AI Study Assistant", desc: "24/7 intelligent tutoring that adapts to your learning style" },
                                { icon: Target, title: "Goal Setting", desc: "Set academic goals and track progress with personalized milestones" },
                                { icon: Zap, title: "Instant Feedback", desc: "Real-time assessment and improvement suggestions" },
                                { icon: Users, title: "Study Groups", desc: "Connect with peers for collaborative learning and discussions" },
                                { icon: Award, title: "Achievement System", desc: "Earn badges, certificates, and recognition for your progress" },
                                { icon: MessageSquare, title: "Peer Chat", desc: "Communicate with classmates and participate in study forums" }
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className="relative p-6 bg-green-500/5 border border-green-500/20 rounded-xl backdrop-blur-sm hover:bg-green-500/10 transition-all duration-300 group"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <feature.icon className="h-6 w-6 text-green-400" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                                    <p className="text-white/60 text-sm">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Parent Features */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-6xl mx-auto"
                    >
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
                                <Heart className="h-4 w-4 text-purple-400" />
                                <span className="text-sm text-purple-300 tracking-wide">For Parents</span>
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
                                    Parental Engagement
                                </span>
                            </h3>
                            <p className="text-white/60 max-w-2xl mx-auto">
                                Stay connected with your child's educational journey through comprehensive monitoring and communication tools.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { icon: TrendingUp, title: "Progress Tracking", desc: "Monitor your child's academic progress and learning milestones" },
                                { icon: Bell, title: "Smart Notifications", desc: "Receive updates on assignments, grades, and important events" },
                                { icon: MessageSquare, title: "Teacher Communication", desc: "Direct messaging with teachers and school administrators" },
                                { icon: Calendar, title: "Schedule Overview", desc: "View your child's class schedule, assignments, and exam dates" },
                                { icon: Shield, title: "Safety Monitoring", desc: "Ensure safe online learning with content filtering and time limits" },
                                { icon: Settings, title: "Learning Controls", desc: "Customize learning preferences and set study time restrictions" }
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className="relative p-6 bg-purple-500/5 border border-purple-500/20 rounded-xl backdrop-blur-sm hover:bg-purple-500/10 transition-all duration-300 group"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <feature.icon className="h-6 w-6 text-purple-400" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                                    <p className="text-white/60 text-sm">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Additional Core Features */}
                <motion.div 
                    className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, staggerChildren: 0.1 }}
                >
                    {[
                        { icon: Cloud, title: "Cloud Sync", desc: "Access from anywhere, anytime" },
                        { icon: Lock, title: "Data Security", desc: "Enterprise-grade protection" },
                        { icon: Globe, title: "Multi-language", desc: "Support for global learners" },
                        { icon: Terminal, title: "API Access", desc: "Integrate with your tools" }
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            className="relative p-6 bg-white/[0.02] border border-white/[0.1] rounded-xl backdrop-blur-sm hover:bg-white/[0.05] transition-all duration-300 group"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <feature.icon className="h-6 w-6 text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                            <p className="text-white/60 text-sm">{feature.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Bottom Gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030303] to-transparent pointer-events-none" />
        </section>
    );
};
