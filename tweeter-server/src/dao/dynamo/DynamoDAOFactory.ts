import { AuthTokenDynamoDAO } from "./AuthTokenDynamoDAO";
import { S3DynamoDAO } from "./S3DynamoDAO";
import { StatusDynamoDAO } from "./StatusDynamoDAO";
import { UserDynamoDAO } from "./UserDynamoDAO";
import { IDAOFactory } from "../IDAOFactory";
import { IAuthTokenDAO } from "../interfaces/IAuthTokenDAO";
import { IS3DAO } from "../interfaces/IS3DAO";
import { IStatusDAO } from "../interfaces/IStatusDAO";

export class DynamoDAOFactory implements IDAOFactory {
  createS3DAO(): IS3DAO {
    return new S3DynamoDAO;
  }
  createAuthTokenDAO(): IAuthTokenDAO {
    return new AuthTokenDynamoDAO;
  }
  createStatusDAO(): IStatusDAO {
    return new StatusDynamoDAO;
  }
  createUserDAO(): UserDynamoDAO {
    return new UserDynamoDAO;
  }
}