function getEnvVariable(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
}

export const JWT_SECRET = getEnvVariable("JWT_SECRET");
export const DATABASE_URL = getEnvVariable("DATABASE_URL");
