import { Award, Clock, Handshake, Globe, CheckCircle, TrendingUp, Factory, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const reasons = [
  { icon: Clock, title: "Responsive Service", description: "Quick quotes, sample availability, and dedicated support for all your hardware needs." },
  { icon: Globe, title: "UAE & USA Focus", description: "Dedicated service to UAE and USA markets with local understanding and support." },
  { icon: Handshake, title: "B2B Partnership", description: "Tailored solutions for architects, designers, and construction professionals." },
  { icon: Award, title: "10+ Years Expertise", description: "Decade of experience crafting premium architectural hardware for luxury projects." },
];

const stats = [
  { value: "10+", label: "Trade Partners", icon: Handshake },
  { value: "5,000+", label: "Projects Completed", icon: TrendingUp },
  { value: "99%", label: "Satisfaction Rate", icon: CheckCircle },
  { value: "10+", label: "Premium Finishes", icon: Globe },
];

export function WhyChooseUsSection() {
  return (
    <section className="py-16 lg:py-20" style={{ backgroundColor: '#eaeaea' }}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          <div className="bg-white p-6 lg:p-10 flex flex-col justify-between border border-[#1a1a1a]/8">
            <div>
              <span className="inline-block text-[#1a1a1a]/45 font-normal text-xs tracking-[0.05em] mb-3" style={{ fontFamily: 'Montserrat, system-ui, sans-serif' }}>Industry Expertise</span>
              <h3 className="text-2xl lg:text-3xl font-semibold text-[#1a1a1a] mb-3 tracking-tight">Specialized in Architectural Hardware</h3>
              <p className="text-[#1a1a1a]/55 text-sm lg:text-base mb-5 leading-relaxed font-light">Designed for architects, interior designers and developers, Hindonix delivers architectural hardware defined by refined craftsmanship, lasting durability and exceptional finish quality.</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["Lever Handles", "Mortise Handle System", "Bespoke Finishes"].map((tag) => (
                  <span key={tag} className="px-3 py-1.5 text-xs font-medium border border-[#1a1a1a]/20 text-[#1a1a1a]/70 hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors cursor-default tracking-wide">{tag}</span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#eaeaea] p-5 text-center">
                <Factory className="w-8 h-8 text-[#1a1a1a]/40 mx-auto mb-3" />
                <div className="text-xl font-semibold text-[#1a1a1a]">10+</div>
                <div className="text-xs text-[#1a1a1a]/50 uppercase tracking-wider mt-1">Signature Finishes</div>
              </div>
              <div className="bg-[#eaeaea] p-5 text-center">
                <Shield className="w-8 h-8 text-[#1a1a1a]/40 mx-auto mb-3" />
                <div className="text-xl font-semibold text-[#1a1a1a]">100%</div>
                <div className="text-xs text-[#1a1a1a]/50 uppercase tracking-wider mt-1">Engineered for Durability</div>
              </div>
              <div className="bg-[#1a1a1a] p-5 text-center col-span-2">
                <div className="text-base font-semibold text-[#eaeaea] mb-1 tracking-wide">Global Presence</div>
                <div className="text-xs text-[#f3f3f3]/60 font-light">Trusted by Architects, developers &amp; hardware partners across international markets.</div>
              </div>
            </div>
          </div>

          <div className="bg-[#f3f3f3] p-6 lg:p-10 border border-[#1a1a1a]/8">
            <span className="inline-block text-[#1a1a1a]/45 font-normal text-xs tracking-[0.05em] mb-3" style={{ fontFamily: 'Montserrat, system-ui, sans-serif' }}>Why Choose Us</span>
            <h2 className="text-2xl lg:text-3xl font-semibold text-[#1a1a1a] mb-3 tracking-tight">Built on Precision, Trusted by Professionals</h2>
            <p className="text-[#1a1a1a]/55 text-sm lg:text-base mb-6 font-light">Hindonix delivers premium architectural hardware that combines refined aesthetics, precision engineering and lasting durability for residential projects.</p>
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              {reasons.map((reason, index) => (
                <div key={reason.title} className={cn("flex gap-4")} style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex-shrink-0 w-10 h-10 bg-[#eaeaea] flex items-center justify-center">
                    <reason.icon className="w-5 h-5 text-[#1a1a1a]/50" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a1a1a] mb-0.5 text-sm tracking-wide">{reason.title}</h3>
                    <p className="text-[#1a1a1a]/55 text-xs leading-relaxed font-light">{reason.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center p-5 bg-white border border-[#1a1a1a]/8">
                  <stat.icon className="w-5 h-5 text-[#1a1a1a]/35 mx-auto mb-2" />
                  <div className="text-xl lg:text-2xl font-semibold text-[#1a1a1a] mb-0.5">{stat.value}</div>
                  <div className="text-xs text-[#1a1a1a]/45 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
