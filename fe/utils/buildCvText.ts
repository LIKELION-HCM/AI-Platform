export function buildCvTextFromForm(cv: {
  fullName: string;
  yearOfBirth: string;
  email: string;
  literacy: string;
  jobSkills: string;
  softSkills: string;
  experience: string;
  certificates?: string;
}) {
  return `
Candidate Profile

Full name: ${cv.fullName}
Year of birth: ${cv.yearOfBirth}
Email: ${cv.email}

Education / Literacy:
${cv.literacy}

Job Skills:
${cv.jobSkills}

Soft Skills:
${cv.softSkills}

Work Experience:
${cv.experience}

Certificates:
${cv.certificates || "None"}
`.trim();
}