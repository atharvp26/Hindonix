import {
  Award,
  Clock,
  Handshake,
  Globe,
  CheckCircle,
  TrendingUp,
  Factory,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const reasons = [
  {
    icon: Clock,
    title: "Responsive Service",
    description:
      "Quick quotes, sample availability, and dedicated support for all your hardware needs.",
  },
  {
    icon: Globe,
    title: "UAE & USA Focus",
    description:
      "Dedicated service to UAE and USA markets with local understanding and support.",
  },
  {
    icon: Handshake,
    title: "B2B Partnership",
    description:
      "Tailored solutions for architects, designers, and construction professionals.",
  },
  {
    icon: Award,
    title: "10+ Years Expertise",
    description:
      "Decade of experience crafting premium architectural hardware for luxury projects.",
  },
];

const stats = [
  { value: "10+", label: "Trade Partners", icon: Handshake },
  { value: "5,000+", label: "Projects Completed", icon: TrendingUp },
  { value: "99%", label: "Satisfaction Rate", icon: CheckCircle },
  { value: "10+", label: "Premium Finishes", icon: Globe },
];

export function WhyChooseUsSection() {
  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
          {/* Industry Expertise (left) */}
          <div className="bg-card rounded-3xl p-6 lg:p-8 shadow-card border border-border/50 flex flex-col justify-between">
            <div>
              <span className="inline-block text-accent font-semibold text-xs uppercase tracking-wider mb-3">
                Industry Expertise
              </span>
              <h3 className="font-heading text-2xl lg:text-3xl font-bold text-foreground mb-3">
                Specialized in Architectural Hardware
              </h3>
              <p className="text-muted-foreground text-sm lg:text-base mb-5 leading-relaxed">
                Since 2025, we've been crafting premium architectural hardware
                for luxury residential and commercial projects. Our expertise in
                material selection, finish quality, and ergonomic design ensures
                hardware that performs beautifully for decades.
              </p>
              <div className="flex flex-wrap gap-2.5 mb-6">
                {[
                  "Brass Knobs",
                  "Wooden Knobs",
                  "Door Handles",
                  "Pull Handles",
                  "PVD Finishes",
                  "Custom Solutions",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold border border-accent/40 bg-accent/10 text-foreground shadow-sm shadow-accent/10 hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary rounded-2xl p-5 text-center">
                <Factory className="w-10 h-10 text-accent mx-auto mb-3" />
                <div className="text-xl font-heading font-bold text-foreground">
                  10+
                </div>
                <div className="text-xs text-muted-foreground">
                  Finishes
                </div>
              </div>
              <div className="bg-secondary rounded-2xl p-5 text-center">
                <Shield className="w-10 h-10 text-accent mx-auto mb-3" />
                <div className="text-xl font-heading font-bold text-foreground">
                  100%
                </div>
                <div className="text-xs text-muted-foreground">
                  Quality Assured
                </div>
              </div>
              <div className="bg-primary rounded-2xl p-5 text-center col-span-2">
                <div className="text-lg font-heading font-bold text-primary-foreground mb-1">
                  UAE & USA Markets
                </div>
                <div className="text-xs text-primary-foreground/70">
                  Serving B2B Partners Across Two Regions
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose Us (right) */}
          <div className="bg-secondary rounded-3xl p-6 lg:p-8 shadow-card border border-border/50">
            <span className="inline-block text-accent font-semibold text-xs uppercase tracking-wider mb-3">
              Why Choose Us
            </span>
            <h2 className="font-heading text-3xl lg:text-3xl font-bold text-foreground mb-3">
              Craftsmanship Meets Design Excellence
            </h2>
            <p className="text-muted-foreground text-sm lg:text-base mb-6">
              We combine traditional craftsmanship with modern design to deliver
              architectural hardware that enhances every space with beauty,
              function, and lasting quality.
            </p>

            <div className="grid sm:grid-cols-2 gap-5 mb-6">
              {reasons.map((reason, index) => (
                <div
                  key={reason.title}
                  className={cn("flex gap-4 opacity-0 animate-fade-in")}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center">
                    <reason.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground mb-0.5">
                      {reason.title}
                    </h3>
                    <p className="text-muted-foreground text-xs lg:text-sm leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={cn(
                    "text-center p-5 rounded-2xl bg-card border border-border/60 opacity-0 animate-scale-in"
                  )}
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <stat.icon className="w-6 h-6 text-accent mx-auto mb-2" />
                  <div className="text-xl lg:text-2xl font-heading font-bold text-foreground mb-0.5">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
