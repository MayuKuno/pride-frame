import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyHandler } from 'aws-lambda'

const dynamoDb = new DynamoDB.DocumentClient()
const tableName = process.env.TABLE_NAME || ''

export const handler: APIGatewayProxyHandler = async () => {
  try {
    const result = await dynamoDb.scan({ TableName: tableName }).promise()
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(result.Items),
    }
  } catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: 'Failed to fetch gallery items' }),
    }
  }
}
