import * as cdk from "aws-cdk-lib";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

interface AuthStackProps extends cdk.StackProps {
  addUserPostConfirmation: lambda.NodejsFunction;
}

/**
 * Authentication stack using AWS Cognito
 */
export class AuthStack extends cdk.Stack {
  public readonly userPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;

  constructor(scope: Construct, id: string, props: AuthStackProps) {
    super(scope, id, props);

    this.userPool = this.createUserPool(props);
    this.userPoolClient = this.createUserPoolClient();
    this.exportValues();
  }
  private createUserPool(props: AuthStackProps): cognito.UserPool {
    const userPool = new cognito.UserPool(this, "TodoUserPool", {
      userPoolName: `${this.stackName}-UserPool`,
      selfSignUpEnabled: true,
      autoVerify: {
        email: true,
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false,
      },
      signInAliases: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
      customAttributes: {
        name: new cognito.StringAttribute({
          minLen: 3,
          maxLen: 50,
          mutable: true,
        }),
      },
      lambdaTriggers: {
        postConfirmation: props.addUserPostConfirmation,
      },
      // Account recovery settings
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      // Deletion protection
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Apply removal policy
    userPool.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    return userPool;
  }

  private createUserPoolClient(): cognito.UserPoolClient {
    const client = new cognito.UserPoolClient(this, "TodoUserPoolClient", {
      userPool: this.userPool,
      userPoolClientName: `${this.stackName}-WebClient`,
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
      generateSecret: false,
      refreshTokenValidity: cdk.Duration.days(30),
      accessTokenValidity: cdk.Duration.hours(1),
      idTokenValidity: cdk.Duration.hours(1),
      preventUserExistenceErrors: true,
    });

    return client;
  }

  private exportValues(): void {
    new cdk.CfnOutput(this, "UserPoolId", {
      value: this.userPool.userPoolId,
      description: "Cognito User Pool ID",
      exportName: `${this.stackName}-UserPoolId`,
    });

    new cdk.CfnOutput(this, "UserPoolClientId", {
      value: this.userPoolClient.userPoolClientId,
      description: "Cognito User Pool Client ID",
      exportName: `${this.stackName}-UserPoolClientId`,
    });

    new cdk.CfnOutput(this, "UserPoolArn", {
      value: this.userPool.userPoolArn,
      description: "Cognito User Pool ARN",
      exportName: `${this.stackName}-UserPoolArn`,
    });
  }
}
