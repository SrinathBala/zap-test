#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DockerTestStack } from '../lib/docker-test-stack';

const app = new cdk.App();
new DockerTestStack(app, 'DockerTestStack', {
  env: {
    account: '432056661658',
    region: 'eu-central-1',
  },});