import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { client } from "./handleImageUpload";

export async function getUserImage({ key }) {
  const bucketItemParams = {
    Bucket: process.env.GATSBY_AWS_BUCKET_NAME,
    Key: key
  }
  const command = new GetObjectCommand(bucketItemParams);

  const url = await getSignedUrl(client, command, { expiresIn: 3600 });
  return url;
};