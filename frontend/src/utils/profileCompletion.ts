/**
 * Single source of truth for profile completion percentage.
 * Matches the backend calculateCompletion() in backend/src/routes/profile.ts exactly.
 *
 * Scoring (max 100):
 *   name or college      → 30
 *   skills (non-empty)   → 20
 *   any social link      → 10
 *   education            → 20
 *   experience           → 15
 *   certifications       → 5
 */
export function calculateProfileCompletion(p: Record<string, any>): number {
  if (!p) return 0

  let score = 0

  // name or college → 30pts
  const hasName = typeof p.name === 'string' && p.name.trim().length > 0
  const hasCollege = typeof p.college === 'string' && p.college.trim().length > 0
  if (hasName || hasCollege) score += 30

  // skills → 20pts
  const skills = p.skills
  const hasSkills =
    (Array.isArray(skills) && skills.length > 0) ||
    (typeof skills === 'string' && skills.trim().length > 0)
  if (hasSkills) score += 20

  // any social link → 10pts
  const hasLink =
    (typeof p.linkedin_url === 'string' && p.linkedin_url.trim().length > 0) ||
    (typeof p.github_url === 'string' && p.github_url.trim().length > 0) ||
    (typeof p.portfolio_url === 'string' && p.portfolio_url.trim().length > 0)
  if (hasLink) score += 10

  // education → 20pts
  const edu = p.education
  const hasEducation =
    (Array.isArray(edu) && edu.length > 0) ||
    (typeof edu === 'string' && edu.trim().length > 0)
  if (hasEducation) score += 20

  // experience → 15pts
  const exp = p.experience
  const hasExperience =
    (Array.isArray(exp) && exp.length > 0) ||
    (typeof exp === 'string' && exp.trim().length > 0)
  if (hasExperience) score += 15

  // certifications → 5pts
  const certs = p.certifications
  const hasCerts =
    (Array.isArray(certs) && certs.length > 0) ||
    (typeof certs === 'string' && certs.trim().length > 0)
  if (hasCerts) score += 5

  return Math.min(score, 100)
}

/**
 * Returns the number of incomplete sections out of 6 total.
 */
export function incompleteSections(p: Record<string, any>): number {
  if (!p) return 6
  let done = 0
  if ((p.name?.trim() || p.college?.trim())) done++
  const skills = p.skills
  if ((Array.isArray(skills) && skills.length > 0) || (typeof skills === 'string' && skills.trim())) done++
  if (p.linkedin_url?.trim() || p.github_url?.trim() || p.portfolio_url?.trim()) done++
  const edu = p.education
  if ((Array.isArray(edu) && edu.length > 0) || (typeof edu === 'string' && edu.trim())) done++
  const exp = p.experience
  if ((Array.isArray(exp) && exp.length > 0) || (typeof exp === 'string' && exp.trim())) done++
  const certs = p.certifications
  if ((Array.isArray(certs) && certs.length > 0) || (typeof certs === 'string' && certs.trim())) done++
  return 6 - done
}
