import { AuthResponse, RegisterRequest } from "tweeter-shared";
import { services } from "../Lambda"

export const handler = async (request: RegisterRequest): Promise<AuthResponse> => {
  try {
    const [user, authToken] = await services.authService.register(
      request.firstName,
      request.lastName,
      request.alias,
      request.password,
      request.userImageBytes,
      request.imageFileExtension
    );

    return {
      success: true,
      message: null,
      user: user,
      authToken: authToken
    }
  }
  catch (error) {
    return {
      success: false,
      message: (error as Error).message ?? "Unknown error",
      user: null,
      authToken: null
    }
  }
}