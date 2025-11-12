"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class StatusService {
    async loadMoreFeedItems(authToken, userAlias, pageSize, lastItem) {
        return this.getFakeData(lastItem, pageSize);
    }
    ;
    async loadMoreStoryItems(authToken, userAlias, pageSize, lastItem) {
        return this.getFakeData(lastItem, pageSize);
    }
    ;
    async getFakeData(lastItem, pageSize) {
        const [items, hasMore] = tweeter_shared_1.FakeData.instance.getPageOfStatuses(tweeter_shared_1.Status.fromDto(lastItem), pageSize);
        const dtos = items.map((status) => status.dto);
        return [dtos, hasMore];
    }
    async postStatus(authToken, newStatus) {
        await new Promise((f) => setTimeout(f, 2000));
    }
    ;
}
exports.StatusService = StatusService;
