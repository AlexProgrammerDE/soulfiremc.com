export default function Privacy() {
  return (
    <article
      className="w-full overflow-x-hidden break-words nextra-content flex min-h-[calc(100vh-var(--nextra-navbar-height))] min-w-0 justify-center pb-8 pr-[calc(env(safe-area-inset-right)-1.5rem)]">
      <main className="w-full min-w-0 max-w-6xl px-6 pt-4 md:px-12">
        <div className="prose dark:prose-invert mx-auto container">
          <h1>Privacy Policy</h1>
          <p>Last updated: April 26, 2025</p>

          <h2>1. Introduction</h2>
          <p>
            Welcome to SoulFire. This Privacy Policy explains how we collect, use, and safeguard your
            information when you use our application, whether you self host it on your local device or
            connect to a remote server.
          </p>

          <h2>2. Data We Collect</h2>
          <h3>2.1 Analytics Data</h3>
          <p>
            On startup, SoulFire integrates with our self‑hosted Aptabase instance to collect analytics,
            including but not limited to:
          </p>
          <ul>
            <li>Application version and build information</li>
            <li>Operating system version and environment details</li>
            <li>Device or server identifier (anonymized UUID)</li>
            <li>Startup timestamp and session duration</li>
            <li>Feature usage statistics</li>
            <li>Country of origin (anonymized)</li>
          </ul>
          <p>
            No personally identifiable information (PII) such as name, email address, IP address, or
            precise location is collected.
          </p>

          <h2>3. Use of Collected Data</h2>
          <p>
            We use the analytics data solely to:
          </p>
          <ul>
            <li>Monitor application performance and stability</li>
            <li>Identify and fix bugs and issues</li>
            <li>Understand usage patterns to improve features</li>
          </ul>

          <h2>4. Data Processing &amp; Storage</h2>
          <p>
            All analytics data is transmitted securely via HTTPS to our self‑hosted Aptabase instance and stored
            in our internal infrastructure. No data is shared with any external party. Data retention is managed
            internally.
          </p>

          <h2>5. Hosting Options</h2>
          <p>
            <strong>Local Hosting:</strong> If you host SoulFire on your local device, data is stored locally on your
            device, only analytics are
            sent to our self‑hosted Aptabase instance. No data is shared with any external party.
          </p>
          <p>
            <strong>Remote Hosting:</strong> If SoulFire is hosted on a remote server, the same analytics
            processes apply. However the user data is stored on the remote server. We do not have access to
            this data, and it is managed by the server administrator. We recommend reviewing the privacy policy
            of the remote server provider to understand their data handling practices.
          </p>

          <h2>6. Third‑Party Services</h2>
          <p>
            We rely on a self‑hosted instance of Aptabase for analytics and performance monitoring. Since we
            manage the service internally, no data is shared with any external third‑party.
          </p>

          <h2>7. Data Security</h2>
          <p>
            We take reasonable administrative, technical, and physical safeguards to protect the analytics
            data collected. However, no transmission or storage method is 100% secure.
          </p>

          <h2>8. Your Rights</h2>
          <p>
            Depending on your jurisdiction, you may have the right to:
          </p>
          <ul>
            <li>Access and obtain a copy of your data</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
          </ul>
          <p>
            To exercise these rights, contact us at <a href="mailto:privacy@soulfiremc.com">privacy@soulfiremc.com</a>.
          </p>

          <h2>9. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The latest version of the Privacy Policy will
            always be available within the application.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            If you have any questions or concerns regarding this Privacy Policy, please contact us at:
          </p>
          <p>
            <strong>Email:</strong> <a href="mailto:privacy@soulfiremc.com">privacy@soulfiremc.com</a>
          </p>

          <h2>11. Avatar Service</h2>
          <p>
            To display user avatars, SoulFire integrates with Gravatar. When a user provides their email address, the
            associated Gravatar image is retrieved using the Gravatar service. No additional avatar-related data is collected
            apart from what is necessary to fetch and render the corresponding image.
          </p>
        </div>
      </main>
    </article>
  )
}
