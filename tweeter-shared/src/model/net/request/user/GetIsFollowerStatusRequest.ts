import { UserDto } from "../../../dto/UserDto";
import { FollowActionRequest } from "./FollowActionRequest";

export interface GetIsFollowerStatusRequest extends FollowActionRequest {
  user: UserDto
}