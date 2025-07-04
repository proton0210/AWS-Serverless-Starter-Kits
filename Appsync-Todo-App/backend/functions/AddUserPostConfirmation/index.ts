// 909869235307
//OrganizationAccountAccessRole
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { PostConfirmationConfirmSignUpTriggerEvent } from "aws-lambda";
import { marshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION!,
});

exports.handler = async function (
  event: PostConfirmationConfirmSignUpTriggerEvent
): Promise<PostConfirmationConfirmSignUpTriggerEvent> {
  console.log(event, "event");
  const date = new Date();
  const isoDate = date.toISOString();

  const params = {
    TableName: "Users",
    Item: marshall({
      UserID: event.request.userAttributes.sub,
      Email: event.request.userAttributes.email,
      Name: event.request.userAttributes.name,
      CreateAt: isoDate,
      __typename: "User",
    }),
  };

  try {
    await client.send(new PutItemCommand(params));
  } catch (error: any) {
    console.log(error);
  }

  return event;
};
