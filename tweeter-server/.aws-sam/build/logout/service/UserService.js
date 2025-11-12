"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class UserService {
    async getUser(token, alias) {
        // TODO: Replace with the result of calling server
        return tweeter_shared_1.FakeData.instance.findUserByAlias(alias).dto;
    }
    ;
    async follow(token, userToFollow) {
        // Pause so we can see the follow message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
        // TODO: Call the server
        const followerCount = await this.getFollowerCount(token, userToFollow);
        const followeeCount = await this.getFolloweeCount(token, userToFollow);
        return [followerCount, followeeCount];
    }
    ;
    async unfollow(token, userToUnfollow) {
        // Pause so we can see the unfollow message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
        // TODO: Call the server
        const followerCount = await this.getFollowerCount(token, userToUnfollow);
        const followeeCount = await this.getFolloweeCount(token, userToUnfollow);
        return [followerCount, followeeCount];
    }
    ;
    async getFolloweeCount(token, user) {
        // TODO: Replace with the result of calling server
        return tweeter_shared_1.FakeData.instance.getFolloweeCount(user.alias);
    }
    ;
    async getFollowerCount(authToken, user) {
        // TODO: Replace with the result of calling server
        return tweeter_shared_1.FakeData.instance.getFollowerCount(user.alias);
    }
    ;
    async getIsFollowerStatus(token, user, selectedUser) {
        // TODO: Replace with the result of calling server
        return tweeter_shared_1.FakeData.instance.isFollower();
    }
    ;
}
exports.UserService = UserService;
