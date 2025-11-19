import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { services } from "../Lambda";

export const handler = async (request: PostStatusRequest): Promise<TweeterResponse> => {
  await services.statusService.postStatus(
    request.token,
    request.status
  );

  return {
    success: true,
    message: null
  }
}