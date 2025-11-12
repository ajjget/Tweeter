import "isomorphic-fetch";
import { ServerFacade } from "../../src/model.service/ServerFacade";
import { AuthToken, FollowActionRequest, LoginRequest, PagedUserItemRequest, RegisterRequest, User, UserDto } from "tweeter-shared";

describe("Server Facade Integration Tests", () => {
  const serverFacade = new ServerFacade();

  // add Date.now for the future, when we have real data
  const testAlias = `testUser${Date.now}`;
  const testPassword = "mypassword";
  let token : AuthToken;
  let user : User;

  beforeAll(async () => {
    const request: RegisterRequest = {
      alias: testAlias,
      password: testPassword,
      firstName: "test",
      lastName: "test",
      userImageBytes: "test",
      imageFileExtension: "test"
    };

    const [testUser, testAuthToken] = await serverFacade.register(request);

    token = testAuthToken;
    user = testUser;
  });

  it("registers a user successfully", async () => {
    // service call made in beforeall
    expect(user).toBeDefined();
    expect(user.alias).toBe('@allen');
    expect(user.name).toBe("Allen Anderson");

    expect(token).toBeDefined(); 
    expect(typeof token.token).toBe('string');
    expect(token.token).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });

  it("gets a user's followers successfully", async () => {
    const request: PagedUserItemRequest = {
      userAlias: testAlias,
      pageSize: 5,
      lastItem: null,
      token: token.token
    };

    const [followers, hasMore] = await serverFacade.getMoreFollowers(request);

    expect(followers).toBeDefined();
    expect(Array.isArray(followers)).toBe(true);
    expect(followers.length).toBe(5);
    const follower = followers[0];
    expect(follower.alias).toBe("@allen");
    expect(follower.name).toBe("Allen Anderson");

    expect(hasMore).toBeDefined();
    expect(typeof hasMore).toBe("boolean");
    expect(hasMore).toBe(true);
  });

  it("gets followee count successfully", async () => {
    const request: FollowActionRequest = {
      token: token.token,
      targetUser: user.dto
    };

    const followeeCount = await serverFacade.getFolloweeCount(request);

    expect(followeeCount).toBeDefined();
    expect(typeof followeeCount).toBe('number');
    expect(followeeCount).not.toBeNull();
    expect(followeeCount).toBeGreaterThan(0);
  });
})