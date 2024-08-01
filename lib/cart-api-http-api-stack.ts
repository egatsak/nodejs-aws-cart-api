import * as cdk from 'aws-cdk-lib';
import {
  CorsHttpMethod,
  HttpApi,
  HttpMethod,
} from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpUrlIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { Construct } from 'constructs';

const ELASTIC_BEANSTALK_CART_API_URL =
  process.env.ELASTIC_BEANSTALK_CART_API_URL ??
  'http://egatsak-cart-api-development.us-east-1.elasticbeanstalk.com';

export class CartApiHttpApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const httpApi = new HttpApi(this, 'CartApiHttpApi', {
      apiName: 'CartApiHttpApi',
      corsPreflight: {
        allowHeaders: ['*'],
        allowOrigins: ['*'],
        allowMethods: [CorsHttpMethod.ANY],
      },
    });

    const integration = new HttpUrlIntegration(
      'CartApiHttpApiIntegration',
      `${ELASTIC_BEANSTALK_CART_API_URL}/{proxy}`,
    );

    httpApi.addRoutes({
      path: '/{proxy+}',
      methods: [HttpMethod.ANY],
      integration: integration,
    });

    new cdk.CfnOutput(this, 'RestApiUrl', {
      value: httpApi.apiEndpoint,
    });
  }
}
