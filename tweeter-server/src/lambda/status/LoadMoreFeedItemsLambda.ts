import { PagedStatusItemRequest, PagedStatusItemResponse } from "tweeter-shared";
import { services } from "../Lambda";

export const handler = async (request: PagedStatusItemRequest): Promise<PagedStatusItemResponse> => {
  const [items, hasMore] = await services.statusService.loadMoreFeedItems(
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