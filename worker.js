// ============================================================
// CONFIGURATION
// ============================================================
const RESEND_API_KEY = 're_SFiMeYut_ATjXQ1mwd5u8c9NnTGzGEcav';
const NOTIFY_EMAILS = ['bellringerproductions@gmail.com', 'joshua@markrampolla.co'];

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

// ============================================================
// HELPER: Send email notification via Resend
// ============================================================
async function sendNotificationEmail(subject, htmlBody) {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + RESEND_API_KEY
      },
      body: JSON.stringify({
        from: 'Freedom Launchpad <onboarding@resend.dev>',
        to: NOTIFY_EMAILS,
        subject: subject,
        html: htmlBody
      })
    });
    const result = await res.json();
    if (!res.ok) {
      console.error('Resend error:', JSON.stringify(result));
    }
    return result;
  } catch (e) {
    console.error('Resend send error:', e.message);
  }
}

// ============================================================
// EMAIL TEMPLATES
// ============================================================
function buildNewLeadEmail(email, name, source) {
  return `
    <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <div style="background: #1A2744; padding: 20px 24px; border-radius: 8px 8px 0 0;">
        <h2 style="color: #C9943E; margin: 0; font-size: 18px;">New Lead Captured</h2>
        <p style="color: rgba(255,255,255,0.7); margin: 4px 0 0; font-size: 13px;">Freedom Launchpad FCI Assessment</p>
      </div>
      <div style="background: #ffffff; border: 1px solid #E2E8F0; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #8896A6; font-size: 13px; width: 100px;">Name</td>
            <td style="padding: 8px 0; color: #1A2744; font-size: 14px; font-weight: 600;">${name || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #8896A6; font-size: 13px;">Email</td>
            <td style="padding: 8px 0; color: #1A2744; font-size: 14px; font-weight: 600;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #8896A6; font-size: 13px;">Source</td>
            <td style="padding: 8px 0; color: #1A2744; font-size: 14px;">${source}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #8896A6; font-size: 13px;">Time</td>
            <td style="padding: 8px 0; color: #1A2744; font-size: 14px;">${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET</td>
          </tr>
        </table>
        <div style="margin-top: 16px; padding: 12px; background: #F7F8FA; border-radius: 6px; font-size: 12px; color: #4A5568;">
          This person entered their email on the FCI assessment. They have NOT completed the quiz yet. Follow up to ensure completion.
        </div>
      </div>
    </div>`;
}

