"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class AuthService {
    async login(alias, password) {
        // TODO: Replace with the result of calling the server
        const user = tweeter_shared_1.FakeData.instance.firstUser;
        if (user === null) {
            throw new Error("Invalid alias or password");
        }
        const userDto = user.dto;
        const authTokenDto = tweeter_shared_1.FakeData.instance.authToken.dto;
        return [userDto, authTokenDto];
    }
    ;
    async register(firstName, lastName, alias, password, userImageBytes, imageFileExtension) {
        // TODO: Replace with the result of calling the server
        const user = tweeter_shared_1.FakeData.instance.firstUser;
        if (user === null) {
            throw new Error("Invalid registration");
        }
        const userDto = user.dto;
        const authTokenDto = tweeter_shared_1.FakeData.instance.authToken.dto;
        return [userDto, authTokenDto];
    }
    ;
    async logout(authToken) {
        await new Promise((res) => setTimeout(res, 1000));
    }
    ;
}
exports.AuthService = AuthService;
