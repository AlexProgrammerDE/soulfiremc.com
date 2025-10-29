export function getRequiredEnv(name: keyof NodeJS.ProcessEnv): string {
  const value = process.env[name];

  if (value === undefined || value === "") {
    throw new Error(`Environment variable ${name} is not defined.`);
  }

  return value;
}
