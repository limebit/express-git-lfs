export class Store {
  static getUploadAction(
    user: string,
    repo: string,
    oid: string,
    size: number
  ) {
    return {
      href: `http://localhost:3000/${user}/${repo}/objects/${oid}`,
    };
  }
}
