import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyHandler } from 'aws-lambda'
import { v4 as uuidv4 } from 'uuid'

const dynamoDb = new DynamoDB.DocumentClient()
const tableName = process.env.TABLE_NAME || ''

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}')
    const { title, imageUrl, tags, message } = body

    if (!title || !imageUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'title と imageUrl は必須です' }),
      }
    }

    const item = {
      id: uuidv4(), 
      title,
      imageUrl,
      tags: tags || [],
      message,
      createdAt: new Date().toISOString(),
    }

    await dynamoDb.put({
      TableName: tableName,
      Item: item,
    }).promise()

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Gallery item saved successfully!' }),
    }
  } catch (error) {
    console.error('Error saving gallery item:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: '保存に失敗しました。後ほど再試行してください。' }),
    }
  }
}
