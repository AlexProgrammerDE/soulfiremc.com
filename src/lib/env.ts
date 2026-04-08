export function getRequiredEnv(
  value: string | undefined,
  name: string,
): string {
  if (value === undefined || value === "") {
    throw new Error(`Environment variable ${name} is not defined.`);
  }

  return value;
}
