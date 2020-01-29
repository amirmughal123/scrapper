import AWS from 'aws-sdk';
import appConfig from '../configurations/appConfig';
const AWS_CREDENTIALS = appConfig.AWS_CREDENTIALS;

AWS.config.update({
  accessKeyId: AWS_CREDENTIALS.ACCESS_KEY,
  secretAccessKey: AWS_CREDENTIALS.SECRET_KEY,
  region: AWS_CREDENTIALS.REGION
});

const s3 = new AWS.S3();

const imageUploadToS3 = (buffer, name, acl) => {
  const params = {
    ACL: acl,
    Body: buffer,
    Bucket: AWS_CREDENTIALS.BUCKET,
    ContentType: 'image/png',
    Key: `${name}.${'jpeg'}`
  };

  return new Promise ((resolve, reject) => {
    s3.upload(params, function (err, data) {
      if (err) {
        reject(err);
      }
      //success
      if (data) {
        resolve(data);
      }
    });
  });
};

module.exports = { imageUploadToS3 };
