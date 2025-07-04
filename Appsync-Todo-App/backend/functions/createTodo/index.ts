import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { AppSyncResolverEvent } from "aws-lambda";
import { ulid } from "ulid";
const client = new DynamoDBClient({
  region: process.env.AWS_REGION!,
});
const TABLE_NAME = process.env.TABLE_NAME!;
export const handler = async (event: AppSyncResolverEvent<any>) => {
  console.log(JSON.stringify(event, null, 2));
  const { UserID, title } = event.arguments.input;
  const TodoID = ulid();
  const params: PutItemCommandInput = {
    TableName: TABLE_NAME,
    Item: marshall({
      UserID,
      TodoID,
      title,
      completed: false,
    }),
  };
  try {
    await client.send(new PutItemCommand(params));
    return {
      UserID,
      TodoID,
      title,
      completed: false,
    };
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
