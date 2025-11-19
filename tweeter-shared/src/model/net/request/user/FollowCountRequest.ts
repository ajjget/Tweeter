import { TweeterRequest } from "../TweeterRequest";

export interface FollowCountRequest extends TweeterRequest {
  token: string,
  userAlias: string
}