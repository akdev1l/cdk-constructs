import {
  Duration,
  aws_iam as iam,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface GithubAccessProviderProps {
  repo: string;
}

export class GithubAccessProvider extends Construct {
  private static GITHUB_DOMAIN = 'token.actions.githubusercontent.com';

  readonly provider: iam.OpenIdConnectProvider;
  readonly role: iam.Role;

  constructor(scope: Construct, id: string, props: GithubAccessProviderProps) {
    super(scope, id);

    this.provider = new iam.OpenIdConnectProvider(this, 'GithubActionsProvider', {
      url: `https://${GithubAccessProvider.GITHUB_DOMAIN}`,
      clientIds: ['sts.amazonaws.com'],
    });

    const conditions: iam.Conditions = {
      StringLike: {
        [`${GithubAccessProvider.GITHUB_DOMAIN}:sub`]: `repo:${props.repo}`,
      },
      StringEquals: {
        'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
      },
    };

    this.role = new iam.Role(this, 'GithubActionsRole', {
      roleName: 'GithubActions',
      assumedBy: new iam.WebIdentityPrincipal(this.provider.openIdConnectProviderArn, conditions),
      description: `Access for deployment from repo ${props.repo}`,
      maxSessionDuration: Duration.hours(2),
    });
    this.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'));
  }
}
