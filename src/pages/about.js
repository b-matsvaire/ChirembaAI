import Navbar from "@/components/navbar";

export default function About() {
  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Medical Officer",
      description: "Expert in AI-driven healthcare with 15+ years of experience",
      image: "👩‍⚕️",
    },
    {
      name: "Dr. Michael Chen",
      role: "AI Research Lead",
      description: "Specialist in machine learning and medical diagnostics",
      image: "👨‍🔬",
    },
    {
      name: "Dr. Emily Williams",
      role: "Healthcare Director",
      description: "Focused on patient care and medical ethics",
      image: "👩‍💼",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
        </div>

        <div className="relative container mx-auto px-4 pt-20 pb-16 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8">
            <span className="text-primary-400 text-sm font-medium">About ChirembaAI</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Revolutionizing Healthcare
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
              Through AI Innovation
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed">
            ChirembaAI combines cutting-edge artificial intelligence with medical expertise to provide accessible, accurate, and personalized healthcare guidance to everyone, everywhere.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">Our Mission</h2>
              <p className="text-white/70 leading-relaxed">
                We're on a mission to make quality healthcare accessible to everyone through innovative AI technology. Our platform provides instant medical guidance while maintaining the highest standards of privacy and security.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-2xl font-bold text-accent-400 mb-2">24/7</div>
                  <div className="text-white/70">Available Support</div>
                </div>
                <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-2xl font-bold text-accent-400 mb-2">100%</div>
                  <div className="text-white/70">Privacy Focused</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-white/10 p-8 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-4 h-full">
                  <div className="space-y-4">
                    <div className="h-2 w-20 bg-primary-500/40 rounded-full"></div>
                    <div className="h-2 w-32 bg-primary-500/30 rounded-full"></div>
                    <div className="h-2 w-24 bg-primary-500/20 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="text-6xl">🏥</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative py-16 border-t border-white/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
              >
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-4xl mb-6">
                  {member.image}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
                <div className="text-accent-400 mb-4">{member.role}</div>
                <p className="text-white/70">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}