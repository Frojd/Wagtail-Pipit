# Adding Slack notifications to CircleCI

This boilerplate comes ready made with a CircleCI slack notification using the CircleCI [slack orb](https://github.com/CircleCI-Public/slack-orb) (*Orb is just a fancy name for a CircleCI application*), but you need to create a Slack app and provide access information before you can use it.

## Requirements
- You have properly added your repo to Circle CI by following the guide [Setting up deployment on CircleCI](./setting-up-deployment-with-circleci.md)
- A Slack workspace and the permissions to create apps
- A Slack channel where you want to post your notifications

## Guide
- Create a slack app following by following [this guide](https://github.com/CircleCI-Public/slack-orb/wiki/Setup)
    - Name your app "CircleCI-Bot"
- Create a CircleCI context called "CIRCLECI_BOT"
    - Provide your access token to the variable `SLACK_ACCESS_TOKEN`
- Create a regular environment variable in Circle CI for your channel
    - Name the variable `SLACK_DEFAULT_CHANNEL` and provide the id for your channel (*you can get it by right-clicking the channel, click on copy link then fetch the last part, example `https://frojd.slack.com/archives/<MY_CANNEL_ID>, <MY_CANNEL_ID> is the value your want`*)
- Done
