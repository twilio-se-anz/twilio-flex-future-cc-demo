---
sidebar_label: Install the template
sidebar_position: 0
title: Install the template on hosted Flex
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

Time to complete: _~8 minutes_

:::info INFO

These steps require Flex UI version 2.x to be configured on your Flex account.

:::

1. [Fork the repository](https://github.com/twilio-se-anz/twilio-flex-future-cc-demo/fork)
   - _NOTE_ If you are on the free GitHub tier, the repository will need to be public. If you are on the free tier and still want to use a private repo you will need to clone the deploy script to have dedicated secrets per environment
1. [Create a Twilio API key and secret](https://www.twilio.com/docs/glossary/what-is-an-api-key#how-can-i-create-api-keys) for your account, which we will use in the next step.
1. In GitHub, navigate to the repository you created in step 1, click the Settings tab -> Environments -> "New Environment"

   - For the environment name, do not include spaces or other special characters except hyphens and underscores
   - Add the following secrets for that environment:
     - `TWILIO_ACCOUNT_SID` - the account sid you want to deploy to
     - `TWILIO_API_KEY` - the api key or key "sid" as its otherwise known
     - `TWILIO_API_SECRET` - the api secret
     - `TF_ENCRYPTION_KEY` - this can be any string value you want
     - `SEGMENT_SPACE_ID`- Twilio Segment's Unify Space ID
     - `SEGMENT_API_ACCESS_TOKEN` - Twilio Segment's Unify API Access Token
     - `SEGMENT_WRITE_KEY` - Twilio Segment's Connections (Javascript) Write Key
     - `OPENAI_API_KEY` - OpenAI API Key
   - your environment secrets should look something like this (TF_ENCRYPTION_KEY can be a repo or environment secret)
     ![image](/img/guides/github-secrets.png)

1. Log in to Flex, open the admin panel, and validate Flex UI 2.x is the configured version.
1. Navigate over to GitHub actions of your repository and select the `Deploy Flex` action script, _select the environment_ you want to deploy, and check the boxes for
   - `Is this the first release to the environment?`
   - `Deploy Terraform?` (as _cautioned_ below)

:::danger Important!
These deploy steps will set up TaskRouter and Studio configuration to allow more complex features to work out-of-the-box. The following resources will be completely replaced and overwritten when selecting the `Deploy Terraform?` option:

<details><summary>TaskRouter resources affected</summary>

<Tabs>

<TabItem value="workflows" label="Workflows" default>

| Name             | Existing or New | Description                                   |
| ---------------- | --------------- | --------------------------------------------- |
| Assign To Anyone | Existing        | No modifications from out-of-box Flex version |

</TabItem>

<TabItem value="queues" label="Task Queues" >

| Name     | Existing or New | Description                                   |
| -------- | --------------- | --------------------------------------------- |
| Everyone | Existing        | No modifications from out-of-box Flex version |

</TabItem>

<TabItem value="activities" label="Activities" >

| Name        | Existing or New | Description                                   |
| ----------- | --------------- | --------------------------------------------- |
| Offline     | Existing        | No modifications from out-of-box Flex version |
| Available   | Existing        | No modifications from out-of-box Flex version |
| Unavailable | Existing        | No modifications from out-of-box Flex version |
| Break       | Existing        | No modifications from out-of-box Flex version |

</TabItem>

<TabItem value="channels" label="Task Channels" >

| Name  | Existing or New | Description                                   |
| ----- | --------------- | --------------------------------------------- |
| Voice | Existing        | No modifications from out-of-box Flex version |
| Chat  | Existing        | No modifications from out-of-box Flex version |

</TabItem>

</Tabs>
</details>

<details><summary>Studio resources affected</summary>

| Name      | Existing or New | Description                                               |
| --------- | --------------- | --------------------------------------------------------- |
| Chat Flow | Existing        | Modified to include email parameters into task attributes |

</details>

If you have customizations within these resources and do not want to overwrite any changes, uncheck the `Deploy Terraform?` input box.

![image](/img/guides/github-trigger.png)

Unchecking this means features mentioned in the resource descriptions above will need manual setup, which can be found in the respective feature's documentation.

:::

7. Run the workflow.
   - This will deploy the assets to your environment with the all features enabled. See [Feature library Information](/feature-library/overview) for further details of whats enabled by default.
   - Environment properties will be automatically populated based on the deployed Flex configuration, including service and workflow SIDs.

All done! Once the workflow successfully completes, the template has been installed.
