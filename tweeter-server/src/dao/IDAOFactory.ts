import { IAuthTokenDAO } from "./interfaces/IAuthTokenDAO";
import { IStatusDAO } from "./interfaces/IStatusDAO";
import { IUserDAO } from "./interfaces/IUserDAO";
import { IS3DAO } from "./interfaces/IS3DAO";

export interface IDAOFactory {
  createUserDAO(): IUserDAO;
  createS3DAO(): IS3DAO;
  createAuthTokenDAO(): IAuthTokenDAO;
  createStatusDAO(): IStatusDAO;
}