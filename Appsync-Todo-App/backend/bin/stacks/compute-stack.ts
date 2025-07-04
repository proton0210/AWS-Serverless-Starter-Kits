import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as logs from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";
import * as path from "path";

interface ComputeStackProps extends cdk.StackProps {
  usersTable: dynamodb.TableV2;
  todosTable: dynamodb.TableV2;
}

/**
 * Compute stack containing Lambda functions for AppSync resolvers and Cognito triggers
 */
export class ComputeStack extends cdk.Stack {
  // Cognito trigger function
  public readonly addUserToTableFunc: lambdaNodejs.NodejsFunction;

  // AppSync resolver functions
  public readonly createTodoFunc: lambdaNodejs.NodejsFunction;
  public readonly listTodoFunc: lambdaNodejs.NodejsFunction;
  public readonly deleteTodoFunc: lambdaNodejs.NodejsFunction;
  public readonly updateTodoFunc: lambdaNodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props: ComputeStackProps) {
    super(scope, id, props);

    // Cognito post-confirmation trigger
    this.addUserToTableFunc = this.createAddUserFunction(props);

    // AppSync resolver functions
    this.createTodoFunc = this.createTodoFunction(props);
    this.listTodoFunc = this.createListTodoFunction(props);
    this.deleteTodoFunc = this.createDeleteTodoFunction(props);
    this.updateTodoFunc = this.createUpdateTodoFunction(props);
  }

  /**
   * Common Lambda function configuration
   */
  private getCommonLambdaConfig() {
    return {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "handler",
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      logRetention: logs.RetentionDays.ONE_WEEK,
      bundling: {
        minify: true,
        sourceMap: false,
        target: "es2022",
        format: lambdaNodejs.OutputFormat.ESM,
        mainFields: ["module", "main"],
        esbuildArgs: {
          "--tree-shaking": "true",
        },
      },
      environment: {
        NODE_OPTIONS: "--enable-source-maps",
      },
    };
  }

  private createAddUserFunction(props: ComputeStackProps): lambdaNodejs.NodejsFunction {
    const func = new lambdaNodejs.NodejsFunction(this, "AddUserFunction", {
      ...this.getCommonLambdaConfig(),
      functionName: `${this.stackName}-AddUserFunction`,
      entry: path.join(__dirname, "../../functions/AddUserPostConfirmation/index.ts"),
      environment: {
        ...this.getCommonLambdaConfig().environment,
        TABLE_NAME: props.usersTable.tableName,
        AWS_REGION: this.region,
      },
      description: "Cognito post-confirmation trigger to add users to DynamoDB",
    });

    props.usersTable.grantWriteData(func);
    func.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    
    return func;
  }

  private createTodoFunction(props: ComputeStackProps): lambdaNodejs.NodejsFunction {
    const func = new lambdaNodejs.NodejsFunction(this, "CreateTodoFunction", {
      ...this.getCommonLambdaConfig(),
      functionName: `${this.stackName}-CreateTodoFunction`,
      entry: path.join(__dirname, "../../functions/createTodo/index.ts"),
      environment: {
        ...this.getCommonLambdaConfig().environment,
        TABLE_NAME: props.todosTable.tableName,
        AWS_REGION: this.region,
      },
      description: "AppSync resolver for creating todos",
    });

    props.todosTable.grantWriteData(func);
    func.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    
    return func;
  }

  private createListTodoFunction(props: ComputeStackProps): lambdaNodejs.NodejsFunction {
    const func = new lambdaNodejs.NodejsFunction(this, "ListTodoFunction", {
      ...this.getCommonLambdaConfig(),
      functionName: `${this.stackName}-ListTodoFunction`,
      entry: path.join(__dirname, "../../functions/listTodo/index.ts"),
      environment: {
        ...this.getCommonLambdaConfig().environment,
        TABLE_NAME: props.todosTable.tableName,
        AWS_REGION: this.region,
      },
      description: "AppSync resolver for listing todos",
    });

    props.todosTable.grantReadData(func);
    func.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    
    return func;
  }

  private createDeleteTodoFunction(props: ComputeStackProps): lambdaNodejs.NodejsFunction {
    const func = new lambdaNodejs.NodejsFunction(this, "DeleteTodoFunction", {
      ...this.getCommonLambdaConfig(),
      functionName: `${this.stackName}-DeleteTodoFunction`,
      entry: path.join(__dirname, "../../functions/deleteTodo/index.ts"),
      environment: {
        ...this.getCommonLambdaConfig().environment,
        TABLE_NAME: props.todosTable.tableName,
        AWS_REGION: this.region,
      },
      description: "AppSync resolver for deleting todos",
    });

    // Grant permissions for both main table and GSI
    func.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:Query", "dynamodb:DeleteItem"],
        resources: [
          props.todosTable.tableArn,
          `${props.todosTable.tableArn}/index/getTodoId`,
        ],
      })
    );
    
    func.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    
    return func;
  }

  private createUpdateTodoFunction(props: ComputeStackProps): lambdaNodejs.NodejsFunction {
    const func = new lambdaNodejs.NodejsFunction(this, "UpdateTodoFunction", {
      ...this.getCommonLambdaConfig(),
      functionName: `${this.stackName}-UpdateTodoFunction`,
      entry: path.join(__dirname, "../../functions/updateTodo/index.ts"),
      environment: {
        ...this.getCommonLambdaConfig().environment,
        TABLE_NAME: props.todosTable.tableName,
        AWS_REGION: this.region,
      },
      description: "AppSync resolver for updating todos",
    });

    // Grant permissions for both main table and GSI
    func.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:Query", "dynamodb:UpdateItem"],
        resources: [
          props.todosTable.tableArn,
          `${props.todosTable.tableArn}/index/getTodoId`,
        ],
      })
    );
    
    func.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    
    return func;
  }
}