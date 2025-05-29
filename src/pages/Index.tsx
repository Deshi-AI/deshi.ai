import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Brain, Clock, Rocket, Share2, Workflow, Users, MessageSquare, Search, PlugZap, FileText, GraduationCap, UserCog, AlertTriangle, ArchiveX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom'; // Ensure useNavigate is imported

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.fromTo(titleRef.current, 
        { opacity: 0, y: 60, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1.8, ease: "power4.out" }
      )
      .fromTo(subtitleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.4, ease: "power4.out" }, "-=1.2"
      )
      .fromTo(ctaRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power4.out" }, "-=0.8"
      );

      const particles = gsap.utils.toArray(".floating-particle");
      particles.forEach((particle) => {
        gsap.to(particle as HTMLElement, {
          y: "random(-80, 80)",
          x: "random(-60, 60)",
          rotation: "random(0, 360)",
          scale: "random(0.8, 1.5)",
          duration: "random(8, 15)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      // This event listener for particle animation should not interfere with button clicks.
      // It's better to scope such listeners if possible, but it's unlikely to be the cause
      // if navigation is already occurring.
      const clickHandler = (e: MouseEvent) => {
        particles.forEach((particle) => {
          gsap.to(particle as HTMLElement, {
            scale: "random(1.5, 2.5)",
            rotation: "+=180",
            duration: 0.8,
            ease: "elastic.out(1, 0.5)",
            yoyo: true,
            repeat: 1
          });
        });
      };
      document.addEventListener('click', clickHandler);

      gsap.to(".pulse-particle", {
        scale: "random(1.5, 3)",
        opacity: "random(0.4, 0.8)",
        rotation: "random(0, 360)",
        duration: "random(4, 8)",
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        stagger: 1
      });

      gsap.to(".orbital-particle", {
        rotation: 360,
        transformOrigin: "50vw 50vh",
        duration: "random(20, 30)",
        repeat: -1,
        ease: "none",
        stagger: 2
      });

      gsap.utils.toArray('.smooth-fade').forEach((element) => {
        gsap.fromTo(element as HTMLElement, 
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element as HTMLElement,
              start: "top 85%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      gsap.utils.toArray('.smooth-card').forEach((element) => {
        gsap.fromTo(element as HTMLElement,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element as HTMLElement,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      gsap.to(".enhanced-data-flow", {
        strokeDashoffset: -400,
        duration: 4,
        repeat: -1,
        ease: "none"
      });

    }, heroRef);

    // Cleanup function for the document event listener
    return () => {
      document.removeEventListener('click', (ctx.data as any).clickHandler); // Assuming clickHandler was stored in ctx.data or made accessible
      ctx.revert();
    };
  }, []);

  // Handler for the Sign In button
  const handleSignInClick = () => {
    navigate('/auth'); // Navigates to the /auth route
  };

  return (
    <div ref={heroRef} className="bg-black text-white min-h-screen overflow-x-hidden relative font-space">
      <div className="fixed inset-0 pointer-events-none opacity-80 z-0">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="floating-particle absolute w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full shadow-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
        {[...Array(15)].map((_, i) => (
          <div
            key={`pulse-${i}`}
            className="pulse-particle absolute w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full shadow-xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
        {[...Array(8)].map((_, i) => (
          <div
            key={`orbital-${i}`}
            className="orbital-particle absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
            style={{
              left: `${20 + i * 10}%`,
              top: `${30 + i * 5}%`,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10 animate-pulse" />
      </div>

      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-wider">Deshi.ai</div>
          <div className="hidden md:flex space-x-8">
            <a href="#how-it-works" className="hover:text-gray-300 transition-colors font-medium">How it Works</a>
            <a href="#features" className="hover:text-gray-300 transition-colors font-medium">Features</a>
            <a href="#beta" className="hover:text-gray-300 transition-colors font-medium">Beta Access</a>
          </div>
          <Button 
            variant="outline" 
            className="border-white text-black bg-white hover:bg-gray-100 hover:text-black font-semibold"
            onClick={handleSignInClick} // Attach the handler here
          >
            Sign In
          </Button>
        </div>
      </nav>

      <section className="gradient-section relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        <div className="text-center max-w-5xl mx-auto relative z-10">
          <h1 
            ref={titleRef}
            className="text-6xl md:text-8xl font-black mb-6 leading-none tracking-tighter"
          >
            Your Company's
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              Eternal Memory
            </span>
          </h1>
          
          <p 
            ref={subtitleRef}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            Don't let critical knowledge walk out the door. Deshi transforms your team's expertise into intelligent AI Replicas that preserve wisdom forever.
          </p>
          
          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-4 font-semibold">
              Request Beta Access
            </Button>
            <Button size="lg" variant="outline" className="border-white text-black bg-white hover:bg-gray-100 hover:text-black text-lg px-8 py-4 font-semibold">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      <section className="gradient-section py-24 px-6 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16 smooth-fade">
            <AlertTriangle className="w-16 h-16 mx-auto mb-6 text-gray-400" />
            <h2 className="text-5xl font-bold mb-6 tracking-tight">Knowledge Walks Out the Door</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-medium">
              Every day, companies lose millions in intellectual capital when experienced employees leave, retire, or are simply unavailable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Clock, title: "Slow Onboarding", desc: "New hires take months to become productive" },
              { icon: ArchiveX, title: "Lost Knowledge", desc: "Critical expertise disappears with departing employees" },
              { icon: AlertTriangle, title: "Repeated Mistakes", desc: "Teams make the same errors without historical context" },
              { icon: Brain, title: "Tribal Knowledge", desc: "Valuable insights trapped in individual minds" }
            ].map((item, index) => (
              <Card key={index} className="smooth-card bg-white/5 border-white/5 p-6 text-center hover:bg-white/10 transition-all duration-500 backdrop-blur-sm">
                <item.icon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold mb-3 text-white">{item.title}</h3>
                <p className="text-gray-400 font-medium">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="solution" className="gradient-section py-24 px-6 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16 smooth-fade">
            <Brain className="w-16 h-16 mx-auto mb-6 text-white" />
            <h2 className="text-5xl font-bold mb-6 tracking-tight">Enterprise Replicas Powered by AI</h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto font-medium">
              Deshi creates intelligent AI Replicas of your high-value employees, preserving their expertise and making it accessible 24/7. Built on the powerful Sensay platform.
            </p>
          </div>

          <div className="smooth-fade">
            <div className="relative flex flex-col lg:flex-row items-center justify-center gap-16 mb-16 p-12">
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-90" viewBox="0 0 800 300">
                <defs>
                  <linearGradient id="enhancedFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="30%" stopColor="#60a5fa" stopOpacity="0.9" />
                    <stop offset="70%" stopColor="#a855f7" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                <path
                  d="M 100 150 Q 200 100 300 150 Q 400 200 500 150 Q 600 100 700 150"
                  stroke="url(#enhancedFlow)"
                  strokeWidth="4"
                  fill="none"
                  className="enhanced-data-flow"
                  style={{ strokeDasharray: "40,20", strokeDashoffset: "0" }}
                />
              </svg>

              <div className="flex flex-col items-center space-y-4 relative">
                <div className="w-20 h-20 bg-white/15 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-sm hover:bg-white/25 transition-all duration-500">
                  <MessageSquare className="w-10 h-10" />
                </div>
                <span className="text-sm text-gray-400 font-semibold">Slack Messages</span>
              </div>
              
              <div className="flex flex-col items-center space-y-4 relative">
                <div className="w-20 h-20 bg-white/15 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-sm hover:bg-white/25 transition-all duration-500">
                  <FileText className="w-10 h-10" />
                </div>
                <span className="text-sm text-gray-400 font-semibold">Documents</span>
              </div>
              
              <div className="flex flex-col items-center space-y-4 relative">
                <div className="w-28 h-28 bg-gradient-to-br from-white/25 to-white/10 rounded-2xl flex items-center justify-center border-2 border-white/30 backdrop-blur-sm hover:from-white/35 hover:to-white/20 transition-all duration-500 shadow-2xl">
                  <Brain className="w-14 h-14" />
                </div>
                <span className="text-sm text-gray-400 font-bold">Deshi AI</span>
              </div>
              
              <div className="flex flex-col items-center space-y-4 relative">
                <div className="w-20 h-20 bg-white/15 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-sm hover:bg-white/25 transition-all duration-500">
                  <Users className="w-10 h-10" />
                </div>
                <span className="text-sm text-gray-400 font-semibold">AI Replica</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="gradient-section py-24 px-6 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16 smooth-fade">
            <h2 className="text-5xl font-bold mb-6 tracking-tight">Simple Steps to Eternal Knowledge</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: PlugZap, title: "Connect", desc: "Securely integrate with Slack and your workspace tools", step: "01" },
              { icon: Brain, title: "AI Learns", desc: "Our AI processes conversations and documents to build knowledge", step: "02" },
              { icon: GraduationCap, title: "Train Replica", desc: "An AI Replica is trained on your expert's specific knowledge", step: "03" },
              { icon: Search, title: "Access Wisdom", desc: "Get instant answers and insights anytime, anywhere", step: "04" }
            ].map((item, index) => (
              <div key={index} className="smooth-card text-center">
                <div className="relative mb-6">
                  <div className="w-24 h-24 bg-white/15 rounded-full flex items-center justify-center mx-auto border border-white/20 backdrop-blur-sm hover:bg-white/25 transition-all duration-500 shadow-xl">
                    <item.icon className="w-12 h-12" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-10 h-10 bg-white text-black rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-2xl font-semibold mb-4 tracking-tight">{item.title}</h3>
                <p className="text-gray-400 font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="gradient-section py-24 px-6 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16 smooth-fade">
            <h2 className="text-5xl font-bold mb-6 tracking-tight">Scale Expertise, Boost Productivity</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Clock, title: "24/7 Expert Access", desc: "Get knowledgeable answers instantly, any time of day" },
              { icon: Rocket, title: "Accelerated Onboarding", desc: "New hires learn faster with AI mentors" },
              { icon: Share2, title: "Knowledge Transfer", desc: "Retain critical info during employee transitions" },
              { icon: Workflow, title: "AI Collaboration", desc: "Enhance team efficiency with intelligent support" }
            ].map((item, index) => (
              <Card key={index} className="smooth-card bg-white/5 border-white/5 p-8 text-center hover:bg-white/15 transition-all duration-500 backdrop-blur-sm shadow-xl">
                <item.icon className="w-12 h-12 mx-auto mb-6 text-white" />
                <h3 className="text-xl font-semibold mb-4 text-white tracking-tight">{item.title}</h3>
                <p className="text-white font-medium">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="beta" className="gradient-section py-24 px-6 relative">
        <div className="max-w-4xl mx-auto text-center smooth-fade relative z-10">
          <h2 className="text-5xl font-bold mb-6 tracking-tight">Ready to Future-Proof Your Knowledge?</h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-medium">
            Don't let your company's wisdom walk away. Join the beta and transform how your organization preserves and shares expertise.
          </p>
          <Button size="lg" className="bg-white text-black hover:bg-gray-100 text-lg px-12 py-4 font-semibold">
            Request Beta Access
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
