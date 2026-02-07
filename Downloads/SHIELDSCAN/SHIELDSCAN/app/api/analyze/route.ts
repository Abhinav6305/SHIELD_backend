import { NextRequest, NextResponse } from "next/server"

// ============================================
// Before Click: AI Security Posture Analyzer
// /api/analyze — Backend API endpoint
// ============================================
// This endpoint receives scanData from the Chrome extension
// and returns an AI-powered security analysis.
//
// To use a real LLM, set the OPENAI_API_KEY env variable
// and uncomment the AI SDK integration below.
// ============================================

const AI_SYSTEM_PROMPT = `You are a senior web security engineer and UX writer inside a Chrome extension called
"Before Click: AI Website Security Posture Analyzer".

Your job: take structured, PASSIVE scan data for ONE website and produce:
- A security posture score (0-100)
- Sub-scores for different areas
- Attacker's first 60 seconds view
- Security debt assessment
- Fix impact estimator
- Industry-style benchmark
- Invisible risks
- A short security story in simple language

You MUST treat this as a passive, ethical posture analysis.
NO hacking, NO exploitation, NO active scanning, NO port scans.

Return STRICT JSON, no extra text, with this shape:

{
  "score": 0-100,
  "label": "Strong | Medium | Weak",
  "breakdown": {
    "ssl_tls": 0-100,
    "headers": 0-100,
    "technology": 0-100,
    "exposure": 0-100,
    "trust": 0-100
  },
  "attacker_60s": ["bullet 1", "bullet 2", "bullet 3", "bullet 4"],
  "security_debt": {
    "percent": 0-100,
    "level": "LOW | MEDIUM | HIGH",
    "summary": "1-3 sentence explanation"
  },
  "fix_impact": [
    {
      "fix": "Short fix name",
      "description": "1-sentence what to do",
      "impact_percent": 1-30
    }
  ],
  "benchmark": {
    "site_score": 0-100,
    "ecommerce_avg": 65-80,
    "blog_avg": 50-70,
    "forum_avg": 45-65,
    "summary": "1-2 sentence comparison"
  },
  "invisible_risks": ["short bullet about a risk"],
  "story_mode": {
    "title": "Short phrase summary",
    "body": "3-5 sentence story in simple language"
  }
}

SCORING RULES:
1) SSL/TLS: Reward HTTPS, valid certs, modern TLS. Penalize HTTP-only, expired certs, old TLS.
2) Headers: Reward presence of CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
3) Technology: Penalize revealing server/version headers. Neutral if unknown.
4) Exposure: Penalize robots.txt exposing admin/test/backup paths, directory listing.
5) Trust: Reward clean redirects, no mixed content, established domains.

Overall score = weighted combination. Strong >= 80, Medium 60-79, Weak < 60.

IMPORTANT: Return ONLY valid JSON. No extra text or markdown.`

// ============================================
// Types
// ============================================

interface ScanHeaders {
  content_security_policy: string | null
  x_frame_options: string | null
  x_content_type_options: string | null
  strict_transport_security: string | null
  permissions_policy: string | null
  referrer_policy: string | null
  server: string | null
  x_powered_by: string | null
}

interface ScanData {
  url: string
  is_https: boolean
  redirect_chain: string[]
  cert_status: string
  tls_version: string
  headers: ScanHeaders
  exposure: {
    robots_txt_accessible: boolean
    robots_txt_paths: string[]
    sitemap_xml_accessible: boolean
    directory_listing_signs: boolean
  }
  dom: {
    mixed_content_suspected: boolean
  }
  domain_info: {
    age_category: string
  }
}

// ============================================
// POST handler
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const scanData: ScanData = body.scanData

    if (!scanData || !scanData.url) {
      return NextResponse.json(
        { error: "Missing scanData or scanData.url" },
        { status: 400 }
      )
    }

    // ============================================
    // OPTION 1: Use AI SDK with a real LLM
    // ============================================
    // Uncomment the section below and install the AI SDK:
    //
    // import { generateText } from "ai"
    //
    // const { text } = await generateText({
    //   model: "openai/gpt-4o-mini",
    //   system: AI_SYSTEM_PROMPT,
    //   prompt: JSON.stringify(scanData),
    // })
    // const result = JSON.parse(text)
    // return NextResponse.json(result)
    //
    // ============================================

    // OPTION 2: Local rule-based analysis (no API key needed)
    const result = generateLocalAnalysis(scanData)
    return NextResponse.json(result)
  } catch (error) {
    console.error("[BeforeClick API] Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Keep the system prompt referenced so it's available when AI is enabled
export const _AI_SYSTEM_PROMPT = AI_SYSTEM_PROMPT

// ============================================
// Local rule-based analysis
// ============================================

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val))
}

