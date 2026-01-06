export function buildCvTextFromForm(cv: {
  fullName: string;
  yearOfBirth: string;
  education: string;
  experience: string;
  softSkills: string;
  certificates?: string;
  other?: string;
}) {
  return `
Candidate Profile

Full name: ${cv.fullName}
Year of birth: ${cv.yearOfBirth}

Education:
${cv.education}

Work experience:
${cv.experience}

Soft skills:
${cv.softSkills}

Certificates:
${cv.certificates || "None"}

Other information:
${cv.other || "None"}
`.trim();
}
