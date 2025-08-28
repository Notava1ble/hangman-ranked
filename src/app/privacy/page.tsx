import Link from "next/link";

const Page = () => {
  return (
    <div className="w-full h-full bg-background dark py-32">
      <main className="mx-auto prose prose-lg prose-invert max-w-3/5">
        <h2>Introduction</h2>
        <p>
          This Privacy Policy describes how Hangman-Ranked (&quot;we&quot;,
          &quot;us&quot;, &quot;our&quot;) collects, uses, shares, and
          safeguards your information.
        </p>

        <h2>Overview</h2>
        <p>
          This Privacy Policy applies to our website, applications, products,
          and services that link to this policy or otherwise refer you to this
          policy (collectively, our &quot;Services&quot;).
        </p>

        <h2>Information Collection and Use</h2>

        <h3>Personal Data</h3>
        <p>
          When you use our Services, we may collect Personal Data, which refers
          to any information that identifies you personally. This includes, but
          is not limited to:
        </p>
        <ul>
          <li>Contact information such as your name and email address.</li>
        </ul>

        <h3>Non-Personal Data</h3>
        <p>
          We may also collect non-personal data, which is data that cannot be
          directly linked to an individual. This includes browser and device
          information, application usage data, and anonymous demographic
          information.
        </p>

        <h3>Use of Information</h3>
        <ul>
          <li>Providing, maintaining, and improving our Services.</li>
          <li>Responding to user inquiries and providing customer support.</li>
        </ul>

        <h2>Information Sharing</h2>
        <p>
          We may share your personal information with third parties under the
          following circumstances:
        </p>
        <ul>
          <li>With your consent.</li>
          <li>
            With third-party vendors and other service providers that perform
            services on our behalf.
          </li>
          <li>
            If we believe disclosure is necessary to comply with relevant laws,
            to respond to legal requests, or to protect our rights, property, or
            safety.
          </li>
        </ul>

        <h2>Cookies and Tracking Technologies</h2>
        <p>
          We do not use cookies to collect information, except for
          authentication purposes. We only use analytics to collect anonymous
          demographic information, such as user counts and general geographic
          location by country.
        </p>

        <h2>Security</h2>
        <p>
          We employ reasonable physical, technical, and administrative measures
          designed to safeguard the information we collect. However, no security
          measure is 100% secure, and we cannot guarantee the absolute security
          of your information.
        </p>

        <h2>International Data Transfers</h2>
        <p>
          Personal information that you submit through the Services may be
          transferred to countries outside your own, such as servers in the U.S.
          or the EU, depending on our hosting providers. We do not control the
          location of servers, and your personal information may be subject to
          privacy laws that differ from those in your country.
        </p>

        <h2>Your Rights and Choices</h2>
        <p>
          Depending on your location, you may have certain rights regarding your
          personal information. These rights can include accessing your data,
          modifying it, and requesting deletion.
        </p>

        <h2>Children&apos;s Privacy</h2>
        <p>
          Our Services are not directed to individuals under 13. We do not
          knowingly collect personal information from children under 13. If we
          become aware that a child under 13 has provided us with personal
          information, we will take steps to delete such information.
        </p>

        <h2>GDPR Notice</h2>

        <h3>Legal Basis for Processing Personal Data</h3>
        <ul>
          <li>You have consented to the use of your personal information.</li>
          <li>
            We need your personal information to provide services or respond to
            inquiries.
          </li>
          <li>We have a legal obligation to use your personal information.</li>
          <li>
            We have a legitimate interest in using your personal information.
          </li>
        </ul>

        <h3>Transfers of Personal Data</h3>
        <p>
          Your personal data may be stored and processed in your region, or
          transferred and processed outside the EEA, including countries such as
          the United States.
        </p>

        <h3>Data Subject Rights</h3>
        <ul>
          <li>
            Right to Access, Rectification, Erasure, Restrict Processing, Data
            Portability, Object, and Withdraw Consent.
          </li>
        </ul>

        <h3>Exercising Your GDPR Data Protection Rights</h3>
        <p>
          You may exercise any of your rights by contacting us at{" "}
          <Link href="mailto:visarmullaj07@gmail.com">
            visarmullaj07@gmail.com
          </Link>{" "}
          or by using features in our Services where available.
        </p>

        <h2>CCPA Notice</h2>
        <p>
          We do not sell your personal information, but you may have rights
          under the CCPA to know, delete, or limit the use of your information.
        </p>

        <h3>Exercising Your CCPA Data Protection Rights</h3>
        <p>
          To exercise any rights, you may contact us at{" "}
          <Link href="mailto:visarmullaj07@gmail.com">
            visarmullaj07@gmail.com
          </Link>{" "}
          or visit our website:{" "}
          <Link href="https://hangman-ranked.vercel.app/">
            https://hangman-ranked.vercel.app/
          </Link>
          .
        </p>

        <h2>Changes to this Privacy Policy</h2>
        <p>
          We reserve the right to modify this Privacy Policy at any time. Your
          continued use of our Services constitutes acceptance of any changes.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions, please contact us at{" "}
          <Link href="mailto:visarmullaj07@gmail.com">
            visarmullaj07@gmail.com
          </Link>
          .
        </p>

        <p className="text-sm text-gray-500">Last updated: 8/28/2025</p>
      </main>
    </div>
  );
};

export default Page;
