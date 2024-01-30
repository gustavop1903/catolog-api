import AWS from "aws-sdk";

const aws_region = process.env.AWS_REGION
const secretKey = process.env.AWS_SECRET_KEY
const snsArn = process.env.AWS_SNS_TOPIC_ARN
const serviceKey = process.env.AWS_SERVICE_KEY

AWS.config.update({
  accessKeyId: serviceKey,
  secretAccessKey: secretKey,
  region: aws_region
});


function snsPublish(message: object) {
  const sns = new AWS.SNS();
  const params = {
    Message: JSON.stringify(message),
    TopicArn: snsArn
  };
  try {
    sns.publish(params)
  } catch (e) {
    console.log(e);

  }
}

export default snsPublish;