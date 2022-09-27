import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

export const client = new S3Client({
  region: process.env.GATSBY_AWS_S3_REGION,
  credentials: fromCognitoIdentityPool({
    clientConfig: { region: process.env.GATSBY_AWS_S3_REGION },
    identityPoolId: process.env.GATSBY_AWS_IDENTITY_POOL_ID,
    logins: {}
  })
})

// Upload file to specified bucket.
export async function handleImageUpload({ email, photo }) {
  const uploadParams = {
    Bucket: process.env.GATSBY_AWS_BUCKET_NAME,
    Key: email + "/" + photo.name,
    Body: photo,
  };

  const data = await client.send(new PutObjectCommand(uploadParams));
  return data;
};