import { S3 } from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda';

const s3 = new S3();
const bucketName = process.env.BUCKET_NAME || '';
const region = process.env.AWS_REGION || 'ap-northeast-1';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { filename, contentType } = body;

    if (!filename || !contentType) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'filename と contentType は必須です' }),
      };
    }

    const params = {
      Bucket: bucketName,
      Key: filename,
      ContentType: contentType,
      Expires: 60 * 5,
    };

    const uploadUrl = await s3.getSignedUrlPromise('putObject', params);

    const objectUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${filename}`;

    return {
      statusCode: 200,
      body: JSON.stringify({ uploadUrl, objectUrl }),
    };
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: '署名付きURLの生成に失敗しました' }),
    };
  }
};
