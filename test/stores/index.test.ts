import { LocalStore } from "../../server/stores/local-store";
import { getStore } from "../../server/stores";

describe("Store", () => {
  test("Calling getStore should return LocalStore", () => {
    const store = getStore();

    expect(store).toBe(LocalStore);
  });
});
