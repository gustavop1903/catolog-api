import { SNS, SNSClientConfig } from "@aws-sdk/client-sns";
// import { SNSClientConfig } from "@aws-sdk/client-sns/types/models";


const aws_region = process.env.AWS_REGION
const serviceKey = process.env.AWS_SERVICE_KEY
const secretKey = process.env.AWS_SECRET_KEY
const snsArn = process.env.AWS_SNS_TOPIC_ARN

function snsPublish(message: object) {
  if (!aws_region || !serviceKey || !secretKey || !snsArn) {
    throw new Error("AWS environment variables are not defined");
  }

  const snsConfig: SNSClientConfig = {
    region: aws_region,
    credentials: {
      accessKeyId: serviceKey,
      secretAccessKey: secretKey
    }
  };

  const sns = new SNS(snsConfig);

  console.log(message)
  const params = {
    Message: JSON.stringify(message),
    TopicArn: snsArn
  };

  try {
    const log = sns.publish(params)
  } catch (e) {
    console.log('err', e);
  }
}

export default snsPublish;
