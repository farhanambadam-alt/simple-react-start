import { ArrowLeft, MapPin, Phone, Mail, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

const ContactUs = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full overflow-y-auto bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-3xl mx-auto flex items-center gap-3 px-4 py-4">
          <button onClick={() => (window.appBack ? window.appBack() : window.history.back())} className="p-1.5 rounded-full hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Contact Us</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Intro Text */}
        <p className="text-sm leading-relaxed text-muted-foreground">
          We are here to help with your booking and platform inquiries.
        </p>

        {/* Brand & Legal Entity Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Brand Name:</span>
            <span className="text-sm text-muted-foreground">Keshzo</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Proprietor:</span>
            <span className="text-sm text-muted-foreground">Mahmad Iqbal Badami</span>
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center text-center p-5 gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Registered & Operational Address</p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                  Navanagar, Hubli, Dharwad Road,<br />
                  Hubballi, Karnataka - 580025,<br />
                  India
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center text-center p-5 gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Support Contact</p>
                <a href="tel:+919845308821" className="text-sm font-medium text-primary hover:underline mt-1 block">
                  +91 9845308821
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm sm:col-span-2">
            <CardContent className="flex flex-col items-center text-center p-5 gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Email Support</p>
                <a href="mailto:keshzo.ops@gmail.com" className="text-sm font-medium text-primary hover:underline mt-1 block">
                  keshzo.ops@gmail.com
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h2 className="text-base font-semibold mb-1">Send us a message</h2>
            <p className="text-xs text-muted-foreground mb-5">We'll get back to you as soon as possible.</p>

            <form
              action="https://formsubmit.co/1a364c17f1244f9607d33e22565d6bf7"
              method="POST"
              className="space-y-4"
            >
              {/* FormSubmit config */}
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_subject" value="New Contact Form Submission - Keshzo" />
              <input type="text" name="_honey" style={{ display: "none" }} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-medium text-muted-foreground">Full Name</label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    required
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-medium text-muted-foreground">Email Address</label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                    className="bg-background/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-xs font-medium text-muted-foreground">Phone Number</label>
                <Input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="Your phone number"
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-xs font-medium text-muted-foreground">Message</label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="How can we help you?"
                  rows={5}
                  required
                  className="bg-background/50 resize-none"
                />
              </div>

              <Button type="submit" className="w-full gap-2">
                <Send className="w-4 h-4" />
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactUs;
