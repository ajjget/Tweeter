import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { services } from "../Lambda";

export const handler = async (request: GetUserRequest): Promise<GetUserResponse> => {
  try {
    const user = await services.userService.getUser(
      request.token, 
      request.alias,
    );

    return {
      success: true,
      message: null,
      user: user
    }
  }
  catch (error) {
    return {
      success: false,
      message: (error as Error).message ?? "Unknown error",
      user: null
    }
  }
}