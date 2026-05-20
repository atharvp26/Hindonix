// v1.0.1
import { Package, Truck, Users, Globe, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const overviewCards = [
  { icon: Package, title: "Premium Hardware", description: "Precision-crafted architectural hardware with exceptional quality and attention to detail.", stat: "1000+", statLabel: "Products" },
  { icon: Truck, title: "UAE & USA Delivery", description: "Reliable logistics ensuring timely delivery to UAE and USA markets with careful handling.", stat: "98%", statLabel: "On-Time Delivery" },
  { icon: Settings, title: "Customizations", description: "Bespoke hardware tailored to your exact specifications with personalized finishes and designs.", stat: "100%", statLabel: "Customizable", featured: true },
  { icon: Users, title: "B2B Partners", description: "Building lasting relationships with architects, designers, and construction professionals.", stat: "10+", statLabel: "Trade Partners" },
  { icon: Globe, title: "Premium Finishes", description: "Extensive range of finishes including PVD, brass, and premium metal options.", stat: "10+", statLabel: "Finish Options" },
];

export function OverviewSection() {
  return (
    <section className="py-20 lg:py-28" style={{ backgroundColor: '#eaeaea' }}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-[#1a1a1a]/50 font-normal text-xs tracking-[0.05em] mb-4" style={{ fontFamily: 'Montserrat, system-ui, sans-serif' }}>Why Design Professionals Choose Us</span>
          <h2 className="text-3xl lg:text-4xl font-semibold text-[#1a1a1a] mb-6 tracking-tight">Exceptional Architectural Hardware</h2>
          <p className="text-[#1a1a1a]/60 text-base lg:text-lg font-light">From concept to installation, we provide premium hardware solutions with uncompromising quality, elegant design, and lasting durability.</p>
        </div>
      </div>
      <div className="grid w-full grid-cols-1 lg:grid-cols-5 gap-px border-y border-[#1a1a1a]/10" style={{ backgroundColor: '#1a1a1a' }}>
          {overviewCards.map((card, index) => (
            <div key={card.title} className={cn("group p-8 transition-all duration-300", card.featured ? "bg-[#1a1a1a] text-[#eaeaea]" : "bg-[#eaeaea] hover:bg-white")} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={cn("w-12 h-12 flex items-center justify-center mb-6 transition-all duration-300", card.featured ? "text-[#f3f3f3]" : "text-[#1a1a1a]/40 group-hover:text-[#1a1a1a]")}>
                <card.icon className="w-6 h-6" />
              </div>
              <h3 className={cn("text-base font-semibold mb-3 tracking-wide", card.featured ? "text-[#eaeaea]" : "text-[#1a1a1a]")}>{card.title}</h3>
              <p className={cn("text-xs mb-6 leading-relaxed font-light", card.featured ? "text-[#f3f3f3]/70" : "text-[#1a1a1a]/55")}>{card.description}</p>
              <div className={cn("pt-4 border-t", card.featured ? "border-[#f3f3f3]/20" : "border-[#1a1a1a]/10")}>
                <div className={cn("text-2xl font-semibold", card.featured ? "text-[#f3f3f3]" : "text-[#1a1a1a]")}>{card.stat}</div>
                <div className={cn("text-xs uppercase tracking-wider mt-0.5", card.featured ? "text-[#f3f3f3]/60" : "text-[#1a1a1a]/45")}>{card.statLabel}</div>
              </div>
            </div>
          ))}
        </div>
    </section>
  );
}
