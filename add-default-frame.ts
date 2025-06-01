import AWS from 'aws-sdk'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import fetch from 'node-fetch'

// npx tsx add-default-frame.ts
// export AWS_ACCESS_KEY_ID=
// export AWS_SECRET_ACCESS_KEY=

// const API_BASE_URL = ''
// const AWS_BUCKET_NAME = ''
const AWS_REGION = 'ap-northeast-1'

AWS.config.update({ region: AWS_REGION })
const s3 = new AWS.S3()

const localFrames = [
  {
    title: '#PRIDE',
    file: '1.png',
    tags: ['pride', 'rainbow'],
    message: "Show your colors with pride.",
  },
  {
    title: 'I SUPPORT',
    file: '2.png',
    tags: ['ally', 'pride'],
    message: "Standing with the LGBTQ+ community.",
  },
  {
    title: 'I SUPPORT Trans Rights',
    file: '3.png',
    tags: ['ally', 'trans'],
    message: "Trans rights are human rights.",
  },
  {
    title: 'Trans Rights Are Human Rights',
    file: '4.png',
    tags: ['trans'],
    message: "No debate. Just rights.",
  },
  {
    title: 'Ally',
    file: '5.png',
    tags: ['ally'],
    message: "Here with love and support.",
  },
  {
    title: 'I SUPPORT',
    file: '6.png',
    tags: ['ally', 'pride'],
    message: "Proud to be an ally.",
  },
  {
    title: 'I SUPPORT Trans Rights',
    file: '7.png',
    tags: ['ally'],
    message: "Standing with the LGBTQ+ community.",
  },
  {
    title: '#lovewins',
    file: '8.png',
    tags: ['equality'],
    message: "Love always wins.",
  },
  {
    title: 'Marriage Equality',
    file: '9.png',
    tags: ['equality'],
    message: "I support marriage equality.",
  },
  {
    title: '#PRIDE',
    file: '10.png',
    tags: ['pride', 'rainbow'],
    message: "Celebrate who you are.",
  },
  {
    title: '#lovewins',
    file: '11.png',
    tags: ['equality'],
    message: "Marriage equality matters.",
  },
  {
    title: '#lovewins',
    file: '12.png',
    tags: ['equality'],
    message: "Marriage equality matters.",
  },
  {
    title: 'Trans Rights',
    file: '13.png',
    tags: ['trans'],
    message: "Trans rights are human rights.",
  },
  {
    title: 'My pronouns are They/Them',
    file: '14.png',
    tags: ['nonbinary'],
    message: "They/Them and proud.",
  },
  {
    title: 'My pronouns are They/Them',
    file: '15.png',
    tags: ['nonbinary'],
    message: "Respect my pronouns.",
  },
  {
    title: '誇り月間',
    file: '16.png',
    tags: ['pride', 'rainbow'],
    message: "Pride in every color.",
  },
  {
    title: '誇り月間',
    file: '17.png',
    tags: ['pride', 'rainbow'],
    message: "Be proud. Be visible.",
  },
  {
    title: 'QUEER with PRIDE',
    file: '18.png',
    tags: ['pride', 'queer'],
    message: "Queer and proud, always.",
  },
  {
    title: 'Bi Visibility',
    file: '19.png',
    tags: ['pride', 'bisexual'],
    message: "Celebrating with bi pride.",
  },
  {
    title: 'Bi Visibility',
    file: '20.png',
    tags: ['pride', 'bisexual'],
    message: "Bi people deserve the spotlight.",
  },
  {
    title: 'Protect Trans Lives',
    file: '21.png',
    tags: ['pride', 'trans'],
    message: "Protect trans lives",
  },
  {
    title: 'Protect Trans Lives',
    file: '22.png',
    tags: ['pride', 'trans'],
    message: "Protect trans lives",
  },
  {
    title: 'Break the Binary',
    file: '23.png',
    tags: ['pride', 'nonbinary'],
    message: "Beyond the binary, with pride.",
  },
  {
    title: 'Break the Binary',
    file: '24.png',
    tags: ['pride', 'nonbinary'],
    message: "Break the binary, live freely.",
  },
  {
    title: 'Not Just a Phase',
    file: '25.png',
    tags: ['pride', 'lesbian'],
    message: "Proud to love as I do.",
  },
  {
    title: 'Not Just a Phase',
    file: '26.png',
    tags: ['pride', 'lesbian'],
    message: "Lesbian love is real.",
  },
  {
    title: 'Ace Folks Belong',
    file: '27.png',
    tags: ['pride', 'asexual'],
    message: "Ace pride belongs here too.",
  },
  {
    title: 'Ace Folks Belong',
    file: '28.png',
    tags: ['pride', 'asexual'],
    message: "Ace folks belong here.",
  },
  {
    title: "I'm Your Ally",
    file: '29.png',
    tags: ['pride', 'ally'],
    message: "With you, as an ally.",
  },
  {
    title: "I'm Your Ally",
    file: '30.png',
    tags: ['pride', 'ally'],
    message: "Here with pride and support.",
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
