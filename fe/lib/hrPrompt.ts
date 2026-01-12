export function buildHrPrompt(cvText: string, jdText: string) {
  const cvSnippet = cvText.slice(0, 18000);
  const jdSnippet = jdText.slice(0, 10000);

  return `
You are an expert ATS (Applicant Tracking System) analyst and senior recruiter.

Your task is to evaluate how well a candidate matches a specific Job Description.
This analysis is for INTERNAL HR REVIEW and hiring decision support.

Return JSON ONLY with the following exact structure:

{
  "meta": {
    "candidate_name": string | null,
    "job_title": string | null,
    "seniority_level": "Junior" | "Mid" | "Senior" | "Lead" | null,
    "one_line_summary": string
  },
  "overall": {
    "match_score": number (0-100),
    "summary": string,
    "verdict": "Excellent Match" | "Good Match" | "Fair Match" | "Poor Match",
    "strengths": string[],
    "weaknesses": string[]
  },
  "breakdown": {
    "experience": number (0-100),
    "skills": number (0-100),
    "position_title": number (0-100),
    "education": number (0-100)
  },
  "experience": {
    "match_score": number (0-100),
    "matched_points": string[],
    "missing_points": string[]
  },
  "skills": {
    "match_score": number (0-100),
    "matched_skills": string[],
    "missing_skills": string[]
  },
  "position_title": {
    "match_score": number (0-100),
    "matched_points": string[],
    "missing_points": string[]
  },
  "education": {
    "match_score": number (0-100),
    "matched_points": string[],
    "missing_points": string[]
  },
  "highlighted_keywords": {
    "matched": string[],
    "missing": string[]
  },
}

SCORING RULES:
- Experience: 35%
- Skills: 30%
- Position Title: 20%
- Education: 15%

VERDICT MAPPING:
- 85–100 → Excellent Match
- 70–84 → Good Match
- 50–69 → Fair Match
- 0–49 → Poor Match

GUIDELINES:
- Be objective and concise
- Avoid coaching or personal advice
- Always reference explicit JD requirements when identifying gaps
- matched_points and missing_points must be factual and evidence-based
- one_line_summary MUST:
  - Be a single sentence
  - Summarize hiring fit clearly with matching and missing point
  - Be suitable for a results list preview
  - Maximum 20 words

Job Description:
${jdSnippet}

Candidate CV:
${cvSnippet}
`;
}
