import { User, AuthToken } from "tweeter-shared";
import { AuthService } from "../../src/model.service/AuthService";
import { StatusService } from "../../src/model.service/StatusService"
import "isomorphic-fetch";

describe("Status Service integration tests", () => {
  const statusService = new StatusService();

  const testAlias = `testUser${Date.now}`;
  let user: User;
  let authToken: AuthToken;

  beforeAll(async () => {
    const authService = new AuthService();
    const [testUser, testAuthToken] = await authService.register("test", "test", testAlias, "test", new Uint8Array(10), "test");

    user = testUser;
    authToken = testAuthToken;
  });

  it("gets a user's story pages", async () => {
    const [storyItems, hasMore] = await statusService.loadMoreStoryItems(authToken, testAlias, 10, null);

    expect(storyItems).toBeDefined();
    expect(Array.isArray(storyItems)).toBe(true);
    expect(storyItems.length).toBe(10);
    
    const storyItem = storyItems[0];
    expect(storyItem.post).toContain("http://byu.edu");
    expect(storyItem.user.alias).toBe("@allen");
    
    expect(hasMore).toBeDefined();
    expect(typeof hasMore).toBe("boolean");
    expect(hasMore).toBe(true);
  });
})