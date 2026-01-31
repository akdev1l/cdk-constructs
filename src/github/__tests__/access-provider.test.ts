import { App, Stack } from 'aws-cdk-lib';
import { GithubAccessProvider } from '../access-provider';
import { describe, it, expect } from '@jest/globals';

describe('Github Access Provider', () => {
  const app = new App();
  const stack = new Stack(app, 'stack', {});

  it('can build access provider', () => {
    const githubProvider = new GithubAccessProvider(stack, 'GithubProvider', {
      repo: 'akdev1l/cdk-constructs',
    });

    expect(githubProvider).not.toBeNull();
    expect(githubProvider.provider).not.toBeNull();
    expect(githubProvider.role).not.toBeNull();
  });
});
