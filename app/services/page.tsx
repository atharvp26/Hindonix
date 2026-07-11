import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Shield, Clock, Package, FileText, Search, Truck, Ship, Plane } from "lucide-react";

export const metadata: Metadata = {
  title: "Services - Export & Import Solutions",
  description:
    "Hindonix offers end-to-end export management, import consulting, and logistics services for architectural hardware including door handles and door knobs.",
};

const services = [
  {
    id: "export-management",
    icon: Ship,
    title: "Export Management",
    shortDesc: "Complete export solutions from sourcing to final delivery.",
    description: "We handle every aspect of your export operations, including market research, supplier verification, quality control, documentation, and logistics coordination. Our end-to-end approach ensures seamless transactions and timely deliveries.",
    features: ["Market research and opportunity identification", "Supplier verification and negotiations", "Quality inspection and control", "Export documentation and compliance", "Logistics and shipping coordination", "Post-shipment support and tracking"],
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop",
  },
  {
    id: "import-consulting",
    icon: Plane,
    title: "Import Consulting",
    shortDesc: "Strategic guidance for smooth import operations.",
    description: "Navigate complex import regulations and optimize your supply chain with our expert consulting services. We help you identify reliable suppliers, understand tariffs, and streamline customs clearance.",
    features: ["Import regulation and compliance guidance", "Supplier identification and due diligence", "Tariff classification and duty optimization", "Import licensing assistance", "Supply chain risk assessment", "Cost reduction strategies"],
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&h=400&fit=crop",
  },
  {
    id: "logistics",
    icon: Truck,
    title: "Logistics Coordination",
    shortDesc: "Efficient freight and delivery solutions worldwide.",
    description: "Our extensive logistics network ensures your goods reach their destination safely and on time. We offer air, sea, and ground freight options with real-time tracking and competitive rates.",
    features: ["Multi-modal freight solutions (air, sea, ground)", "Warehouse and inventory management", "Real-time shipment tracking", "Cargo insurance arrangements", "Last-mile delivery coordination", "Temperature-controlled logistics"],
    image: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=600&h=400&fit=crop",
  },
  {
    id: "documentation",
    icon: FileText,
    title: "Documentation & Compliance",
    shortDesc: "Accurate paperwork and regulatory compliance.",
    description: "Avoid costly delays and penalties with our comprehensive documentation services. We prepare all required trade documents and ensure full compliance with international regulations.",
    features: ["Bill of lading and commercial invoices", "Certificate of origin preparation", "Letter of credit documentation", "Customs declaration processing", "Export/import licensing", "Regulatory compliance audits"],
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&h=400&fit=crop",
  },
];

const processSteps = [
  { step: "01", title: "Consultation", description: "We discuss your requirements, goals, and timeline to create a tailored strategy.", icon: Search },
  { step: "02", title: "Planning", description: "Our team develops a comprehensive plan covering sourcing, logistics, and documentation.", icon: FileText },
  { step: "03", title: "Execution", description: "We coordinate all aspects of your shipment with precision and transparency.", icon: Package },
  { step: "04", title: "Delivery", description: "Your goods arrive safely and on time, with full post-delivery support.", icon: CheckCircle },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <section className="pt-32 pb-20 gradient-hero">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">Our Services</span>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">Comprehensive Import–Export Solutions</h1>
            <p className="text-lg text-primary-foreground/80 mb-8">From sourcing to delivery, we provide end-to-end services designed to simplify your international trade operations.</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {services.map((service) => (
              <a key={service.id} href={`#${service.id}`} className="bg-card rounded-2xl p-6 shadow-card border border-border/50 hover:shadow-card-hover hover:border-accent/30 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent transition-colors">
                  <service.icon className="w-7 h-7 text-accent group-hover:text-accent-foreground transition-colors" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm">{service.shortDesc}</p>
              </a>
            ))}
          </div>

          <div className="space-y-24">
            {services.map((service, index) => (
              <div key={service.id} id={service.id} className={`grid lg:grid-cols-2 gap-12 items-center`}>
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                    <service.icon className="w-7 h-7 text-accent" />
                  </div>
                  <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-4">{service.title}</h2>
                  <p className="text-muted-foreground text-lg mb-8 leading-relaxed">{service.description}</p>
                  <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-foreground text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="accent" size="lg" asChild>
                    <Link href="/contact" className="gap-2">Request a Quote <ArrowRight className="w-4 h-4" /></Link>
                  </Button>
                </div>
                <div className={`relative ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="absolute inset-0 bg-accent/10 rounded-3xl blur-2xl" />
                  <img src={service.image} alt={service.title} className="relative rounded-2xl shadow-lg w-full aspect-[4/3] object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">How We Work</span>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-6">Our Proven Process</h2>
            <p className="text-muted-foreground text-lg">A systematic approach that ensures transparency, efficiency, and success.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={step.step} className="relative">
                {index < processSteps.length - 1 && <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-border" />}
                <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50 relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                      <span className="font-heading font-bold text-accent-foreground">{step.step}</span>
                    </div>
                    <step.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="bg-primary rounded-3xl p-8 lg:p-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-heading text-3xl lg:text-4xl font-bold text-primary-foreground mb-6">Why Partner With Hindonix?</h2>
                <div className="space-y-6">
                  {[
                    { icon: Shield, title: "Risk Mitigation", desc: "Comprehensive insurance and compliance measures." },
                    { icon: Clock, title: "Time Efficiency", desc: "Streamlined processes for faster turnaround." },
                    { icon: Package, title: "Cost Optimization", desc: "Competitive rates through strategic partnerships." },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-primary-foreground mb-1">{item.title}</h3>
                        <p className="text-primary-foreground/70 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center lg:text-right">
                <p className="text-primary-foreground/80 text-lg mb-8">Ready to streamline your international trade operations?</p>
                <Button variant="hero" size="xl" asChild>
                  <Link href="/contact" className="gap-2">Get Started Today <ArrowRight className="w-5 h-5" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
