# 🌈 Pride Frame

Pride Frame is a fun and empowering web application that lets users upload their photos, add pride-themed frames, and download their creations to share as profile pictures on any social media platform.

## ✨ Features

- **Pride Profile Picture**
  Combine your photo with a pride frame to create a profile picture for social media.

- **Upload Your Own Frame**
  Upload a pride frame you’ve designed elsewhere and personalize your profile picture in your own way.

- **Explore the Gallery**
  Explore a vibrant gallery of creations shared by others. Get inspired, celebrate diversity, and discover new pride expressions.

## 🚀 Tech Stack

| Area        | Technology            |
|-------------|------------------------|
| Frontend    | Vue 3, TypeScript, Vuetify |
| Backend     | AWS Lambda + API Gateway |
| Storage     | Amazon S3              |
| Database    | DynamoDB      |
| Hosting     | S3 + CloudFront                       |
| Deployment  | Serverless Framework  |


## 🧠 Project Purpose

This project was created to empower LGBTQ+ individuals and allies to express their identities proudly and creatively through visual media.
It also serves as an exploration of scalable frontend-backend integration using modern serverless technologies.

## 📸 User Flow

```plaintext
/ (Home)
├── /create
│   ├── /create
│   │   ├── Step 1: Upload & Adjust Photo
│   │   ├── Step 2: Select Frame from Gallery
│   │   ├── Step 3: Download
│   │
│   └── /share
│
└── /gallery
    └── /gallery/{id}
```

## 📄 License

MIT License.  
Feel free to remix, contribute, and celebrate pride through code!

---

Whether you’re here to build, explore, or celebrate — welcome, and enjoy creating 🌈