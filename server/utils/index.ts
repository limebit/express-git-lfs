export const getUploadAction = (
  user: string,
  repo: string,
  oid: string,
  size: number
) => ({
  href: `http://localhost:3000/${user}/${repo}/objects/${oid}`,
});