function generateLocalAnalysis(data: ScanData) {
  // --- SSL/TLS Score ---
  let sslScore = 50
  if (data.is_https) sslScore += 30
  if (data.cert_status === "valid") sslScore += 15
  else if (data.cert_status === "invalid" || data.cert_status === "expired") sslScore -= 20
  if (data.tls_version === "TLS1.3") sslScore += 5
  else if (data.tls_version === "TLS1.2") sslScore += 3
  else if (data.tls_version === "TLS1.0" || data.tls_version === "TLS1.1") sslScore -= 15
  sslScore = clamp(sslScore, 0, 100)

  // --- Headers Score ---
  const h = data.headers
  const headerChecks = [
    { val: h.content_security_policy, weight: 20 },
    { val: h.strict_transport_security, weight: 18 },
    { val: h.x_frame_options, weight: 15 },
    { val: h.x_content_type_options, weight: 15 },
    { val: h.referrer_policy, weight: 12 },
    { val: h.permissions_policy, weight: 10 },
  ]
  let headersScore = 0
  let maxHeaders = 0
  for (const check of headerChecks) {
    maxHeaders += check.weight
    if (check.val) headersScore += check.weight
  }
  headersScore = Math.round((headersScore / maxHeaders) * 100)

  // --- Technology Score ---
  let techScore = 75
  if (h.server) {
    if (/\d+\.\d+/.test(h.server)) techScore -= 20
    else techScore -= 5
  }
  if (h.x_powered_by) {
    if (/\d+\.\d+/.test(h.x_powered_by)) techScore -= 20
    else techScore -= 10
  }
  techScore = clamp(techScore, 0, 100)

  // --- Exposure Score ---
  let exposureScore = 85
  if (data.exposure.robots_txt_accessible && data.exposure.robots_txt_paths.length > 0) {
    exposureScore -= data.exposure.robots_txt_paths.length * 8
  }
  if (data.exposure.directory_listing_signs) exposureScore -= 20
  exposureScore = clamp(exposureScore, 0, 100)

  // --- Trust Score ---
  let trustScore = 60
  if (data.is_https) trustScore += 15
  if (data.redirect_chain.length > 0) trustScore += 5
  if (!data.dom.mixed_content_suspected) trustScore += 10
  if (data.domain_info.age_category === "established" || data.domain_info.age_category === "old")
    trustScore += 10
  else if (data.domain_info.age_category === "very_new") trustScore -= 15
  trustScore = clamp(trustScore, 0, 100)

  // --- Overall Score ---
  const overall = Math.round(
    sslScore * 0.25 +
      headersScore * 0.25 +
      techScore * 0.15 +
      exposureScore * 0.2 +
      trustScore * 0.15
  )
  const label = overall >= 80 ? "Strong" : overall >= 60 ? "Medium" : "Weak"

  // --- Attacker's First 60 Seconds ---
  const attackerBullets: string[] = []
  if (h.server) attackerBullets.push(`Server header reveals: ${h.server}`)
  if (!h.content_security_policy)
    attackerBullets.push("No Content-Security-Policy header — XSS risk surface is wide open")
  if (!h.strict_transport_security)
    attackerBullets.push("No HSTS header — browser can be tricked into HTTP downgrade")
  if (!h.x_frame_options)
    attackerBullets.push("No X-Frame-Options — clickjacking may be possible")
  if (data.exposure.robots_txt_paths.length > 0)
    attackerBullets.push(`robots.txt exposes paths: ${data.exposure.robots_txt_paths.join(", ")}`)
  if (!data.is_https)
    attackerBullets.push("Site uses plain HTTP — all traffic is unencrypted and interceptable")
  if (h.x_powered_by) attackerBullets.push(`X-Powered-By reveals: ${h.x_powered_by}`)
  if (attackerBullets.length === 0)
    attackerBullets.push("Minimal attack surface visible from public signals")

  // --- Security Debt ---
  const missingHeaders = headerChecks.filter((c) => !c.val).length
  const debtPercent = clamp(
    Math.round((missingHeaders / headerChecks.length) * 60 + (data.is_https ? 0 : 25)),
    0,
    100
  )
  const debtLevel = debtPercent >= 60 ? "HIGH" : debtPercent >= 30 ? "MEDIUM" : "LOW"
  const debtSummary =
    debtLevel === "HIGH"
      ? "This site has accumulated significant security debt. Many standard security headers are missing and basic hardening has been deferred."
      : debtLevel === "MEDIUM"
        ? "This site has moderate security debt. Some security headers are in place but several important ones are missing."
        : "This site has low security debt. Most recommended security headers and configurations are present."

  // --- Fix Impact ---
  const fixes: { fix: string; description: string; impact_percent: number }[] = []
  if (!h.content_security_policy)
    fixes.push({
      fix: "Add Content-Security-Policy",
      description: "Restrict script sources to prevent cross-site scripting attacks",
      impact_percent: 20,
    })
  if (!h.strict_transport_security)
    fixes.push({
      fix: "Enable HSTS header",
      description: "Force browsers to always use HTTPS for this domain",
      impact_percent: 15,
    })
  if (h.server && /\d+\.\d+/.test(h.server))
    fixes.push({
      fix: "Remove server version",
      description: "Hide exact server software version from response headers",
      impact_percent: 10,
    })
  if (!h.x_frame_options)
    fixes.push({
      fix: "Add X-Frame-Options",
      description: "Prevent the site from being embedded in iframes to block clickjacking",
      impact_percent: 8,
    })
  if (!h.x_content_type_options)
    fixes.push({
      fix: "Add X-Content-Type-Options",
      description: "Prevent browsers from MIME-sniffing responses",
      impact_percent: 5,
    })
  if (fixes.length === 0)
    fixes.push({
      fix: "Maintain current posture",
      description: "Continue monitoring for new security best practices",
      impact_percent: 5,
    })

  // --- Benchmark ---
  const ecommerceAvg = 72
  const blogAvg = 58
  const forumAvg = 52
  const benchSummary =
    overall >= ecommerceAvg
      ? "This site meets or exceeds the average security posture of e-commerce sites."
      : overall >= blogAvg
        ? "This site scores above blog and forum averages but falls below e-commerce standards."
        : overall >= forumAvg
          ? "This site is roughly on par with forum averages but lags behind blogs and e-commerce."
          : "This site falls below all industry averages and needs significant hardening."

  // --- Invisible Risks ---
  const risks: string[] = []
  if (data.is_https && !h.strict_transport_security)
    risks.push("Valid HTTPS but no HSTS means first-visit downgrade attacks are possible")
  if (data.exposure.robots_txt_paths.length > 0)
    risks.push("robots.txt publicly maps internal infrastructure paths")
  if (!h.permissions_policy)
    risks.push("Missing Permissions-Policy allows silent feature access by embedded content")
  if (!h.referrer_policy)
    risks.push("No Referrer-Policy means full URLs may leak to third-party sites")
  if (h.server) risks.push("Server header reveals technology stack to automated scanners")
  if (risks.length === 0) risks.push("No major invisible risks detected from available signals")

  // --- Story Mode ---
  const goodParts: string[] = []
  const badParts: string[] = []
  if (data.is_https) goodParts.push("uses HTTPS encryption")
  if (data.redirect_chain.length > 0) goodParts.push("properly redirects to the secure version")
  if (h.strict_transport_security) goodParts.push("enforces HTTPS with HSTS")
  if (h.content_security_policy) goodParts.push("has a Content Security Policy")
  if (!h.content_security_policy) badParts.push("is missing a Content Security Policy")
  if (!h.strict_transport_security) badParts.push("does not enforce HTTPS strictly")
  if (h.server) badParts.push("reveals its server software")

  const storyTitle =
    overall >= 80
      ? "Well-Guarded Digital Fortress"
      : overall >= 60
        ? "Looks Safe, But Leaks Clues"
        : "Open Book for Curious Eyes"

  let storyBody = `This website ${goodParts.length > 0 ? goodParts.join(" and ") : "has limited visible protections"}.`
  storyBody += ` However, it ${badParts.length > 0 ? badParts.join(", and ") : "appears to follow most security best practices"}.`
  storyBody += ` Overall, the site scores ${overall} out of 100 on our passive security posture analysis.`
  storyBody +=
    overall < 60
      ? " Several fundamental improvements are recommended before trusting this site with sensitive data."
      : overall < 80
        ? " Some improvements would strengthen its security posture significantly."
        : " It demonstrates good security hygiene based on publicly visible signals."

  return {
    score: overall,
    label,
    breakdown: {
      ssl_tls: sslScore,
      headers: headersScore,
      technology: techScore,
      exposure: exposureScore,
      trust: trustScore,
    },
    attacker_60s: attackerBullets.slice(0, 6),
    security_debt: { percent: debtPercent, level: debtLevel, summary: debtSummary },
    fix_impact: fixes.slice(0, 5),
    benchmark: {
      site_score: overall,
      ecommerce_avg: ecommerceAvg,
      blog_avg: blogAvg,
      forum_avg: forumAvg,
      summary: benchSummary,
    },
    invisible_risks: risks,
    story_mode: { title: storyTitle, body: storyBody },
  }
}
