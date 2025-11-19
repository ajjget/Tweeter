import { AuthTokenDAO } from "./concrete/AuthTokenDAO";
import { S3DAO } from "./concrete/S3DAO";
import { StatusDAO } from "./concrete/StatusDAO";
import { UserDAO } from "./concrete/UserDAO";
import { IDAOFactory } from "./IDAOFactory";
import { IAuthTokenDAO } from "./interfaces/IAuthTokenDAO";
import { IS3DAO } from "./interfaces/IS3DAO";
import { IStatusDAO } from "./interfaces/IStatusDAO";

export class DAOFactory implements IDAOFactory {
  createS3DAO(): IS3DAO {
    return new S3DAO;
  }
  createAuthTokenDAO(): IAuthTokenDAO {
    return new AuthTokenDAO;
  }
  createStatusDAO(): IStatusDAO {
    return new StatusDAO;
  }
  createUserDAO(): UserDAO {
    return new UserDAO;
  }
}