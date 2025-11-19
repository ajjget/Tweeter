import { DAOFactory } from "../dao/DAOFactory";
import { AuthService } from "../service/AuthService";
import { FollowService } from "../service/FollowService";
import { StatusService } from "../service/StatusService";
import { UserService } from "../service/UserService";

const factory = new DAOFactory();

export const services = {
  authService: new AuthService(factory),
  statusService: new StatusService(factory),
  userService: new UserService(factory),
  followService: new FollowService(factory)
}