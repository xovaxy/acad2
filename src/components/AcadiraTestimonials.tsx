'use client';

import * as React from "react";
import { motion } from "framer-motion";
import { Building2, GraduationCap, Heart, Quote } from "lucide-react";
import {
  CardTransformed,
  CardsContainer,
  ContainerScroll,
  ReviewStars,
} from "@/components/ui/animated-cards-stack";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Institute Testimonials
const INSTITUTE_TESTIMONIALS = [
  {
    id: "institute-1",
    name: "Dr. Sarah Johnson",
    position: "Dean of Academic Affairs",
    institution: "Stanford University",
    rating: 5,
    description: "Acadira has revolutionized how we deliver personalized education. Our student engagement has increased by 300% since implementation.",
    avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
  },
  {
    id: "institute-2",
    name: "Prof. Michael Chen",
    position: "Director of Digital Learning",
    institution: "MIT",
    rating: 4.8,
    description: "The AI-powered analytics provide unprecedented insights into student learning patterns. It's transformed our curriculum design process.",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
  },
  {
    id: "institute-3",
    name: "Dr. Emily Rodriguez",
    position: "Vice President of Innovation",
    institution: "Harvard University",
    rating: 5,
    description: "Acadira's platform has enabled us to scale personalized learning across 50,000+ students while maintaining educational quality.",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
  },
  {
    id: "institute-4",
    name: "Prof. David Kim",
    position: "Head of Educational Technology",
    institution: "Oxford University",
    rating: 4.9,
    description: "The seamless integration with our existing systems and the comprehensive faculty training made adoption effortless.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
  },
];

// Student Testimonials
const STUDENT_TESTIMONIALS = [
  {
    id: "student-1",
    name: "Alex Thompson",
    grade: "12th Grade",
    school: "Lincoln High School",
    rating: 5,
    description: "Acadira's AI tutor helped me improve my math grades from C to A+. The personalized learning path made all the difference!",
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
  },
  {
    id: "student-2",
    name: "Maya Patel",
    grade: "10th Grade",
    school: "Roosevelt Academy",
    rating: 4.8,
    description: "I love how the platform adapts to my learning style. The interactive lessons make studying fun and engaging!",
    avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
  },
  {
    id: "student-3",
    name: "Jordan Williams",
    grade: "11th Grade",
    school: "Washington Prep",
    rating: 5,
    description: "The study groups feature helped me connect with peers and improve my understanding of complex topics. Amazing platform!",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
  },
  {
    id: "student-4",
    name: "Sophia Chen",
    grade: "9th Grade",
    school: "Jefferson Middle School",
    rating: 4.9,
    description: "Acadira made the transition to high school so much easier. The AI recommendations helped me choose the right courses.",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
  },
];

// Parent Testimonials
const PARENT_TESTIMONIALS = [
  {
    id: "parent-1",
    name: "Jennifer Martinez",
    relation: "Mother of Emma (8th Grade)",
    location: "California",
    rating: 5,
    description: "As a working parent, Acadira's progress tracking gives me peace of mind. I can monitor Emma's learning journey in real-time.",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
  },
  {
    id: "parent-2",
    name: "Robert Johnson",
    relation: "Father of Tyler (10th Grade)",
    location: "Texas",
    rating: 4.7,
    description: "The parent dashboard is incredible. I can see Tyler's strengths and areas for improvement, helping me support his education better.",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
  },
  {
    id: "parent-3",
    name: "Lisa Wang",
    relation: "Mother of Kevin (12th Grade)",
    location: "New York",
    rating: 5,
    description: "Acadira's college prep features helped Kevin get into his dream university. The personalized guidance was invaluable.",
    avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
  },
  {
    id: "parent-4",
    name: "Mark Davis",
    relation: "Father of Chloe (9th Grade)",
    location: "Florida",
    rating: 4.8,
    description: "The safety features and content filtering give me confidence that Chloe is learning in a secure online environment.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
  },
];


type HeaderCard = {
  id: string;
  type: "header";
  title: string;
  icon: React.ElementType;
  color: string;
  textColor: string;
};

type TestimonialCard = {
  id: string;
  type?: "testimonial";
  name: string;
  rating: number;
  description: string;
  avatarUrl: string;
  position?: string;
  institution?: string;
  grade?: string;
  school?: string;
  relation?: string;
  location?: string;
};

type MixedCard = HeaderCard | TestimonialCard;

