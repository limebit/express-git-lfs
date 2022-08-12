export const getRequiredEnvVar = (envVarName: string): string => {
  const envVar = process.env[envVarName];

  if (!envVar) throw new Error(`Environment variable ${envVarName} is not set`);

  return envVar;
};

export const getEnvVarWithDefault = (
  envVarName: string,
  defaultValue: string
): string => {
  const envVar = process.env[envVarName];

  if (!envVar) return defaultValue;

  return envVar;
};

export const getProtocol = () => {
  return getEnvVarWithDefault("PROTOCOL", "http");
};

export const getPort = () => {
  return parseInt(getEnvVarWithDefault("PORT", "8000"));
};

export const getHost = () => {
  return getEnvVarWithDefault("HOST", "localhost");
};
