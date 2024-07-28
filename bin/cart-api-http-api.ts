#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CartApiHttpApiStack } from '../lib/cart-api-http-api-stack';
import 'dotenv/config';

const app = new cdk.App();

new CartApiHttpApiStack(app, 'CartApiHttpApiStack', {
  env: { region: process.env.AWS_REGION },
});

app.synth();
