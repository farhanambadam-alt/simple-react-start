import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full overflow-y-auto bg-background text-foreground">
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-3xl mx-auto flex items-center gap-3 px-4 py-4">
          <button onClick={() => (window.appBack ? window.appBack() : window.history.back())} className="p-1.5 rounded-full hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Privacy Policy</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <p className="text-xs text-muted-foreground">Last updated on: 14-04-2026</p>

        <p className="text-sm leading-relaxed text-muted-foreground">
          Keshzo (referred to as "the Platform," "we," "us," or "our") is committed to protecting the privacy of its users. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <strong className="text-foreground">keshzo.store</strong> and our mobile application.
        </p>

        <p className="text-sm leading-relaxed text-muted-foreground">
          The Platform is owned and operated by <strong className="text-foreground">Mahmad Iqbal Badami</strong> (Trade Name: KESHZO), located at Navanagar, Hubli, Dharwad Road, Hubballi, Karnataka - 580025.
        </p>

        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-base font-semibold">1. Collection of Your Information</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              We may collect information about you in a variety of ways. The information we may collect on the Platform includes:
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-foreground">Personal Data</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Platform or when you choose to participate in various activities related to the Platform, such as online chat and message boards.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-foreground">Derivative Data</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Information our servers automatically collect when you access the Platform, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Platform.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-foreground">Financial Data</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the Platform. Please note: We store only very limited, if any, financial information that we collect. Otherwise, all financial information is stored by our payment processor, <strong className="text-foreground">Cashfree</strong>, and you are encouraged to review their privacy policy.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">2. Use of Your Information</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Platform to:
            </p>
            <ul className="space-y-2">
              {[
                "Create and manage your account.",
                "Process your appointments and payments.",
                "Email or SMS you regarding your account or booking.",
                "Fulfill and manage bookings, payments, and other transactions related to the Platform.",
                "Generate a personal profile about you to make future visits to the Platform more personalized.",
                "Increase the efficiency and operation of the Platform.",
                "Monitor and analyze usage and trends to improve your experience with the Platform."
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">3. Disclosure of Your Information</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-foreground">By Law or to Protect Rights</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-foreground">Third-Party Service Providers</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  We may share your information with third parties that perform services for us or on our behalf, including payment processing (Cashfree/PhonePe), data analysis, email delivery, hosting services, and customer service.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-foreground">Salon Partners</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  When you book an appointment, your name, contact number, and service requirements are shared with the specific Salon Partner you have chosen to ensure the fulfillment of your service.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">4. Security of Your Information</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">5. Policy for Children</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              We do not knowingly solicit information from or market to children under the age of 18. If you become aware of any data we have collected from children under age 18, please contact us using the contact information provided below.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">6. Your Rights</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              You may at any time review or change the information in your account or terminate your account by:
            </p>
            <ul className="space-y-2">
              <li className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>Logging into your account settings and updating your account.</span>
              </li>
              <li className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>Contacting us using the contact information provided below.</span>
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">7. Contact Us</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              If you have questions or comments about this Privacy Policy, please contact us at:
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                <strong className="text-foreground">KESHZO</strong><br />
                Attn: Mahmad Iqbal Badami<br />
                Navanagar, Hubli, Dharwad Road,<br />
                Hubballi, Karnataka - 580025.
              </p>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Email:</strong>{" "}
                <a href="mailto:keshzo.ops@gmail.com" className="text-primary underline">keshzo.ops@gmail.com</a>
              </p>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Website:</strong>{" "}
                <a href="https://keshzo.store" target="_blank" rel="noopener noreferrer" className="text-primary underline">https://keshzo.store</a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
