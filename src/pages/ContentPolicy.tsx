import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ContentPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full overflow-y-auto bg-background text-foreground">
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-3xl mx-auto flex items-center gap-3 px-4 py-4">
          <button onClick={() => (window.appBack ? window.appBack() : window.history.back())} className="p-1.5 rounded-full hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Content Policy</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <p className="text-xs text-muted-foreground">Last updated on: 14-04-2026</p>

        <p className="text-sm leading-relaxed text-muted-foreground">
          This Content Policy applies to all text, images, reviews, and other materials (collectively referred to as "Content") posted, uploaded, or shared on keshzo.store and the Keshzo mobile application. By using the Platform, you agree to abide by the guidelines set forth in this policy. <strong className="text-foreground">Keshzo</strong> (operated by Mahmad Iqbal Badami) reserves the right to remove any content that violates these standards.
        </p>

        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-base font-semibold">1. User-Generated Content (Reviews & Ratings)</h2>
            <p className="text-sm text-muted-foreground">Reviews are vital to the Keshzo community. To ensure they remain helpful and authentic, all user reviews must:</p>
            <ul className="space-y-3">
              {[
                "Be Truthful: Reviews must be based on a genuine, first-hand experience at the specific Salon Partner's location.",
                "Be Relevant: Content should focus on the service quality, staff behavior, hygiene, and overall experience.",
                "Be Respectful: Content must not contain profanity, slurs, threats, or harassment of any kind.",
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">2. Salon Partner Content</h2>
            <p className="text-sm text-muted-foreground">Partners listing their business on Keshzo are responsible for the accuracy of their listings.</p>
            <ul className="space-y-3">
              {[
                "Media Standards: Images of the salon or hairstyles must be high-quality and must represent the actual work performed at the location. Using \"stock photos\" or images stolen from other stylists is strictly prohibited.",
                "Service Descriptions: Descriptions of services and prices must be transparent and not misleading.",
                "Ownership: Partners must ensure they have the legal right to use any branding or logos uploaded to their profile.",
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">3. Prohibited Content</h2>
            <p className="text-sm text-muted-foreground">You are strictly prohibited from posting any content that:</p>
            <ul className="space-y-3">
              {[
                "Is Illegal: Violates the Information Technology Act, 2000, or any other applicable Indian laws.",
                "Infringes Rights: Violates intellectual property rights, including copyrights, trademarks, or privacy rights of any third party.",
                "Is Harmful: Contains viruses, malware, or any other malicious code designed to interrupt the Platform's functionality.",
                "Is Promotional: Includes \"spam,\" unauthorized advertisements, or links to competing services.",
                "Is Sensitive: Contains adult content, violence, or racially/religiously offensive material.",
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">4. Our Right to Moderate</h2>
            <p className="text-sm text-muted-foreground">Keshzo acts as a neutral platform for salon discovery. However, to maintain safety and quality, we reserve the right (but not the obligation) to:</p>
            <ul className="space-y-3">
              {[
                "Monitor and review any content posted on the Platform.",
                "Edit or remove content that we deem, in our sole discretion, to be in violation of this policy or harmful to the reputation of the Platform.",
                "Suspend or terminate the accounts of users or partners who repeatedly violate these guidelines.",
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">5. Reporting Violations</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              If you encounter any content on keshzo.store that you believe violates this policy or is otherwise inappropriate, please report it to us immediately at{" "}
              <a href="mailto:keshzo.ops@gmail.com" className="text-primary hover:underline">keshzo.ops@gmail.com</a>{" "}
              with the subject line: "Content Policy Violation Report".
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">6. Intellectual Property of Keshzo</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              All digital assets, including the "Keshzo" brand name, logo, website design, and proprietary software, belong exclusively to Mahmad Iqbal Badami. No user is permitted to scrape, copy, or redistribute Keshzo's proprietary content without express written consent.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ContentPolicy;
