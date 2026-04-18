import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full overflow-y-auto bg-background text-foreground">
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-3xl mx-auto flex items-center gap-3 px-4 py-4">
          <button onClick={() => (window.appBack ? window.appBack() : window.history.back())} className="p-1.5 rounded-full hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Terms & Conditions</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <p className="text-xs text-muted-foreground">Last updated on: 14-04-2026</p>

        <p className="text-sm leading-relaxed text-muted-foreground">
          Welcome to Keshzo (available at keshzo.store). This document is an electronic record in terms of the Information Technology Act, 2000 and rules there under as applicable and the amended provisions pertaining to electronic records in various statutes as amended by the Information Technology Act, 2000.
        </p>

        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-base font-semibold">1. Identity of the Entity</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The platform keshzo.store (including the website and mobile applications, collectively referred to as the "Platform") is owned and operated by <strong className="text-foreground">Mahmad Iqbal Badami</strong>, an individual/sole proprietor operating under the registered trade name <strong className="text-foreground">KESHZO</strong>, with its principal place of business located at:
            </p>
            <p className="text-sm text-muted-foreground">
              Navanagar, Hubli, Dharwad Road, Hubballi, Karnataka - 580025, India.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">2. Description of Services</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Keshzo is a specialized management and appointment booking platform. We act as an intermediary marketplace that connects:
            </p>
            <ul className="space-y-2">
              <li className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span><strong className="text-foreground">Customers:</strong> Individuals seeking grooming and salon services.</span>
              </li>
              <li className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span><strong className="text-foreground">Partners:</strong> Local salons, beauty parlors, and barbershops listed on our Platform.</span>
              </li>
            </ul>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Keshzo provides the technology to browse salons, view services, and book appointments. Please note that Keshzo does not provide salon services directly; all grooming services are provided by independent third-party Partners.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">3. User Eligibility</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              By using this Platform, you represent that you are at least 18 years of age and are fully able and competent to enter into the terms, conditions, obligations, affirmations, representations, and warranties set forth in these Terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">4. Booking and Payment Terms</h2>
            <ul className="space-y-2">
              <li className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span><strong className="text-foreground">Appointment Confirmation:</strong> A booking is considered confirmed only when you receive a confirmation notification through the Platform.</span>
              </li>
              <li className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span><strong className="text-foreground">Pricing:</strong> The prices for services are determined by the Salon Partners. Keshzo reserves the right to charge a nominal convenience fee for the use of the Platform.</span>
              </li>
              <li className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span><strong className="text-foreground">Payments:</strong> All online payments are processed through secure third-party payment gateways (such as Cashfree). By using these services, you agree to abide by the terms of the payment processor.</span>
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">5. Cancellation and Rescheduling</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Users may cancel or reschedule appointments subject to the specific timeline mentioned in our <strong className="text-foreground">Cancellation & Refund Policy</strong>.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Keshzo reserves the right to cancel any booking due to technical errors, unavailability of the Partner, or fraudulent activity.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">6. Code of Conduct</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">Users agree NOT to:</p>
            <ul className="space-y-2">
              {[
                "Provide false information or impersonate any person.",
                "Post defamatory, obscene, or offensive content in the review sections.",
                "Use the Platform for any unauthorized commercial purposes.",
                "Attempt to bypass the Platform's booking system to contact Partners directly for the purpose of avoiding Platform fees."
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">7. Limitation of Liability</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Keshzo is an intermediary. We are not responsible for the quality, safety, or legality of the services provided by the Salon Partners.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Any disputes regarding the actual service (e.g., haircut quality, hygiene, behavior of staff) must be resolved directly between the Customer and the Salon Partner.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Keshzo shall not be liable for any indirect, incidental, or consequential damages arising out of your use of the Platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">8. Intellectual Property</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              All content on this Platform, including but not limited to the "Keshzo" brand name, logos, software code, UI design, and text, is the exclusive property of <strong className="text-foreground">Mahmad Iqbal Badami</strong>. Unauthorized use, reproduction, or distribution is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">9. Privacy</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Your use of the Platform is also governed by our <strong className="text-foreground">Privacy Policy</strong>. Please review it to understand our practices regarding your personal data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">10. Governing Law and Jurisdiction</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts in Hubballi/Dharwad, Karnataka.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">11. Contact Information</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              For any questions or grievances regarding these Terms, please contact us at:
            </p>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">
                <strong className="text-foreground">Email:</strong>{" "}
                <a href="mailto:keshzo.ops@gmail.com" className="text-primary underline">keshzo.ops@gmail.com</a>
              </li>
              <li className="text-sm text-muted-foreground">
                <strong className="text-foreground">Address:</strong> Navanagar, Hubli, Dharwad Road, Hubballi, Karnataka - 580025.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