function buildFCICompletedEmail(data) {
  const urgency = data.fciScore < 40 ? 'HIGH' : data.fciScore < 70 ? 'MEDIUM' : 'STANDARD';
  const urgencyColor = urgency === 'HIGH' ? '#C94A3E' : urgency === 'MEDIUM' ? '#C9943E' : '#2D9C6F';
  const urgencyBg = urgency === 'HIGH' ? '#FDF2F2' : urgency === 'MEDIUM' ? '#FFF8EE' : '#F0FDF4';

  return `
    <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <div style="background: #1A2744; padding: 20px 24px; border-radius: 8px 8px 0 0;">
        <h2 style="color: #C9943E; margin: 0; font-size: 18px;">FCI Assessment Completed</h2>
        <p style="color: rgba(255,255,255,0.7); margin: 4px 0 0; font-size: 13px;">A founder just finished their Founder Coherence Index</p>
      </div>
      <div style="background: #ffffff; border: 1px solid #E2E8F0; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">

        <div style="background: ${urgencyBg}; border-left: 4px solid ${urgencyColor}; padding: 12px 16px; border-radius: 4px; margin-bottom: 20px;">
          <span style="font-size: 11px; font-weight: 700; color: ${urgencyColor}; text-transform: uppercase; letter-spacing: 1px;">${urgency} PRIORITY</span>
          <span style="font-size: 13px; color: #4A5568; margin-left: 8px;">FCI Score: <strong style="color: ${urgencyColor}; font-size: 18px;">${data.fciScore}/100</strong></span>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #8896A6; font-size: 13px; width: 140px;">Name</td>
            <td style="padding: 8px 0; color: #1A2744; font-size: 14px; font-weight: 600;">${data.name || 'Anonymous'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #8896A6; font-size: 13px;">Email</td>
            <td style="padding: 8px 0; color: #1A2744; font-size: 14px; font-weight: 600;"><a href="mailto:${data.email}" style="color: #1A2744;">${data.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #8896A6; font-size: 13px;">FCI Level</td>
            <td style="padding: 8px 0; color: ${urgencyColor}; font-size: 14px; font-weight: 600;">${data.fciLevel || '—'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #8896A6; font-size: 13px;">Freedom Score</td>
            <td style="padding: 8px 0; color: #1A2744; font-size: 14px;">${data.freedomScore || '—'}/50 (Internal OS)</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #8896A6; font-size: 13px;">Alignment Score</td>
            <td style="padding: 8px 0; color: #1A2744; font-size: 14px;">${data.alignmentScore || '—'}/50 (External OS)</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #8896A6; font-size: 13px;">Gap Pattern</td>
            <td style="padding: 8px 0; color: #1A2744; font-size: 14px; font-weight: 500;">${data.gapPattern || '—'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #8896A6; font-size: 13px;">Primary Bottleneck</td>
            <td style="padding: 8px 0; color: #C94A3E; font-size: 14px; font-weight: 600;">${data.primaryBottleneck || '—'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #8896A6; font-size: 13px;">Cross Patterns</td>
            <td style="padding: 8px 0; color: #1A2744; font-size: 14px;">${(data.crossPatterns && data.crossPatterns.length > 0) ? data.crossPatterns.join(', ') : 'None detected'}</td>
          </tr>
        </table>

        ${data.dimensions ? `
        <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #E2E8F0;">
          <h3 style="font-size: 13px; color: #8896A6; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Dimension Scores</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            ${Object.entries(data.dimensions).map(([name, score]) => `
            <tr>
              <td style="padding: 4px 0; color: #4A5568;">${name}</td>
              <td style="padding: 4px 0; color: #1A2744; font-weight: 500; text-align: right;">${score}/10</td>
            </tr>`).join('')}
          </table>
        </div>` : ''}

        <div style="margin-top: 20px; padding: 16px; background: #1A2744; border-radius: 8px;">
          <p style="color: #C9943E; font-size: 13px; font-weight: 600; margin: 0 0 8px;">JOSHUA — CALL PREP NOTES</p>
          <ul style="color: rgba(255,255,255,0.85); font-size: 13px; margin: 0; padding-left: 16px; line-height: 1.8;">
            <li>FCI ${data.fciScore} → ${data.fciScore < 40 ? 'Critical range. High urgency. Lead with their bottleneck.' : data.fciScore < 60 ? 'Misaligned. Moderate urgency. Gap pattern is the hook.' : data.fciScore < 75 ? 'Functional but leaking. Show them the cost of doing nothing.' : 'Relatively strong. Sell the ceiling — Founders Circle territory.'}</li>
            <li>Gap Pattern: "${data.gapPattern}" → ${data.gapPattern === 'Evolved Founder, Broken Business' ? 'They\'ve done the internal work. Business hasn\'t caught up. Lead with GLM OS.' : data.gapPattern === 'Successful Founder, Suffering Human' ? 'Business looks great. They\'re dying inside. Lead with FreedomOS.' : 'Both systems matched but capped. Lead with Dual-OS integration.'}</li>
            <li>Bottleneck: ${data.primaryBottleneck} → Open with: "Your data flagged ${data.primaryBottleneck} at ${data.dimensions ? data.dimensions[data.primaryBottleneck] || '?' : '?'}/10. Tell me what that looks like day to day."</li>
            <li>Tier suggestion: ${!data.revenue ? 'Unknown revenue — qualify on call' : data.revenue < 1000000 ? 'Growth Track ($5K)' : data.revenue < 5000000 ? 'Accelerator ($15K)' : 'Founders Circle ($50K)'}</li>
          </ul>
        </div>

        <div style="margin-top: 16px; text-align: center;">
          <a href="mailto:${data.email}?subject=Your%20FCI%20Results%20%E2%80%94%20Freedom%20Launchpad&body=Hi%20${encodeURIComponent(data.name || '')}%2C%0A%0AGreat%20connecting%20on%20your%20FCI%20assessment..." style="display: inline-block; background: #C9943E; color: #fff; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 600;">Reply to This Lead</a>
        </div>

        <p style="margin-top: 16px; font-size: 11px; color: #8896A6; text-align: center;">
          Completed: ${data.completedAt || new Date().toISOString()} | Source: ${data.source || 'FCI Assessment'}
        </p>
      </div>
    </div>`;
}

function buildApplicationEmail(data) {
  const qualified = !data.disqualified;
  const statusColor = qualified ? '#2D9C6F' : '#C94A3E';
  const statusBg = qualified ? '#F0FDF4' : '#FDF2F2';
  const tierLabel = data.qualificationTier || 'Unknown';

  return `
    <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <div style="background: #1A2744; padding: 20px 24px; border-radius: 8px 8px 0 0;">
        <h2 style="color: #C9943E; margin: 0; font-size: 18px;">Application Submitted</h2>
        <p style="color: rgba(255,255,255,0.7); margin: 4px 0 0; font-size: 13px;">Freedom Launchpad Qualification Application</p>
      </div>
      <div style="background: #ffffff; border: 1px solid #E2E8F0; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">

        <div style="background: ${statusBg}; border-left: 4px solid ${statusColor}; padding: 12px 16px; border-radius: 4px; margin-bottom: 20px;">
          <span style="font-size: 14px; font-weight: 700; color: ${statusColor};">${qualified ? '✓ QUALIFIED' : '✗ DISQUALIFIED'}</span>
          <span style="font-size: 13px; color: #4A5568; margin-left: 8px;">— ${tierLabel} (Score: ${data.qualificationScore || '—'})</span>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #8896A6; font-size: 13px; width: 130px;">Applicant</td>
            <td style="padding: 8px 0; color: #1A2744; font-size: 14px; font-weight: 600;">${data.firstName} ${data.lastName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #8896A6; font-size: 13px;">Email</td>
            <td style="padding: 8px 0; color: #1A2744; font-size: 14px;"><a href="mailto:${data.email}" style="color: #1A2744;">${data.email}</a></td>
          </tr>
          ${data.phone ? `<tr><td style="padding: 8px 0; color: #8896A6; font-size: 13px;">Phone</td><td style="padding: 8px 0; color: #1A2744; font-size: 14px;">${data.phone}</td></tr>` : ''}
          <tr>
            <td style="padding: 8px 0; color: #8896A6; font-size: 13px;">Company</td>
            <td style="padding: 8px 0; color: #1A2744; font-size: 14px;">${data.company || '—'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #8896A6; font-size: 13px;">Title</td>
            <td style="padding: 8px 0; color: #1A2744; font-size: 14px;">${data.title || '—'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #8896A6; font-size: 13px;">Revenue</td>
            <td style="padding: 8px 0; color: #1A2744; font-size: 14px; font-weight: 600;">${data.revenue || '—'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #8896A6; font-size: 13px;">Selected Tier</td>
            <td style="padding: 8px 0; color: #C9943E; font-size: 14px; font-weight: 600;">${data.q5_tier || '—'}</td>
          </tr>
        </table>

        <div style="margin-top: 16px; text-align: center;">
          <a href="mailto:${data.email}?subject=Freedom%20Launchpad%20Application%20%E2%80%94%20Next%20Steps" style="display: inline-block; background: #C9943E; color: #fff; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 600;">Reply to Applicant</a>
        </div>

        <p style="margin-top: 16px; font-size: 11px; color: #8896A6; text-align: center;">
          Submitted: ${data.submittedAt || new Date().toISOString()}
        </p>
      </div>
    </div>`;
}

// ============================================================
// MAIN WORKER
// ============================================================
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    // ─────────────────────────────────────────────
    // POST /subscribe — Email capture (FCI start)
    // ─────────────────────────────────────────────
    if (request.method === 'POST' && url.pathname === '/subscribe') {
      try {
        const body = await request.json();
        const email = body.email;
        const name = body.name || '';
        const source = body.source || 'FCI Assessment — Email Capture';

        // Send notification email via Resend
        await sendNotificationEmail(
          `New Lead: ${name || email} — FCI Assessment Started`,
          buildNewLeadEmail(email, name, source)
        );

        return new Response(JSON.stringify({ ok: true }), {
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
        });
      } catch (e) {
        console.error('Subscribe error:', e.message);
        return new Response(JSON.stringify({ ok: false }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
        });
      }
    }

    // ─────────────────────────────────────────────
    // POST /fci-results — FCI score completed
    // ─────────────────────────────────────────────
    if (request.method === 'POST' && url.pathname === '/fci-results') {
      try {
        const data = await request.json();

        // Log for Cloudflare dashboard
        console.log('FCI_COMPLETED', JSON.stringify({
          name: data.name,
          email: data.email,
          fciScore: data.fciScore,
          fciLevel: data.fciLevel,
          gapPattern: data.gapPattern,
          primaryBottleneck: data.primaryBottleneck
        }));

        // Send detailed notification email via Resend
        const urgencyLabel = data.fciScore < 40 ? '🔴 HIGH PRIORITY' : data.fciScore < 70 ? '🟡 MEDIUM' : '🟢 STANDARD';
        await sendNotificationEmail(
          `${urgencyLabel} — FCI Completed: ${data.name || data.email} scored ${data.fciScore}/100`,
          buildFCICompletedEmail(data)
        );

        return new Response(JSON.stringify({ ok: true }), {
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
        });
      } catch (e) {
        console.error('FCI results error:', e.message);
        return new Response(JSON.stringify({ ok: false }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
        });
      }
    }

    // ─────────────────────────────────────────────
    // POST /apply — Application submission
    // ─────────────────────────────────────────────
    if (request.method === 'POST' && url.pathname === '/apply') {
      try {
        const applicationData = await request.json();
        const email = applicationData.email;

        // Log application
        console.log('APPLICATION_RECEIVED', JSON.stringify({
          applicant: applicationData.firstName + ' ' + applicationData.lastName,
          email: email,
          qualificationTier: applicationData.qualificationTier,
          disqualified: applicationData.disqualified
        }));

        // Send application notification via Resend
        const qualStatus = applicationData.disqualified ? '⛔' : applicationData.qualificationTier === 'Strong Fit' ? '🔥' : '📋';
        await sendNotificationEmail(
          `${qualStatus} Application: ${applicationData.firstName} ${applicationData.lastName} — ${applicationData.qualificationTier || 'Submitted'}`,
          buildApplicationEmail(applicationData)
        );

        return new Response(JSON.stringify({
          ok: true,
          message: 'Application received successfully',
          qualificationTier: applicationData.qualificationTier
        }), {
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
        });
      } catch (e) {
        console.error('Application submission error:', e.message);
        return new Response(JSON.stringify({
          ok: false,
          error: 'Failed to process application'
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
        });
      }
    }

    // ─────────────────────────────────────────────
    // POST /notify — Generic notification endpoint
    // Can be called from the Loveable site or any source
    // ─────────────────────────────────────────────
    if (request.method === 'POST' && url.pathname === '/notify') {
      try {
        const data = await request.json();
        const email = data.email || '';
        const name = data.name || '';
        const source = data.source || 'Freedom Launchpad';
        const eventType = data.type || 'GENERAL';
        // Build email based on type
        let subject, htmlBody;

        if (eventType === 'FCI_COMPLETED' && data.fciScore !== undefined) {
          const urgencyLabel = data.fciScore < 40 ? '🔴 HIGH' : data.fciScore < 70 ? '🟡 MEDIUM' : '🟢 STANDARD';
          subject = `${urgencyLabel} — FCI Completed: ${name || email} scored ${data.fciScore}/100`;
          htmlBody = buildFCICompletedEmail(data);
        } else {
          subject = `Freedom Launchpad: New ${eventType} from ${name || email}`;
          htmlBody = buildNewLeadEmail(email, name, `${source} — ${eventType}`);
        }

        await sendNotificationEmail(subject, htmlBody);

        return new Response(JSON.stringify({ ok: true }), {
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
        });
      } catch (e) {
        console.error('Notify error:', e.message);
        return new Response(JSON.stringify({ ok: false }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
        });
      }
    }

    // All other requests — serve static assets
    return env.ASSETS.fetch(request);
  }
};
