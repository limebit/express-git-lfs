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

export const getUploadAction = (user: string, repo: string, oid: string) => {
  const host = getEnvVarWithDefault("HOST", "localhost");
  const protocol = getProtocol();

  return {
    href: `${protocol}://${host}:3000/${user}/${repo}/objects/${oid}`,
  };
};

export const getDownloadAction = getUploadAction;
