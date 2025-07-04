import * as cognito from "@aws-sdk/client-cognito-identity-provider";
import Chance from "chance";
import * as dotenv from "dotenv";
import {
  AWS_REGION,
  USER_POOL_CLIENT_ID,
  USER_POOL_ID,
} from "../test-constants";
const chance = new Chance();
dotenv.config();
const cognitoClient = new cognito.CognitoIdentityProviderClient({
  region: AWS_REGION,
});
export const a_random_user = () => {
  const firstName = chance.first({ nationality: "en" });
  const lastName = chance.first({ nationality: "en" });
  const name = `${firstName} ${lastName}`;
  const password = chance.string({ length: 10 });
  const email = `${firstName}-${lastName}@serverlesscreed.com`;
  return { name, password, email };
};

export const an_authenticated_user = async (): Promise<any> => {
  const { name, email, password } = a_random_user();
  const userPoolId = USER_POOL_ID;
  const clientId = USER_POOL_CLIENT_ID;
  console.log("userPoolId", userPoolId);
  console.log("clientId", clientId);

  console.log(`[${email}] - signing up...`);

  const command = new cognito.SignUpCommand({
    ClientId: clientId,
    Username: email,
    Password: password,
    UserAttributes: [{ Name: "name", Value: name }],
  });

  const signUpResponse = await cognitoClient.send(command);
  const userSub = signUpResponse.UserSub;

  console.log(`${userSub} - confirming sign up`);

  const adminCommand: cognito.AdminConfirmSignUpCommandInput = {
    UserPoolId: userPoolId as string,
    Username: userSub as string,
  };

  await cognitoClient.send(new cognito.AdminConfirmSignUpCommand(adminCommand));

  console.log(`[${email}] - confirmed sign up`);

  const authRequest: cognito.InitiateAuthCommandInput = {
    ClientId: clientId,
    AuthFlow: "USER_PASSWORD_AUTH",
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  };

  const authResponse = await cognitoClient.send(
    new cognito.InitiateAuthCommand(authRequest)
  );

  console.log(`${email} - signed in`);

  return {
    username: userSub as string,
    name,
    email,
    idToken: authResponse.AuthenticationResult?.IdToken as string,
    accessToken: authResponse.AuthenticationResult?.AccessToken as string,
  };
};
