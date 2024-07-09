import * as cdk from 'aws-cdk-lib';
import { Cors, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  Peer,
  Port,
  SecurityGroup,
  Vpc,
} from 'aws-cdk-lib/aws-ec2';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import {
  NodejsFunction,
  NodejsFunctionProps,
} from 'aws-cdk-lib/aws-lambda-nodejs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import {
  Credentials,
  DatabaseInstance,
  DatabaseInstanceEngine,
  NetworkType,
  PostgresEngineVersion,
  StorageType,
  SubnetGroup,
} from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';

const sharedLambdaProps: NodejsFunctionProps = {
  runtime: Runtime.NODEJS_20_X,
  environment: {
    PRODUCT_AWS_REGION: process.env.AWS_REGION ?? 'us-east-1',
  },
};

export class NodejsAwsCartApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pgPort = process.env.POSTGRES_PORT
      ? Number(process.env.POSTGRES_PORT)
      : 5432;
    const pgUser = process.env.POSTGRES_USER ?? '';
    const pgPassword = process.env.POSTGRES_PASSWORD ?? '';
    const dbName = process.env.POSTGRES_DB ?? '';
    const pgHost = process.env.POSTGRES_HOST ?? '';

    const vpc = Vpc.fromLookup(this, 'DefaultVpc', {
      isDefault: true,
    });

    const pgSecurityGroup = new SecurityGroup(this, 'PostgresSecurityGroup', {
      vpc: vpc,
    });

    pgSecurityGroup.addIngressRule(
      Peer.anyIpv4(),
      Port.tcp(pgPort),
      `Allow ${pgPort} access from any IP`,
    );

    const pgSubnetGroup = new SubnetGroup(this, 'PostgresSubnetGroup', {
      description: 'Subnet group for cart database',
      vpc: vpc,
      vpcSubnets: {
        subnets: vpc.publicSubnets,
      },
    });

    const postgresInstance = new DatabaseInstance(this, 'PostgreSQLInstance', {
      engine: DatabaseInstanceEngine.postgres({
        version: PostgresEngineVersion.VER_16,
      }),
      instanceType: InstanceType.of(
        // InstanceClass.BURSTABLE3,
        InstanceClass.T3,
        InstanceSize.MICRO,
      ),
      databaseName: dbName,
      storageType: StorageType.GP2,
      allocatedStorage: 20,
      networkType: NetworkType.IPV4,
      publiclyAccessible: true,
      vpc: vpc,
      securityGroups: [pgSecurityGroup],
      subnetGroup: pgSubnetGroup,
      multiAz: false,
      backupRetention: cdk.Duration.seconds(0),
      cloudwatchLogsRetention: RetentionDays.ONE_DAY,
      deletionProtection: false,
      storageEncrypted: false,
      credentials: Credentials.fromPassword(
        pgUser,
        cdk.SecretValue.unsafePlainText(pgPassword),
      ),
      allowMajorVersionUpgrade: false,
      autoMinorVersionUpgrade: false,
    });

    const DATABASE_URL = `postgresql://${pgUser}:${pgPassword}@${pgHost}:${pgPort}/${dbName}`;

    const cartServiceLambda = new NodejsFunction(this, 'CartServiceLambda', {
      ...sharedLambdaProps,
      entry: 'dist/main.js',
      functionName: 'cartServiceLambda',
      timeout: cdk.Duration.seconds(10),
      environment: {
        ...sharedLambdaProps.environment,
        DATABASE_URL: DATABASE_URL,
      },
      vpc: vpc,
      allowPublicSubnet: true,
    });

    const restApi = new RestApi(this, 'CartServiceApiGateway', {
      restApiName: 'CartServiceApi',
      deployOptions: {
        stageName: 'dev',
      },
    });

    restApi.root
      .addResource('{proxy+}', {
        defaultCorsPreflightOptions: {
          allowOrigins: Cors.ALL_ORIGINS,
          allowHeaders: Cors.DEFAULT_HEADERS,
          allowMethods: Cors.ALL_METHODS,
        },
      })
      .addMethod('ANY', new LambdaIntegration(cartServiceLambda));

    new cdk.CfnOutput(this, 'LambdaArn', {
      value: cartServiceLambda.functionArn,
    });

    new cdk.CfnOutput(this, 'RestApiUrl', {
      value: restApi.url,
    });
  }
}
