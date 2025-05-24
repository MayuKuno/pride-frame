import AWS from 'aws-sdk'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import fetch from 'node-fetch'

// npx tsx add-default-frame.ts

const API_BASE_URL = ''
const AWS_BUCKET_NAME = ''
const AWS_REGION = 'ap-northeast-1'

AWS.config.update({ region: AWS_REGION })
const s3 = new AWS.S3()

const localFrames = [
  {
    title: '#PRIDE',
    file: '1.png',
    tags: ['pride', 'LGBTQ+'],
    message: 'Celebrate love, diversity, and being unapologetically yourself. 🌈',
  },
  {
    title: 'I Support',
    file: '2.png',
    tags: ['LGBTQ+', 'ally'],
    message: 'I stand with the LGBTQ+ community — always and proudly.',
  },
  {
    title: 'Trans rights are human rights',
    file: '3.png',
    tags: ['trans'],
    message: 'Trans lives matter. Your identity is valid and powerful.',
  },
  {
    title: 'Ally',
    file: '4.png',
    tags: ['LGBTQ', 'ally'],
    message: 'Together, we build a world of acceptance and love.',
  },
  {
    title: 'I support - square',
    file: '5.png',
    tags: ['LGBTQ', 'ally'],
    message: 'Every voice of support matters. Let’s uplift each other.',
  },
  {
    title: '#lovewins',
    file: '6.png',
    tags: ['lovewins'],
    message: 'Love always wins. Keep shining with pride. 💖',
  },
  {
    title: '#PRIDE - square',
    file: '7.png',
    tags: ['pride', 'LGBTQ+'],
    message: 'Pride is a celebration, a protest, and a promise of progress.',
  },
  {
    title: '#lovewins - square',
    file: '8.png',
    tags: ['lovewins'],
    message: 'Share your joy. Share your pride. Share your love.',
  },
]

async function uploadToS3(localPath: string, key: string): Promise<string> {
  const fileContent = fs.readFileSync(localPath)

  await s3
    .putObject({
      Bucket: AWS_BUCKET_NAME,
      Key: key,
      Body: fileContent,
      ContentType: 'image/png',
    })
    .promise()

  return `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`
}

async function registerGalleryItems() {
  for (const frame of localFrames) {
    try {
      const key = `${uuidv4()}.png`
      const localPath = path.resolve('public', 'frames', frame.file)

      const imageUrl = await uploadToS3(localPath, key)

      const res = await fetch(`${API_BASE_URL}/add-gallery-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: uuidv4(),
          title: frame.title,
          imageUrl,
          tags: frame.tags,
          message: frame.message,
        }),
      })

      if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`)

      console.log(`✅ Registered ${frame.title}`)
    } catch (err) {
      console.error(`❌ Failed to register ${frame.title}:`, err)
    }
  }
}

registerGalleryItems()
