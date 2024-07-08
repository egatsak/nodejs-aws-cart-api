import * as cdk from 'aws-cdk-lib';
import { Cors, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import {
  NodejsFunction,
  NodejsFunctionProps,
} from 'aws-cdk-lib/aws-lambda-nodejs';
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

    const cartServiceLambda = new NodejsFunction(this, 'CartServiceLambda', {
      ...sharedLambdaProps,
      entry: 'dist/main.js',
      functionName: 'cartServiceLambda',
      timeout: cdk.Duration.seconds(10),
      environment: {
        ...sharedLambdaProps.environment,
      },
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
