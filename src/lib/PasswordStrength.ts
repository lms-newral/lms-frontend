function calculatePasswordStrength(password: string): number {
  if (password.length === 0) return 0;
  if (password.length < 4) return 1;
  if (password.length < 8) return 2;

  // Check for character variety
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const varietyScore = [hasUpper, hasLower, hasNumber, hasSpecial].filter(
    Boolean
  ).length;

  if (password.length >= 12 && varietyScore >= 3) return 4;
  if (password.length >= 8 && varietyScore >= 2) return 3;
  return 2;
}
export default calculatePasswordStrength;
