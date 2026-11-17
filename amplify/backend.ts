
import { defineBackend } from "@aws-amplify/backend";
import { data } from "./data/resource";
import { auth } from "./auth/resource";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

const backend = defineBackend({
  auth,
  data,
});

const bedrockDataSource =
  backend.data.resources.graphqlApi.addHttpDataSource(
    "bedrockDS",
    "https://bedrock-runtime.us-east-2.amazonaws.com",
    {
      authorizationConfig: {
        signingRegion: "us-east-2",
        signingServiceName: "bedrock",
      },
    }
  );

bedrockDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    actions: ["bedrock:InvokeModel"],
    resources: [
      "arn:aws:bedrock:us-east-2:573992724432:inference-profile/global.amazon.nova-2-lite-v1:0",
      "arn:aws:bedrock:*::foundation-model/*",
    ],
  })
);
