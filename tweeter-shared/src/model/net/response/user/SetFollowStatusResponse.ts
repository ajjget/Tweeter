import { TweeterResponse } from "../TweeterResponse"

export interface SetFollowStatusResponse extends TweeterResponse {
  readonly followerCount: number,
  readonly followeeCount: number
}