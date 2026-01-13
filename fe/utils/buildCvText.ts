export function buildCvTextFromForm(cv: {
  firstName: string;
  lastName: string;
  yearOfBirth: string;
  education: string;
  jobSkills: string;
  softSkills: string;
  experience: string;
  yearOfExperience: string;
  certificates?: string;
}) {
  return `
Candidate Profile

Full name: ${cv.firstName} ${cv.lastName}
Year of birth: ${cv.yearOfBirth}

Education:
${cv.education}

Job Skills:
${cv.jobSkills}

Soft Skills:
${cv.softSkills}

Work Experience:
${cv.experience}

Years of Experience: ${cv.yearOfExperience}

Certificates:
${cv.certificates || "None"}
`.trim();
}