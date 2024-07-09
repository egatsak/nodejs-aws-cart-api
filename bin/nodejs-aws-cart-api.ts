#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NodejsAwsCartApiStack } from '../lib/nodejs-aws-cart-api-stack';
import 'dotenv/config';

const app = new cdk.App();
new NodejsAwsCartApiStack(app, 'NodejsAwsCartApiStack', {
  env: { region: process.env.AWS_REGION, account: process.env.AWS_ACCOUNT },
});
