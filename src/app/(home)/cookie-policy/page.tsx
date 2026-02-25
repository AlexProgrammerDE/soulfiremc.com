import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "SoulFire Cookie Policy.",
};

export default function CookiePolicy() {
  return (
    <main className="px-4 py-12 w-full max-w-[1400px] mx-auto prose">
      <h1>Cookie Policy</h1>
      <p>
        <strong>Last updated:</strong> February 25, 2026
      </p>

      <p>
        This Cookie Policy explains how SoulFire (&quot;we,&quot; &quot;us,&quot;
        or &quot;our&quot;) uses cookies and similar tracking technologies on{" "}
        <a href="https://soulfiremc.com">soulfiremc.com</a>.
      </p>
      <p>
        This cookie policy is based on the{" "}
        <a
          href="https://www.cookieyes.com/blog/cookie-policy-template/"
          target="_blank"
          rel="noopener noreferrer"
        >
          CookieYes free cookie policy template
        </a>
        .
      </p>

      <h2>1. What Are Cookies?</h2>
      <p>
        Cookies are small text files stored on your device when you visit a
        website. They help websites function correctly, remember your
        preferences, and collect information about website usage.
      </p>
      <p>Cookies may be:</p>
      <ul>
        <li>
          <strong>First-party cookies</strong> &mdash; set by our website
          directly.
        </li>
        <li>
          <strong>Third-party cookies</strong> &mdash; set by external service
          providers embedded on our site.
        </li>
        <li>
          <strong>Session cookies</strong> &mdash; expire when you close your
          browser.
        </li>
        <li>
          <strong>Persistent cookies</strong> &mdash; remain on your device for
          a defined period.
        </li>
      </ul>

      <h2>2. Why Do We Use Cookies?</h2>
      <p>We use cookies for the following purposes:</p>
      <ul>
        <li>
          <strong>Authentication and session management</strong> &mdash; to keep
          you signed in and manage your session securely.
        </li>
        <li>
          <strong>Security</strong> &mdash; to protect against fraud and
          unauthorized access (e.g., CAPTCHA verification, CSRF protection).
        </li>
        <li>
          <strong>Analytics</strong> &mdash; to understand how visitors use our
          website and improve the user experience (with your consent).
        </li>
        <li>
          <strong>SEO monitoring</strong> &mdash; to monitor website performance
          and search engine visibility.
        </li>
        <li>
          <strong>Preferences</strong> &mdash; to remember your cookie consent
          choice and other preferences stored in your browser.
        </li>
      </ul>

      <h2>3. Cookie Categories</h2>

      <h3>Strictly Necessary Cookies</h3>
      <p>
        These cookies are essential for the website to function and cannot be
        switched off. They are set in response to actions you take, such as
        signing in or filling in forms.
      </p>
      <table>
        <thead>
          <tr>
            <th>Cookie / Storage</th>
            <th>Provider</th>
            <th>Purpose</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>better-auth.session_token</code>
            </td>
            <td>SoulFire (better-auth)</td>
            <td>
              Maintains your authenticated session after signing in
            </td>
            <td>Session / up to 7 days</td>
          </tr>
          <tr>
            <td>
              <code>discord_oauth_state</code>
            </td>
            <td>SoulFire</td>
            <td>
              CSRF protection during Discord OAuth linked roles flow
            </td>
            <td>Short-lived (minutes)</td>
          </tr>
          <tr>
            <td>
              <code>cf_clearance</code> / Turnstile cookies
            </td>
            <td>Cloudflare</td>
            <td>
              CAPTCHA verification to protect authentication forms from bots
            </td>
            <td>Session / up to 30 minutes</td>
          </tr>
        </tbody>
      </table>

      <h3>Analytics Cookies (Consent Required)</h3>
      <p>
        These cookies help us understand how visitors interact with our website
        by collecting and reporting information. They are only set{" "}
        <strong>after you accept analytics cookies</strong> via our cookie
        consent banner.
      </p>
      <table>
        <thead>
          <tr>
            <th>Cookie / Storage</th>
            <th>Provider</th>
            <th>Purpose</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>ph_*</code> cookies
            </td>
            <td>
              <a
                href="https://posthog.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                PostHog
              </a>{" "}
              (EU-hosted)
            </td>
            <td>
              Product analytics &mdash; tracks page views, feature usage, and
              user interactions. Data is hosted in the EU (
              <code>eu.i.posthog.com</code>).
            </td>
            <td>Persistent (up to 1 year)</td>
          </tr>
        </tbody>
      </table>

      <h3>Performance / SEO Cookies</h3>
      <p>
        These cookies are used for website performance monitoring and SEO
        analysis.
      </p>
      <table>
        <thead>
          <tr>
            <th>Cookie / Storage</th>
            <th>Provider</th>
            <th>Purpose</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Ahrefs analytics cookies</td>
            <td>
              <a
                href="https://ahrefs.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ahrefs
              </a>
            </td>
            <td>
              SEO analytics and website performance monitoring
            </td>
            <td>Session / persistent</td>
          </tr>
        </tbody>
      </table>

      <h3>Third-Party Cookies</h3>
      <p>
        The following third-party services embedded on our website may set their
        own cookies:
      </p>
      <table>
        <thead>
          <tr>
            <th>Service</th>
            <th>Purpose</th>
            <th>More Info</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>YouTube</td>
            <td>
              Embedded demo video on the homepage. YouTube may set cookies and
              collect viewing data.
            </td>
            <td>
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Privacy Policy
              </a>
            </td>
          </tr>
          <tr>
            <td>Gravatar</td>
            <td>
              Avatar images loaded from Gravatar. Requests include an MD5 hash
              of the user&apos;s email.
            </td>
            <td>
              <a
                href="https://automattic.com/privacy/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Automattic Privacy Policy
              </a>
            </td>
          </tr>
        </tbody>
      </table>

      <h3>Local Storage</h3>
      <p>
        In addition to cookies, we use browser local storage for the following:
      </p>
      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Purpose</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>docs-feedback-&#123;url&#125;</code>
            </td>
            <td>
              Remembers whether you&apos;ve already submitted feedback on a
              documentation page
            </td>
            <td>Persistent (until cleared)</td>
          </tr>
        </tbody>
      </table>

      <h2>4. How to Manage Cookies</h2>
      <h3>Cookie Consent Banner</h3>
      <p>
        When you first visit our website, a cookie consent banner will appear
        allowing you to accept or decline analytics cookies. You can change your
        preference at any time by clearing your browser cookies and revisiting
        the site.
      </p>

      <h3>Browser Settings</h3>
      <p>
        Most web browsers allow you to control cookies through their settings.
        You can typically:
      </p>
      <ul>
        <li>View what cookies are stored on your device</li>
        <li>Delete individual or all cookies</li>
        <li>Block third-party cookies</li>
        <li>Block all cookies from specific sites</li>
        <li>Block all cookies entirely</li>
      </ul>
      <p>
        Please note that blocking strictly necessary cookies may prevent you from
        signing in or using core features of the website.
      </p>
      <p>
        For instructions on managing cookies in your browser, visit your
        browser&apos;s help documentation:
      </p>
      <ul>
        <li>
          <a
            href="https://support.google.com/chrome/answer/95647"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Chrome
          </a>
        </li>
        <li>
          <a
            href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mozilla Firefox
          </a>
        </li>
        <li>
          <a
            href="https://support.apple.com/en-us/105082"
            target="_blank"
            rel="noopener noreferrer"
          >
            Safari
          </a>
        </li>
        <li>
          <a
            href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
            target="_blank"
            rel="noopener noreferrer"
          >
            Microsoft Edge
          </a>
        </li>
      </ul>

      <h2>5. Updates to This Cookie Policy</h2>
      <p>
        We may update this Cookie Policy from time to time to reflect changes in
        the cookies we use or for other operational, legal, or regulatory
        reasons. The &quot;Last updated&quot; date at the top of this page
        indicates when it was last revised.
      </p>

      <h2>6. Contact Us</h2>
      <p>
        If you have questions about our use of cookies, please contact us at:
      </p>
      <ul>
        <li>
          <strong>Email:</strong>{" "}
          <a href="mailto:support@soulfiremc.com">
            support@soulfiremc.com
          </a>
        </li>
        <li>
          <strong>GitHub:</strong>{" "}
          <a
            href="https://github.com/AlexProgrammerDE/SoulFire"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/AlexProgrammerDE/SoulFire
          </a>
        </li>
      </ul>

      <h2>7. More Information</h2>
      <p>
        For more details on how we handle your personal data, please see our{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>.
      </p>
    </main>
  );
}
