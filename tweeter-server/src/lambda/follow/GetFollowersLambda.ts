import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { services } from "../Lambda"

export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
  try {
    const [items, hasMore] = await services.followService.loadMoreFollowers(
      request.token, 
      request.userAlias, 
      request.pageSize, 
      request.lastItem
    );

    return {
      success: true,
      message: null,
      items: items,
      hasMore: hasMore
    }
  }
  catch (error) {
    return {
      success: false,
      message: (error as Error).message ?? "Unknown error",
      items: null,
      hasMore: false
    }
  }
}