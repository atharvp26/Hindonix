import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Target, Eye, Heart, Shield, Users, Award, ArrowRight,
  CheckCircle, Globe, Handshake,
} from "lucide-react";

const values = [
  { icon: Shield, title: "Integrity", description: "Transparent dealings and honest communication in every transaction." },
  { icon: Award, title: "Excellence", description: "Uncompromising quality standards in products and services." },
  { icon: Users, title: "Partnership", description: "Building long-term relationships based on mutual success." },
  { icon: Heart, title: "Commitment", description: "Dedicated to exceeding expectations and delivering results." },
];

const team = [
  { name: "Sarvesh Todkari", role: "Founder & CEO", image: "/images/about/Sarvesh_cropped.PNG", bio: "Hindonix International" },
];

const certifications = [
  { name: "ISO 9001:2025", description: "Quality Management" }
];

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <section className="pt-32 pb-20 gradient-hero">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">About Us</span>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">Your Partner in Architectural Hardware Excellence</h1>
            <p className="text-lg text-primary-foreground/80 mb-8">Since 2025, Hindonix has been crafting premium architectural hardware, delivering exceptional quality and design to UAE & USA markets with integrity and expertise.</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-secondary rounded-3xl p-8 lg:p-10">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-accent" />
              </div>
              <h2 className="font-heading text-2xl lg:text-3xl font-bold text-foreground mb-4">Our Vision</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">To be the world&apos;s most trusted import-export partner, enabling businesses of all sizes to thrive in global markets through seamless trade solutions and unwavering commitment to excellence.</p>
            </div>
            <div className="bg-primary rounded-3xl p-8 lg:p-10">
              <div className="w-14 h-14 rounded-xl bg-primary-foreground/10 flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-accent" />
              </div>
              <h2 className="font-heading text-2xl lg:text-3xl font-bold text-primary-foreground mb-4">Our Mission</h2>
              <p className="text-primary-foreground/80 text-lg leading-relaxed">To simplify international trade for our clients by providing comprehensive, reliable, and cost-effective import-export services backed by expert guidance and cutting-edge logistics solutions.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">Who We Are</span>
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-6">14+ Years of Excellence in International Trade</h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">Founded in 2025, Hindonix has grown from a passionate trading company to a leading international import-export firm serving clients across six continents.</p>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">Our deep expertise in hardware products and industrial supplies, combined with a vast network of certified suppliers and logistics partners, enables us to deliver exceptional value to our clients.</p>
              <div className="space-y-4">
                {["Specialized in hardware & industrial products", "Network of 200+ verified global suppliers", "End-to-end logistics and documentation support", "24/7 customer service and shipment tracking"].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[{ icon: Globe, val: "50+", label: "Countries" }, { icon: Users, val: "500+", label: "Clients", mt: true }, { icon: Handshake, val: "200+", label: "Suppliers" }, { icon: Award, val: "14+", label: "Years", mt: true }].map(({ icon: Icon, val, label, mt }) => (
                <div key={label} className={`bg-card rounded-2xl p-6 shadow-card text-center${mt ? " mt-8" : ""}`}>
                  <Icon className="w-10 h-10 text-accent mx-auto mb-3" />
                  <div className="text-3xl font-heading font-bold text-foreground">{val}</div>
                  <div className="text-sm text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background" id="team">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">Leadership</span>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-6">Meet Our Team</h2>
            <p className="text-muted-foreground text-lg">Experienced professionals dedicated to your success in global trade.</p>
          </div>
          <div className="flex justify-center">
            {team.map((member) => (
              <div key={member.name} className="flex flex-col items-center text-center gap-4">
                <div className="w-36 h-36 md:w-40 md:h-40 rounded-full overflow-hidden border border-border/60 shadow-card">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-1">{member.name}</h3>
                  <p className="text-accent font-medium text-sm mb-2">{member.role}</p>
                  <p className="text-muted-foreground text-sm max-w-xs">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">Our Foundation</span>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-6">Core Values</h2>
            <p className="text-muted-foreground text-lg">The principles that guide every decision and interaction at Hindonix.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="bg-card rounded-2xl p-6 shadow-card border border-border/50 text-center hover:shadow-card-hover transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-5">
                  <value.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">Certifications & Partnerships</span>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-6">Trusted & Certified</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert) => (
              <div key={cert.name} className="bg-secondary rounded-xl p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground font-bold text-xs">{cert.name.split(" ")[0]}</span>
                </div>
                <h3 className="font-heading font-bold text-foreground mb-1">{cert.name}</h3>
                <p className="text-muted-foreground text-sm">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-primary-foreground mb-6">Ready to Work with Us?</h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">Join hundreds of businesses that trust Hindonix for their architectural hardware needs.</p>
          <Button variant="hero" size="xl" asChild>
            <Link href="/contact" className="gap-2">
              Get in Touch <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
