import { IDAOFactory } from "../dao/IDAOFactory";
import { IAuthTokenDAO } from "../dao/interfaces/IAuthTokenDAO";
import { IS3DAO } from "../dao/interfaces/IS3DAO";
import { IStatusDAO } from "../dao/interfaces/IStatusDAO";
import { IUserDAO } from "../dao/interfaces/IUserDAO";

export abstract class Service {
  protected userDAO: IUserDAO;
  protected s3DAO: IS3DAO;
  protected authTokenDAO: IAuthTokenDAO;
  protected statusDAO: IStatusDAO;

  constructor(factory: IDAOFactory) {
    this.userDAO = factory.createUserDAO();
    this.s3DAO = factory.createS3DAO();
    this.authTokenDAO = factory.createAuthTokenDAO();
    this.statusDAO = factory.createStatusDAO();
  }

  protected async authorize(token: string): Promise<void> {
    const authToken = await this.authTokenDAO.getToken(token);

    if (authToken == null) {
      throw new Error("User is unauthorized: no token was found in DB");
    }

    const now = Date.now();
    const twoHours = 2 * 60 * 60 * 1000;

    if (now - authToken.timestamp > twoHours) {
      await this.authTokenDAO.delete(token);
      throw new Error("Auth key is expired... logging out...");
    }
  }
}