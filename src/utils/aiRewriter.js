/**
 * AI Description Rewrite Engine for Madame Minute
 * Turns simple notes like "fixed bug" or "meeting with client" into executive-grade work logs.
 */

const REWRITE_RULES = [
  { keywords: ['bug', 'fix', 'error', 'patch', 'issue'], action: 'Resolved critical technical anomaly', detail: 'conducted root-cause analysis, applied structural fix, and validated end-to-end functionality across environments.' },
  { keywords: ['meeting', 'call', 'sync', 'discussion', 'standup'], action: 'Led strategic alignment session', detail: 'synchronized cross-functional objectives, defined immediate deliverables, and updated operational timelines.' },
  { keywords: ['design', 'ui', 'ux', 'figma', 'mockup', 'wireframe'], action: 'Architected high-fidelity UI component interface', detail: 'crafted responsive layout tokens, implemented design system standards, and ensured accessibility compliance.' },
  { keywords: ['refactor', 'clean', 'code', 'optimize', 'speed', 'perf'], action: 'Optimized core application module architecture', detail: 'refactored legacy functions, reduced memory footprint, and enhanced execution throughput.' },
  { keywords: ['test', 'qa', 'spec', 'jest', 'cypress', 'unit'], action: 'Executed comprehensive quality assurance protocol', detail: 'authored unit test cases, verified edge-case scenarios, and achieved optimal branch coverage.' },
  { keywords: ['deploy', 'release', 'ci/cd', 'build', 'docker'], action: 'Orchestrated production deployment pipeline', detail: 'verified build artifacts, monitored rollout health metrics, and ensured seamless service continuity.' },
  { keywords: ['doc', 'readme', 'write', 'notes', 'spec'], action: 'Authored technical architecture documentation', detail: 'structured systemic guidelines, documented API specs, and published reference guides for engineering teams.' }
]

export function rewriteTaskDescription(rawInput, project = 'Madame Minute Vault') {
  if (!rawInput || typeof rawInput !== 'string') return rawInput

  const trimmed = rawInput.trim()
  if (trimmed.length > 80 && !trimmed.toLowerCase().includes('fixed')) {
    // Already detailed
    return trimmed
  }

  const lower = trimmed.toLowerCase()
  const matchedRule = REWRITE_RULES.find(rule => 
    rule.keywords.some(kw => lower.includes(kw))
  )

  if (matchedRule) {
    return `${matchedRule.action} for ${project}: "${trimmed}". Executed comprehensive review, ${matchedRule.detail}`
  }

  // General enhancement fallback
  const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
  return `Executed operational objective for ${project}: ${capitalized}. Managed execution details, verified compliance with technical requirements, and validated end-to-end integration.`
}
