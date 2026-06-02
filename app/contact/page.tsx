"use client";

import { useState, useEffect, Suspense, type ChangeEvent, type FormEvent, type SVGProps } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { submitToGoogleSheetsWithRetry } from "@/lib/googleSheets";

const WhatsAppLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false" {...props}>
    <circle cx="12" cy="12" r="12" fill="currentColor" />
    <path fill="#ffffff" d="M17.57 14.357c-.297-.149-1.758-.867-2.031-.967-.273-.099-.471-.149-.669.149-.198.297-.769.967-.941 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.199-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.204-.242-.579-.487-.5-.669-.51-.173-.009-.371-.01-.57-.01-.198 0-.52.074-.792.372-.273.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.718 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347z" />
  </svg>
);

const LinkedInLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false" fill="currentColor" {...props}>
    <path d="M22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0zM7.09 20.452H3.56V9h3.53v11.452zM5.323 7.433a2.047 2.047 0 1 1 .003-4.095 2.047 2.047 0 0 1-.003 4.095zM20.452 20.452h-3.53v-5.569c0-1.328-.027-3.038-1.85-3.038-1.85 0-2.133 1.445-2.133 2.937v5.67H9.41V9h3.389v1.561h.047c.472-.896 1.623-1.84 3.34-1.84 3.574 0 4.266 2.352 4.266 5.408v6.323z" />
  </svg>
);

function ContactPageInner() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", company: "", country: "", city: "", product: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const productName = searchParams.get("product");
    if (productName) {
      setFormData((prev) => ({
        ...prev,
        product: productName,
        subject: prev.subject || `Inquiry about ${productName}`,
      }));
    }
  }, [searchParams]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) { newErrors.email = "Email is required"; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { newErrors.email = "Please enter a valid email"; }
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await submitToGoogleSheetsWithRetry({ name: formData.name, email: formData.email, phone: formData.phone, company: formData.company || undefined, country: formData.country, city: formData.city, product: formData.product || undefined, subject: formData.subject || undefined, message: formData.message });
      toast({ title: "Inquiry Submitted!", description: "We'll get back to you within 24 hours." });
      setFormData({ name: "", email: "", phone: "", company: "", country: "", city: "", product: "", subject: "", message: "" });
      router.push("/thank-you");
    } catch (error) {
      toast({ title: "Submission Failed", description: error instanceof Error ? error.message : "Failed to submit form. Please try again or contact us directly.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all";

  return (
    <main className="min-h-screen">
      <section className="relative w-full overflow-hidden" style={{ aspectRatio: '2500 / 500' }}>
        <img
          src="https://res.cloudinary.com/dlt9vf8qk/image/upload/v1780418025/Get-Catalogue_ge9qu2.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 lg:px-8 pt-16 lg:pt-20">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block font-semibold text-sm uppercase tracking-wider mb-4" style={{ color: '#ffffff' }}>Contact Us</span>
              <h1 className="font-heading text-4xl lg:text-5xl font-bold mb-6" style={{ color: '#ffffff' }}>Get in Touch</h1>
              <p className="text-lg" style={{ color: '#ffffff' }}>Have a question about our architectural hardware? We&apos;re here to help.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="bg-card rounded-3xl p-6 lg:p-10 shadow-card border border-border/50">
                <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">Full Name *</label>
                      <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="John Doe" />
                      {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email Address *</label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="john@example.com" />
                      {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">Phone Number *</label>
                      <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="+44 20 1234 5678" />
                      {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">Company Name</label>
                      <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} className={inputClass} placeholder="Your Company" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-foreground mb-2">Country *</label>
                      <input type="text" id="country" name="country" value={formData.country} onChange={handleChange} className={inputClass} placeholder="United Kingdom" />
                      {errors.country && <p className="text-destructive text-sm mt-1">{errors.country}</p>}
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-foreground mb-2">City *</label>
                      <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} className={inputClass} placeholder="London" />
                      {errors.city && <p className="text-destructive text-sm mt-1">{errors.city}</p>}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="product" className="block text-sm font-medium text-foreground mb-2">Product</label>
                    <input type="text" id="product" name="product" value={formData.product} onChange={handleChange} className={inputClass} placeholder="e.g. HCL-02" />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">Subject</label>
                    <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} className={inputClass} placeholder="Product inquiry, quote request, etc." />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">Message *</label>
                    <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={6} className={`${inputClass} resize-none`} placeholder="Tell us about your project and requirements..." />
                    {errors.message && <p className="text-destructive text-sm mt-1">{errors.message}</p>}
                  </div>
                  <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : <><span>Send Message</span><Send className="w-4 h-4 ml-2" /></>}
                  </Button>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
                <h3 className="font-heading text-xl font-bold text-foreground mb-6">Contact Information</h3>
                <div className="space-y-5">
                  {[
                    { icon: WhatsAppLogo, label: "WhatsApp", content: <a href="https://wa.me/+918850765050" target="_blank" rel="noopener noreferrer" className="text-accent font-medium hover:underline">+91 8850765050</a> },
                    { icon: Phone, label: "Phone", content: <a href="tel:+918850765050" className="text-muted-foreground text-sm hover:text-accent transition-colors">+91 8850765050</a> },
                    { icon: Mail, label: "Email", content: <a href="mailto:sales@hindonix.com" className="text-foreground hover:text-accent transition-colors">sales@hindonix.com</a> },
                    { icon: LinkedInLogo, label: "LinkedIn", content: <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-accent font-medium hover:underline">Hindonix</a> },
                    { icon: MapPin, label: "Address", content: <p className="text-muted-foreground text-sm">182/1/A/1, Shiv samarth nagar, Opp.ST Depot,<br />Tal.Khed, Dis.Ratnagiri. Maharashtra, India Pin code : 415709.</p> },
                  ].map(({ icon: Icon, label, content }) => (
                    <div key={label} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground mb-1">{label}</h4>
                        {content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-secondary rounded-2xl overflow-hidden h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.178509324792!2d55.26585607538467!3d25.197201977706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43348a67e24b%3A0xff45e502e1ceb7e2!2sBusiness%20Bay%20-%20Dubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2s!4v1704123456789!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ContactPage() {
  return (
    <Suspense>
      <ContactPageInner />
    </Suspense>
  );
}
