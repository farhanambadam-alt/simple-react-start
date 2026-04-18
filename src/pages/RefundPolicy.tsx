import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RefundPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full overflow-y-auto bg-background text-foreground">
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-3xl mx-auto flex items-center gap-3 px-4 py-4">
          <button onClick={() => (window.appBack ? window.appBack() : window.history.back())} className="p-1.5 rounded-full hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Cancellation & Refund Policy</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <p className="text-xs text-muted-foreground">Last updated on: 14-04-2026</p>

        <p className="text-sm leading-relaxed text-muted-foreground">
          At <strong className="text-foreground">Keshzo</strong> (operated by <strong className="text-foreground">Mahmad Iqbal Badami</strong>), we aim to provide a fair and transparent booking experience for both our Customers and our Salon Partners. This policy outlines the terms for cancellations and refunds for appointments booked via keshzo.store.
        </p>

        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-base font-semibold">1. Cancellation by the Customer</h2>
            <p className="text-sm text-muted-foreground">We understand that plans can change. To be fair to our Salon Partners who block their time for you, the following terms apply:</p>
            <ul className="space-y-3">
              {[
                "Cancellation more than 24 hours before the appointment: You are eligible for a Full Refund of the service amount paid (minus any nominal non-refundable convenience or transaction fees, if applicable).",
                "Cancellation within 24 hours of the appointment: A cancellation fee of 35% of the booking value may be deducted. The remaining balance will be refunded to your original payment method.",
                "No-Show: If you do not show up for your appointment without prior cancellation, the booking will be treated as \"Fulfilled,\" and no refund will be issued.",
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">2. Cancellation by the Salon Partner</h2>
            <p className="text-sm text-muted-foreground">In the rare event that a Salon Partner is unable to honor your appointment due to unforeseen circumstances (staff unavailability, technical issues, or power failure):</p>
            <ul className="space-y-3">
              {[
                "You will be notified immediately via the Platform.",
                "A 100% Refund will be issued to you automatically, including any convenience fees.",
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">3. Refund Process and Timelines</h2>
            <ul className="space-y-3">
              {[
                "Approval: Once a refund is initiated (either via cancellation or system error), it is processed immediately by the Keshzo platform.",
                "Refund Method: All refunds will be credited back only to the original mode of payment (Bank Account, UPI, or Credit/Debit Card) used during the booking. We do not offer cash refunds.",
                "Timeline: While we initiate the refund immediately, the actual credit to your account typically takes 3 to 5 business days, depending on your bank and our payment partner, Cashfree.",
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">4. Dispute Resolution</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              If you are unhappy with the service provided by the Salon Partner (e.g., quality of haircut or hygiene), we encourage you to resolve the matter with the salon directly at the time of service. However, you may also report the issue to{" "}
              <a href="mailto:keshzo.ops@gmail.com" className="text-primary hover:underline">keshzo.ops@gmail.com</a>{" "}
              within 24 hours of the appointment, and our team will investigate the matter.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">5. Modifications</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Keshzo reserves the right to modify this Cancellation and Refund Policy at any time. Any changes will be updated on this page and will apply to all bookings made after the "Last Updated" date.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">6. Contact Us</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              For any queries related to cancellations or refunds, please reach out to:
            </p>
            <ul className="space-y-2">
              <li className="flex gap-3 text-sm text-muted-foreground">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>Customer Support Email: <a href="mailto:keshzo.ops@gmail.com" className="text-primary hover:underline">keshzo.ops@gmail.com</a></span>
              </li>
              <li className="flex gap-3 text-sm text-muted-foreground">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>Business Address: Navanagar, Hubli, Dharwad Road, Hubballi, Karnataka - 580025.</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
