import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { services } from "../Lambda";

export const handler = async (request: PostStatusRequest): Promise<TweeterResponse> => {
  try {
    await services.statusService.postStatus(
      request.token,
      request.status
    );

    return {
      success: true,
      message: null
    }
  }
  catch (error) {
    return {
      success: false,
      message: (error as Error).message ?? "Unknown error",
    }
  }
  
}