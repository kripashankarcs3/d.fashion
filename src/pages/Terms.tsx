import { Link } from 'wouter';
import ContentPage, { ProseSection } from '@/components/editorial/ContentPage';
import { ROUTES } from '@/config/navigation';

export default function Terms() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Terms of Service"
      lede="The short version: this is a colour-analysis service, not a medical or dermatological one."
    >
      <ProseSection label="1" title="The service">
        <p>
          D&rsquo;Fashion provides personalised colour analysis, style
          recommendations, and related tools. Analysis results are generated
          from your photos by AI models and are provided as guidance only.
        </p>
        <p>
          Colour analysis is not a medical or dermatological assessment. If you
          are concerned about your skin, speak to a qualified professional.
        </p>
      </ProseSection>

      <ProseSection label="2" title="Your account">
        <p>
          You are responsible for the accuracy of the information you provide
          and for keeping your login credentials safe. One person may not use
          multiple free accounts to bypass payment terms.
        </p>
      </ProseSection>

      <ProseSection label="3" title="Photos you upload">
        <p>
          You confirm that any photo you upload is of you, or that you have the
          right to use it. You keep ownership of your photos; you grant us the
          limited right to process them so we can provide the service, as
          described in our{' '}
          <Link href={ROUTES.privacy} className="underline underline-offset-2 hover:text-gold-primary">
            privacy policy
          </Link>
          .
        </p>
      </ProseSection>

      <ProseSection label="4" title="Payments">
        <p>
          Paid plans are billed as described at checkout. Prices are shown in
          Indian Rupees (₹) and may be adjusted over time; changes only apply
          to future charges.
        </p>
      </ProseSection>

      <ProseSection id="refunds" label="5" title="Refunds">
        <p>
          If a one-time purchase fails to deliver an analysis, we will refund
          it in full. Subscriptions can be cancelled any time before the next
          billing cycle. Contact us via the{' '}
          <Link href={ROUTES.contact} className="underline underline-offset-2 hover:text-gold-primary">
            contact page
          </Link>{' '}
          for help.
        </p>
      </ProseSection>

      <ProseSection label="6" title="Acceptable use">
        <p>
          Do not use the service to analyse someone else without consent, to
          store photos beyond the stated retention window, or to attempt to
          disrupt the service. We may suspend accounts that violate these
          terms.
        </p>
      </ProseSection>

      <ProseSection label="7" title="Limitation of liability">
        <p>
          The service is provided &ldquo;as is&rdquo;. To the maximum extent
          permitted by law, D&rsquo;Fashion is not liable for indirect or
          consequential loss arising from your use of the service.
        </p>
      </ProseSection>
    </ContentPage>
  );
}
