"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const UserService_1 = require("../../service/UserService");
const handler = async (request) => {
    const userService = new UserService_1.UserService();
    const isFollower = await userService.getIsFollowerStatus(request.token, request.user, request.targetUser);
    return {
        success: true,
        message: null,
        isFollower: isFollower
    };
};
exports.handler = handler;
