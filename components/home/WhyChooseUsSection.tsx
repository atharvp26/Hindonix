import { Award, Clock, Handshake, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const reasons = [
  { icon: Clock, title: "Project Focused Support", description: "Fast quotation, sample assistance, technical guidance and dedicated support from concept to completion." },
  { icon: Globe, title: "Global Presence", description: "Trusted by architects, developers & hardware partners across international markets." },
  { icon: Handshake, title: "Architects & Designer Collaborations", description: "Tailored hardware solutions for architects, interior designers, builders & procurement teams." },
  { icon: Award, title: "Proven Manufacturing Excellence", description: "Over a decade of experience delivering premium architectural hardware for luxury & large scale projects." },
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
              <div className="overflow-hidden">
                <img src="https://res.cloudinary.com/dlt9vf8qk/image/upload/v1781361665/Finish-Signature_hkh2s3.png" alt="Signature Finishes" className="w-full h-auto block" />
              </div>
              <div className="overflow-hidden">
                <img src="https://res.cloudinary.com/dlt9vf8qk/image/upload/v1781361667/Engineered_ragx6k.png" alt="Engineered for Durability" className="w-full h-auto block" />
              </div>
              <div className="overflow-hidden col-span-2">
                <img src="https://res.cloudinary.com/dlt9vf8qk/image/upload/v1781361668/Global-Presence_lijaa7.png" alt="Global Presence" className="w-full h-auto block" />
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
              <div className="overflow-hidden">
                <img src="https://res.cloudinary.com/dlt9vf8qk/image/upload/v1781361665/Client-Focused_ouuhsa.png" alt="Client Focused" className="w-full h-auto block" />
              </div>
              <div className="overflow-hidden">
                <img src="https://res.cloudinary.com/dlt9vf8qk/image/upload/v1781361665/Premium-Finish-Option_ouqxnq.png" alt="Premium Finish Option" className="w-full h-auto block" />
              </div>
              <div className="overflow-hidden">
                <img src="https://res.cloudinary.com/dlt9vf8qk/image/upload/v1781361666/Project-ready_suiimz.png" alt="Project Ready" className="w-full h-auto block" />
              </div>
              <div className="overflow-hidden">
                <img src="https://res.cloudinary.com/dlt9vf8qk/image/upload/v1781361666/Trade-Network_ews3wa.png" alt="Trade Network" className="w-full h-auto block" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
