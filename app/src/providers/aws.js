import AWS from 'aws-sdk';

import config from '../config';

AWS.config.region = 'us-west-2';
AWS.config.update({
  Bucket: config.S3_BUCKET_NAME,
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY
});


const s3bucket = new AWS.S3();

export default s3bucket;
