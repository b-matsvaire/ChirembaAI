import Navbar from "@/components/navbar";
import Typewriter from "typewriter-effect";
import { parseCookies } from "nookies";
import Link from 'next/link';

export default function Home({ username }) {
  const features = [
    {
      title: "Medical History",
      description: "Track and manage your health records securely in one place.",
      icon: "🏥",
      link: "/medicaldata/activecomplaint",
    },
    {
      title: "AI Consultation",
      description: "Get instant medical guidance powered by advanced AI.",
      icon: "👨‍⚕️",
      link: "/chatbot",
    },
    {
      title: "Smart Diagnosis",
      description: "Receive AI-powered preliminary health assessments.",
      icon: "🧬",
      link: "/diseaseprediction",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
        </div>

        <div className="relative container mx-auto px-4 pt-20 pb-24 text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8">
            <span className="text-primary-400 text-sm font-medium">Powered by Advanced AI</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Your Personal
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
              Healthcare Assistant
            </span>
          </h1>

          {/* Typewriter */}
          <div className="h-20 text-xl md:text-2xl text-white/70 mb-12">
            <Typewriter
              options={{
                strings: [
                  "24/7 AI-powered medical guidance",
                  "Secure and private consultations",
                  "Instant health insights",
                  "Professional medical support",
                ],
                autoStart: true,
                loop: true,
                delay: 50,
              }}
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link href="/medicaldata/activecomplaint">
              <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                Start Your Consultation
              </button>
            </Link>
            <Link href="/about">
              <button className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-full font-semibold text-lg transition-all duration-300 border border-white/10 hover:border-white/20">
                Learn More
              </button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Link key={index} href={feature.link}>
                <div className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-3xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "24/7", label: "Available" },
              { number: "100%", label: "Private" },
              { number: "AI", label: "Powered" },
              { number: "Fast", label: "Response" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export async function getServerSideProps(context) {
  const cookies = parseCookies(context);
  const username = cookies.username || "Guest";
  return {
    props: { username },
  };
}