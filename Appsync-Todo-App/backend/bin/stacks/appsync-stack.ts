import * as cdk from "aws-cdk-lib";
import * as appsync from "aws-cdk-lib/aws-appsync";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "path";

interface AppsyncStackProps extends cdk.StackProps {
  userPool: cognito.UserPool;
  createTodoFunc: lambda.NodejsFunction;
  listTodoFunc: lambda.NodejsFunction;
  deleteTodoFunc: lambda.NodejsFunction;
  updateTodoFunc: lambda.NodejsFunction;
}

/**
 * AWS AppSync GraphQL API Stack with Cognito authentication and Lambda resolvers
 */
export class AppsyncStack extends cdk.Stack {
  public readonly api: appsync.GraphqlApi;
  
  constructor(scope: Construct, id: string, props: AppsyncStackProps) {
    super(scope, id, props);
    
    this.api = this.createAppsyncApi(props);
    this.createResolvers(props);
    this.exportValues();
  }
  private createAppsyncApi(props: AppsyncStackProps): appsync.GraphqlApi {
    const api = new appsync.GraphqlApi(this, "TodoAppyncApi", {
      name: "TodoAppsyncApi",
      definition: appsync.Definition.fromFile(
        path.join(__dirname, "../graphql/schema.graphql")
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool: props.userPool,
          },
        },
        // Allow IAM for service-to-service calls
        additionalAuthorizationModes: [
          {
            authorizationType: appsync.AuthorizationType.IAM,
          },
        ],
      },
      logConfig: {
        fieldLogLevel: appsync.FieldLogLevel.ALL,
        excludeVerboseContent: false,
      },
      xrayEnabled: true,
    });
    
    return api;
  }
  
  private createResolvers(props: AppsyncStackProps): void {
    const resolverConfigs = [
      {
        dataSourceName: "CreateTodoDataSource",
        resolverName: "CreateTodoResolver",
        lambdaFunction: props.createTodoFunc,
        typeName: "Mutation",
        fieldName: "createTodo",
      },
      {
        dataSourceName: "ListTodoDataSource",
        resolverName: "ListTodoResolver",
        lambdaFunction: props.listTodoFunc,
        typeName: "Query",
        fieldName: "listTodos",
      },
      {
        dataSourceName: "DeleteTodoDataSource",
        resolverName: "DeleteTodoResolver",
        lambdaFunction: props.deleteTodoFunc,
        typeName: "Mutation",
        fieldName: "deleteTodo",
      },
      {
        dataSourceName: "UpdateTodoDataSource",
        resolverName: "UpdateTodoResolver",
        lambdaFunction: props.updateTodoFunc,
        typeName: "Mutation",
        fieldName: "updateTodo",
      },
    ];
    
    resolverConfigs.forEach(config => {
      const dataSource = this.api.addLambdaDataSource(
        config.dataSourceName,
        config.lambdaFunction
      );
      
      dataSource.createResolver(config.resolverName, {
        typeName: config.typeName,
        fieldName: config.fieldName,
      });
    });
  }
  
  private exportValues(): void {
    new cdk.CfnOutput(this, "GraphQLAPIURL", {
      value: this.api.graphqlUrl,
      description: "GraphQL API endpoint URL",
      exportName: `${this.stackName}-GraphQLAPIURL`,
    });
    
    new cdk.CfnOutput(this, "GraphQLAPIId", {
      value: this.api.apiId,
      description: "GraphQL API ID",
      exportName: `${this.stackName}-GraphQLAPIId`,
    });
  }
}
