import * as cdk from 'aws-cdk-lib';
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

    new cdk.CfnOutput(this, 'Lambda', {
      value: cartServiceLambda.functionArn,
    });
  }
}
