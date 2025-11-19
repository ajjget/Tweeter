import { FollowActionRequest, GetIsFollowerStatusResponse } from "tweeter-shared";
import { UserService } from "../../service/UserService";

export const handler = async (request: FollowActionRequest): Promise<GetIsFollowerStatusResponse> => {
  const userService = new UserService();
  const isFollower = await userService.getIsFollowerStatus(
    request.token, 
    request.followerAlias,
    request.followeeAlias
  );

  return {
    success: true,
    message: null,
    isFollower: isFollower
  }
}