import { FollowActionRequest, SetFollowStatusResponse } from "tweeter-shared";
import { UserService } from "../../service/UserService";

export const handler = async (request: FollowActionRequest): Promise<SetFollowStatusResponse> => {
  const userService = new UserService();
  const [followerCount, followeeCount] = await userService.follow(
    request.token, 
    request.followerAlias,
    request.followeeAlias
  );

  return {
    success: true,
    message: null,
    followerCount: followerCount,
    followeeCount: followeeCount
  }
}