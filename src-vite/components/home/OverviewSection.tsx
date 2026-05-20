import {
  Package,
  Truck,
  Users,
  Globe,
  Factory,
  Shield,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const overviewCards = [
  {
    icon: Package,
    title: "Premium Hardware",
    description:
      "Precision-crafted architectural hardware with exceptional quality and attention to detail.",
    stat: "1000+",
    statLabel: "Products",
  },
  {
    icon: Truck,
    title: "UAE & USA Delivery",
    description:
      "Reliable logistics ensuring timely delivery to UAE and USA markets with careful handling.",
    stat: "98%",
    statLabel: "On-Time Delivery",
  },
  {
    icon: Settings,
    title: "Customizations",
    description:
      "Bespoke hardware tailored to your exact specifications with personalized finishes and designs.",
    stat: "100%",
    statLabel: "Customizable",
    featured: true,
  },
  {
    icon: Users,
    title: "B2B Partners",
    description:
      "Building lasting relationships with architects, designers, and construction professionals.",
    stat: "10+",
    statLabel: "Trade Partners",
  },
  {
    icon: Globe,
    title: "Premium Finishes",
    description:
      "Extensive range of finishes including PVD, brass, and premium metal options.",
    stat: "10+",
    statLabel: "Finish Options",
  },
];

export function OverviewSection() {
  return (
    <section className="py-20 lg:py-28 bg-secondary">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
            Why Design Professionals Choose Us
          </span>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-6">
            Exceptional Architectural Hardware
          </h2>
          <p className="text-muted-foreground text-lg">
            From concept to installation, we provide premium hardware solutions
            with uncompromising quality, elegant design, and lasting durability.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {overviewCards.map((card, index) => (
            <div
              key={card.title}
              className={cn(
                "group rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border",
                "opacity-0 animate-fade-in",
                card.featured
                  ? "bg-gradient-to-br from-accent to-accent/80 border-accent shadow-lg"
                  : "bg-card border-border/50 hover:border-accent/30"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300",
                  card.featured
                    ? "bg-accent-foreground/10"
                    : "bg-accent/10 group-hover:bg-accent"
                )}
              >
                <card.icon
                  className={cn(
                    "w-7 h-7 transition-colors",
                    card.featured
                      ? "text-accent-foreground"
                      : "text-accent group-hover:text-accent-foreground"
                  )}
                />
              </div>

              <h3
                className={cn(
                  "font-heading text-xl font-semibold mb-3",
                  card.featured ? "text-accent-foreground" : "text-foreground"
                )}
              >
                {card.title}
              </h3>

              <p
                className={cn(
                  "text-sm mb-5 leading-relaxed",
                  card.featured
                    ? "text-accent-foreground/90"
                    : "text-muted-foreground"
                )}
              >
                {card.description}
              </p>

              <div
                className={cn(
                  "pt-4 border-t",
                  card.featured
                    ? "border-accent-foreground/20"
                    : "border-border"
                )}
              >
                <div
                  className={cn(
                    "text-2xl font-heading font-bold",
                    card.featured ? "text-accent-foreground" : "text-accent"
                  )}
                >
                  {card.stat}
                </div>
                <div
                  className={cn(
                    "text-xs uppercase tracking-wider",
                    card.featured
                      ? "text-accent-foreground/80"
                      : "text-muted-foreground"
                  )}
                >
                  {card.statLabel}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
