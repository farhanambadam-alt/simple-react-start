import { ArrowLeft, Search, Clock, Star, LayoutDashboard, Lightbulb, Eye, Heart, Globe, Mail, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full overflow-y-auto bg-background text-foreground">
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-3xl mx-auto flex items-center gap-3 px-4 py-4">
          <button onClick={() => (window.appBack ? window.appBack() : window.history.back())} className="p-1.5 rounded-full hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">About Us</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Hero */}
        <div className="space-y-2">
          <p className="text-xs font-medium tracking-widest uppercase text-primary">Redefining the Salon Experience</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Founded in 2026, <strong className="text-foreground">Keshzo</strong> is an innovative digital platform dedicated to transforming how India experiences grooming. Based in the vibrant city of Hubballi, Karnataka, we serve as the bridge between style-conscious customers and the finest local grooming talent.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Operating under the legal entity <strong className="text-foreground">KESHZO</strong> (Proprietor: Mahmad Iqbal Badami), our mission is to bring professional management tools to every barbershop and salon, while providing users with a seamless, "no-wait" booking experience via{" "}
            <a href="https://keshzo.store" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">keshzo.store</a>.
          </p>
        </div>

        {/* Mission */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold">Our Mission</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">At Keshzo, we believe that your time is your most valuable asset. Our mission is two-fold:</p>
          <ul className="space-y-3">
            <li className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <span><strong className="text-foreground">For Customers:</strong> To provide a transparent, easy-to-use platform where you can discover top-rated salons, view real-time stylist availability, and book appointments that fit your schedule perfectly.</span>
            </li>
            <li className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <span><strong className="text-foreground">For Partners:</strong> To empower local salon owners and independent barbers with a specialized SaaS tool. We provide the digital infrastructure needed to manage queues, track appointments, and grow their business in a digital-first economy.</span>
            </li>
          </ul>
        </section>

        {/* Vision */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold">Our Vision</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            We envision a future where traditional "waiting lines" are obsolete. By digitizing the local salon ecosystem, Keshzo aims to set a new standard for hygiene, punctuality, and professionalism in the personal care industry across India.
          </p>
        </section>

        {/* What We Offer */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold">What We Offer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: Search, title: "Discovery", desc: "A curated list of the best barbershops and salons in your immediate vicinity." },
              { icon: Clock, title: "Smart Scheduling", desc: "Real-time slot booking that eliminates long wait times." },
              { icon: Star, title: "Verified Reviews", desc: "Authentic feedback from our community to help you choose the right stylist." },
              { icon: LayoutDashboard, title: "Partner Management Suite", desc: "A dedicated dashboard for salon owners to streamline daily operations." },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg border border-border/50 bg-card/50">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Core Values */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold">Core Values</h2>
          <div className="space-y-3">
            {[
              { icon: Lightbulb, title: "Innovation", desc: "We leverage technology to solve real-world scheduling problems." },
              { icon: Eye, title: "Transparency", desc: "Clear pricing and honest reviews are the backbone of our community." },
              { icon: Heart, title: "Empowerment", desc: "Supporting local \"Micro\" enterprises to compete and thrive in the modern market." },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Connect */}
        <section className="space-y-3 pb-4">
          <h2 className="text-base font-semibold">Connect With Us</h2>
          <p className="text-sm text-muted-foreground">We are constantly evolving to serve you better.</p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex gap-2 items-center">
              <Globe className="w-4 h-4 text-primary shrink-0" />
              <a href="https://keshzo.store" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">keshzo.store</a>
            </div>
            <div className="flex gap-2 items-center">
              <Mail className="w-4 h-4 text-primary shrink-0" />
              <a href="mailto:keshzo.ops@gmail.com" className="text-primary hover:underline">keshzo.ops@gmail.com</a>
            </div>
            <div className="flex gap-2 items-start">
              <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>Navanagar, Hubli, Dharwad Road, Hubballi, Karnataka - 580025.</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
