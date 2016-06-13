'use strict';

const expect = require('chai').expect;
const AwsCompileApigEvents = require('../awsCompileApigEvents');
const Serverless = require('../../../Serverless');

describe('#compileStage()', () => {
  let serverless;
  let awsCompileApigEvents;

  const serviceResourcesAwsResourcesObjectMock = {
    Resources: {
      Type: 'AWS::ApiGateway::Stage',
      Properties: {
        DeploymentId: { Ref: 'helloDeploymentApigEvent' },
        RestApiId: { Ref: 'helloRestApiApigEvent' },
        StageName: 'dev',
      },
    },
  };

  beforeEach(() => {
    serverless = new Serverless();
    serverless.init();
    serverless.service.resources = { aws: { Resources: {} } };
    const options = {
      stage: 'dev',
      region: 'us-east-1',
    };
    awsCompileApigEvents = new AwsCompileApigEvents(serverless, options);
    awsCompileApigEvents.serverless.service.functions = {
      hello: {
        events: {
          aws: {
            http_endpoint: {
              post: 'foo/bar',
            },
          },
        },
      },
    };
  });

  it('should create a stage resource', () => {
    awsCompileApigEvents.compileStage().then(() => {
      expect(JSON.strigify(awsCompileApigEvents.serverless.service.resources.aws.Resources))
        .to.equal(JSON.stringify(serviceResourcesAwsResourcesObjectMock.Resources));
    });
  });
});
