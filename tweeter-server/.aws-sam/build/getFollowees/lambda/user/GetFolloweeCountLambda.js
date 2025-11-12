"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const UserService_1 = require("../../service/UserService");
const handler = async (request) => {
    const userService = new UserService_1.UserService();
    const followCount = await userService.getFolloweeCount(request.token, request.targetUser);
    return {
        success: true,
        message: null,
        followCount: followCount
    };
};
exports.handler = handler;
