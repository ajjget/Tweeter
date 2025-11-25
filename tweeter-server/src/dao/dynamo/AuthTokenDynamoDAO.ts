import { randomUUID } from "crypto";
import { AuthTokenDto } from "tweeter-shared";
import { IAuthTokenDAO } from "../interfaces/IAuthTokenDAO";
import { DynamoDBDocumentClient, PutCommand, DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class AuthTokenDynamoDAO implements IAuthTokenDAO {
  private client = new DynamoDBClient({ region: "us-east-2"});
  private docClient = DynamoDBDocumentClient.from(this.client);

  public async create(alias: string): Promise<AuthTokenDto> {
    const token = randomUUID();
    const timestamp = Date.now();
    const twoHoursFromNow = timestamp + (2 * 60 * 60 * 1000);

    const params = {
      TableName: "authTokens",
      Item: {
        token: token,
        alias: alias,
        timestamp: timestamp,
        expiresAt: twoHoursFromNow
      }
    };

    await this.docClient.send(new PutCommand(params));
    
    return {
      token, 
      timestamp
    };
  }

  public async delete(token: string): Promise<void> {
    const params = {
      TableName: "authTokens",
      Key: {
        token: token
      }
    }

    await this.docClient.send(new DeleteCommand(params));
  }

  // TODO: if auth token is old, log user out and delete from DB
  public async getToken(token: string): Promise<AuthTokenDto | null> {
    const params = {
      TableName: "authTokens",
      Key: {
        token: token
      }
    }

    const result = await this.docClient.send(new GetCommand(params));

    if (!result.Item) {
      return null;
    }

    return {
      token: result.Item.token,
      timestamp: result.Item.timestamp
    };
  }
}