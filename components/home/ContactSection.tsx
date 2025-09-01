import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { SocialConnectSection } from "@/components/social-connect-section";

// New component for displaying contact benefits
const ContactBenefits = () => {
  return (
    <div className="mt-8 pt-6 border-t border-border">
      <h4 className="text-lg font-semibold mb-3">Why Connect With Me?</h4>
      <ul className="space-y-2">
        {[
          "Quick response within 24-48 hours",
          "Professional collaboration opportunities",
          "Open to freelance projects and consulting",
          "Technical expertise and problem-solving"
        ].map((benefit, index) => (
          <li key={index} className="flex items-start">
            <span className="mr-2 text-primary">✓</span>
            <span className="text-muted-foreground">{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const ContactSection = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit form");
      }

      toast({
        title: "Message Sent!",
        description:
          "Your message has been successfully sent. I'll get back to you soon.",
      });

      // Reset form
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast({
        title: "Error",
        description:
          (error as Error).message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-black/5 border text-black dark:bg-black/10 border-black/10 text-sm font-medium mb-6 dark:text-white dark:border-white dark:border-white/30">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-black dark:bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-black dark:bg-white"></span>
            </span>
            Let's Connect
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground mb-4">
            Get In Touch
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            Have a question or want to collaborate? I'm always open to new
            opportunities and interesting projects.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-stretch">
          <SocialConnectSection />
          <div className="bg-card rounded-md shadow-lg p-8 border border-border flex flex-col">
            <h3 className="text-2xl font-bold mb-2">Get In Touch</h3>
            <p className="text-muted-foreground mb-6">
              Have a question or want to work together? Send me a message!
            </p>
            <form className="space-y-4 flex-grow" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background min-h-[120px]"
                  placeholder="Your message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
            
            {/* Added new component below the form */}
            <ContactBenefits />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;