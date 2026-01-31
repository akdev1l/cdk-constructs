import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { Construct } from 'constructs';

export interface SinglePageApplicationProps {
  package: string;
}

export class SinglePageApplication extends Construct {
  readonly bucket: s3.Bucket;
  readonly deployment: s3deploy.BucketDeployment;
  readonly cdn: cloudfront.CloudFrontWebDistribution;

  constructor(scope: Construct, id: string, props: SinglePageApplicationProps) {
    super(scope, id);

    // Create an S3 bucket for hosting the SPA
    this.bucket = new s3.Bucket(this, 'DeploymentBucket', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html',
      publicReadAccess: false, // Allow public access to the files
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Automatically delete bucket when stack is deleted
    });

    // Deploy the SPA files from the installed npm package to S3
    this.deployment = new s3deploy.BucketDeployment(this, 'Deployment', {
      sources: [s3deploy.Source.asset(`./node_modules/${props.package}/build`)], // Path to the built SPA files
      destinationBucket: this.bucket,
    });

    const oai = new cloudfront.OriginAccessIdentity(this, 'OriginAccessIdentity', {
      comment: 'OAI for accessing the S3 bucket securely',
    });
    // Create a CloudFront distribution for CDN
    this.cdn = new cloudfront.CloudFrontWebDistribution(this, 'ContentDeliveryNetwork', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: this.bucket,
            originAccessIdentity: oai,
          },
          behaviors: [
            {
              isDefaultBehavior: true,
            },
          ],
        },
      ],
    });
  }
}

