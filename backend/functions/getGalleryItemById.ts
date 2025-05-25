import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyHandler } from 'aws-lambda'

const dynamoDb = new DynamoDB.DocumentClient()
const tableName = process.env.TABLE_NAME || ''

export const handler: APIGatewayProxyHandler = async (event) => {
  const id = event.pathParameters?.id

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'ID is required' }),
    }
  }

  try {
    const result = await dynamoDb.get({
      TableName: tableName,
      Key: { id },
    }).promise()

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Item not found' }),
      }
    }

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(result.Item),
    }
  } catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to get item' }),
    }
  }
}
