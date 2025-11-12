export { Follow } from "./model/domain/Follow";
export { PostSegment, Type } from "./model/domain/PostSegment";
export { Status } from "./model/domain/Status";
export { User } from "./model/domain/User";
export { AuthToken } from "./model/domain/AuthToken";

// All classes that should be avaialble to other modules need to exported here. export * does not work when 
// uploading to lambda. Instead we have to list each export.


//
// DTOs
//

export type { UserDto } from "./model/dto/UserDto";
export type { AuthTokenDto } from "./model/dto/AuthTokenDto"
export type { StatusDto } from "./model/dto/StatusDto";

//
// Requests
//
export type { TweeterRequest } from "./model/net/request/TweeterRequest";
export type { PagedUserItemRequest } from "./model/net/request/follow/PagedUserItemRequest";
export type { PagedStatusItemRequest } from "./model/net/request/status/PagedStatusItemRequest";
export type { PostStatusRequest } from "./model/net/request/status/PostStatusRequest";
export type { LoginRequest } from "./model/net/request/auth/LoginRequest";
export type { RegisterRequest } from "./model/net/request/auth/RegisterRequest";
export type { LogoutRequest } from "./model/net/request/auth/LogoutRequest";
export type { FollowActionRequest } from "./model/net/request/user/FollowActionRequest";
export type { GetIsFollowerStatusRequest } from "./model/net/request/user/GetIsFollowerStatusRequest";
export type { GetUserRequest } from "./model/net/request/user/GetUserRequest";

//
// Responses
//
export type { TweeterResponse } from "./model/net/response/TweeterResponse";
export type { PagedUserItemResponse } from "./model/net/response/PagedUserItemResponse";
export type { PagedStatusItemResponse } from "./model/net/response/PagedStatusItemResponse";
export type { AuthResponse } from "./model/net/response/auth/AuthResponse";
export type { GetFollowCountResponse } from "./model/net/response/user/GetFollowCountResponse";
export type { GetIsFollowerStatusResponse } from "./model/net/response/user/GetIsFollowerStatusResponse";
export type { GetUserResponse } from "./model/net/response/user/GetUserResponse";
export type { SetFollowStatusResponse } from "./model/net/response/user/SetFollowStatusResponse";

// 
// Other
//

export { FakeData } from "./util/FakeData";