export const AcadiraTestimonials = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const }
    }
  };

  // Create mixed testimonials with category headers
  const mixedTestimonials: MixedCard[] = [
    // Opening Header Card
    {
      id: "opening-header",
      type: "header",
      title: "Trusted by Thousands Across the Globe",
      icon: Quote,
      color: "from-purple-500/20 to-pink-500/20",
      textColor: "text-purple-400"
    },
    
    // Institute Header
    {
      id: "institute-header",
      type: "header",
      title: "What Our Partner Institutes Say",
      icon: Building2,
      color: "from-blue-500/20 to-cyan-500/20",
      textColor: "text-blue-400"
    },
    ...INSTITUTE_TESTIMONIALS.slice(0, 2).map(t => ({ ...t, type: "testimonial" as const })),
    
    // Student Header
    {
      id: "student-header",
      type: "header",
      title: "What Our Students Say",
      icon: GraduationCap,
      color: "from-green-500/20 to-emerald-500/20",
      textColor: "text-green-400"
    },
    ...STUDENT_TESTIMONIALS.slice(0, 2).map(t => ({ ...t, type: "testimonial" as const })),
    
    // Parent Header
    {
      id: "parent-header",
      type: "header",
      title: "What Parents Say",
      icon: Heart,
      color: "from-purple-500/20 to-pink-500/20",
      textColor: "text-purple-400"
    },
    ...PARENT_TESTIMONIALS.slice(0, 2).map(t => ({ ...t, type: "testimonial" as const })),
  ];

  return (
    <div className="h-[600vh] relative">
      <section className="sticky top-0 left-0 h-screen w-full overflow-hidden bg-gradient-to-b from-gray-900 via-[#030303] to-gray-900">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 h-full flex flex-col">
          {/* Simple Badge */}
          <div className="flex-shrink-0 px-8 pt-8 pb-4">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.1]"
              >
                <Quote className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-white/70 tracking-wide">What Our Community Says</span>
              </motion.div>
            </div>
          </div>

          {/* Cards Section */}
          <div className="flex-1 flex items-center justify-center">
            <ContainerScroll className="w-[380px] h-[450px]">
              <CardsContainer className="w-full h-full">
              {mixedTestimonials.map((item, index) => (
                <CardTransformed
                  arrayLength={mixedTestimonials.length}
                  key={item.id}
                  variant="dark"
                  index={index + 1}
                  role="article"
                >
                  {item.type === "header" ? (
                    // Header Card
                    (() => {
                      const headerItem = item as HeaderCard;
                      const IconComponent = headerItem.icon;
                      const isOpeningCard = headerItem.id === "opening-header";
                      
                      return (
                        <div className={`flex flex-col items-center justify-center h-full bg-gradient-to-br ${headerItem.color} border border-white/20 rounded-2xl p-8`}>
                          <IconComponent className={`h-16 w-16 ${headerItem.textColor} mb-4`} />
                          <h3 className={`text-2xl font-bold text-center ${headerItem.textColor} mb-4`}>
                            {headerItem.title}
                          </h3>
                          {isOpeningCard && (
                            <p className="text-center text-white/70 text-sm leading-relaxed max-w-xs">
                              Hear from the institutions, students, and parents who have experienced 
                              the transformative power of AI-driven personalized education with Acadira.
                            </p>
                          )}
                          {!isOpeningCard && (
                            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-50" />
                          )}
                        </div>
                      );
                    })()
                  ) : (
                    // Testimonial Card
                    (() => {
                      const testimonialItem = item as TestimonialCard;
                      return (
                        <>
                          <div className="flex flex-col items-center space-y-4 text-center">
                            <Quote className="h-8 w-8 text-white/30 mb-2" />
                            <ReviewStars
                              className="text-yellow-400"
                              rating={testimonialItem.rating}
                            />
                            <div className="mx-auto w-4/5 text-base text-white/90">
                              <blockquote cite="#">{testimonialItem.description}</blockquote>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 mt-4">
                            <Avatar className="!size-12 border border-white/20">
                              <AvatarImage
                                src={testimonialItem.avatarUrl}
                                alt={`Portrait of ${testimonialItem.name}`}
                              />
                              <AvatarFallback className="bg-white/10 text-white">
                                {testimonialItem.name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-left">
                              <span className="block text-lg font-semibold text-white tracking-tight">
                                {testimonialItem.name}
                              </span>
                              <span className="block text-sm text-white/60">
                                {testimonialItem.position || testimonialItem.grade || testimonialItem.relation}
                              </span>
                              <span className="block text-xs text-white/40">
                                {testimonialItem.institution || testimonialItem.school || testimonialItem.location}
                              </span>
                            </div>
                          </div>
                        </>
                      );
                    })()
                  )}
                </CardTransformed>
              ))}
              </CardsContainer>
            </ContainerScroll>
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030303] to-transparent pointer-events-none" />
      </section>
    </div>
  );
};
