const matchSkills = (userSkills = [], jobSkills = []) => {
  if (!jobSkills.length) return { matchPercent: 100, matchedSkills: [], missingSkills: [] };
  const u = userSkills.map(s => s.toLowerCase().trim());
  const j = jobSkills.map(s => s.toLowerCase().trim());
  const matchedSkills = j.filter(s => u.includes(s));
  const missingSkills = j.filter(s => !u.includes(s));
  return { matchPercent: Math.round((matchedSkills.length / j.length) * 100), matchedSkills, missingSkills };
};
module.exports = matchSkills;
