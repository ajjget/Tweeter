import { TweeterRequest } from "../TweeterRequest";

export interface FollowActionRequest extends TweeterRequest {
  token: string,
  followerAlias: string,
  followeeAlias: string
}