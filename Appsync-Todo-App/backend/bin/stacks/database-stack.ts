import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

/**
 * Database stack containing DynamoDB tables for users and todos
 */
export class DatabaseStack extends cdk.Stack {
  public readonly usersTable: dynamodb.TableV2;
  public readonly todosTable: dynamodb.TableV2;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.usersTable = this.createUsersTable();
    this.todosTable = this.createTodosTable();
    
    this.exportValues();
  }

  private createUsersTable(): dynamodb.TableV2 {
    const table = new dynamodb.TableV2(this, "UsersTable", {
      tableName: `${this.stackName}-Users`,
      partitionKey: {
        name: "UserID",
        type: dynamodb.AttributeType.STRING,
      },
      billing: dynamodb.Billing.onDemand(),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      pointInTimeRecovery: true,
      encryption: dynamodb.TableEncryptionV2.awsManagedKey(),
      dynamoStream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
      contributorInsights: true,
      deletionProtection: false,
      tableClass: dynamodb.TableClass.STANDARD,
    });

    return table;
  }

  private createTodosTable(): dynamodb.TableV2 {
    const table = new dynamodb.TableV2(this, "TodosTable", {
      tableName: `${this.stackName}-Todos`,
      partitionKey: {
        name: "UserID",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "TodoID",
        type: dynamodb.AttributeType.STRING,
      },
      billing: dynamodb.Billing.onDemand(),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      pointInTimeRecovery: true,
      encryption: dynamodb.TableEncryptionV2.awsManagedKey(),
      dynamoStream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
      contributorInsights: true,
      deletionProtection: false,
      tableClass: dynamodb.TableClass.STANDARD,
      globalSecondaryIndexes: [
        {
          indexName: "getTodoId",
          partitionKey: {
            name: "UserID",
            type: dynamodb.AttributeType.STRING,
          },
          sortKey: {
            name: "title",
            type: dynamodb.AttributeType.STRING,
          },
          projectionType: dynamodb.ProjectionType.ALL,
        },
      ],
    });

    return table;
  }

  private exportValues(): void {
    // Users table exports
    new cdk.CfnOutput(this, "UsersTableName", {
      value: this.usersTable.tableName,
      description: "Users DynamoDB table name",
      exportName: `${this.stackName}-UsersTableName`,
    });

    new cdk.CfnOutput(this, "UsersTableArn", {
      value: this.usersTable.tableArn,
      description: "Users DynamoDB table ARN",
      exportName: `${this.stackName}-UsersTableArn`,
    });

    // Todos table exports
    new cdk.CfnOutput(this, "TodosTableName", {
      value: this.todosTable.tableName,
      description: "Todos DynamoDB table name",
      exportName: `${this.stackName}-TodosTableName`,
    });

    new cdk.CfnOutput(this, "TodosTableArn", {
      value: this.todosTable.tableArn,
      description: "Todos DynamoDB table ARN",
      exportName: `${this.stackName}-TodosTableArn`,
    });
  }
}