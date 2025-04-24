# 🌈 Pride Frame

Pride Frame is a fun and empowering web application that lets users upload their photos, add pride-themed frames, and download their creations to share as profile pictures on any social media platform.

## ✨ Features

- **Image Upload, Frame Overlay, and Download**  
  Upload your photo and choose from a variety of pride-themed frames (rainbow, trans, nonbinary, and more). Download your creation to use as a profile picture.

- **Frame Customization**  
  Design your own unique pride frame to express your identity.

- **Gallery View**  
  Share your creation anonymously and explore pride frames made by others for inspiration.

## 🚀 Tech Stack
A lightweight, scalable stack powered by Vue 3 and AWS serverless services.

| Area        | Technology            |
|-------------|------------------------|
| Frontend    | Vue 3, TypeScript, Vuetify |
| Backend     | AWS Lambda, API Gateway |
| Storage     | Amazon S3              |
| Database    | DynamoDB      |
| Deployment  | Render  |

## 🧠 Project Purpose

This project was created to empower LGBTQ+ individuals and allies to express their identities proudly and creatively through visual media.
It also serves as an exploration of scalable frontend-backend integration using modern serverless technologies.

## 📸 User Flow

```plaintext
/ (Home)
├── /create
│   ├── /create/default
│   │   ├── Step 1: Upload Photo
│   │   ├── Step 2: Select Frame
│   │   ├── Step 3: Preview
│   │   └── Step 4: Download
│   │
│   └── /create/custom
│       ├── Step 1: Design Frame
│       ├── Step 2: Upload Photo
│       ├── Step 3: Preview
│       ├── Step 4: Download
│       └── Step 5: (Optional) Share to Gallery
│
└── /gallery (View Gallery)
```

## 📦 Folder Structure (simplified)

```bash
src/
├── assets/
│   └── frames/
│
├── components/
│   ├── common/  # Shared across flows
│   │   ├── FrameSelector.vue
│       ├── UploadPhoto.vue
│   │   ├── PhotoPreview.vue
│   │   └── DownloadButton.vue
│   │
│   ├── default/ # Components for the default frame flow
│   │   ├── UploadPhoto.vue
│   │   └── SelectFrame.vue
│   │
│   └── custom/ # Components for the custom frame flow
│       ├── FrameDesign.vue
│       ├── Preview.vue
│       └── Share.vue
│
├── views/
│   ├── Home.vue
│   ├── Create.vue
│   ├── CreateDefault.vue
│   ├── CreateCustom.vue
│   └── Gallery.vue
│
├── router/
│   └── index.ts
│
├── utils/
│   ├── canvasUtils.ts
│   └── s3.ts
│
├── types/
│   └── index.ts
│
├── App.vue
└── main.ts
```

## 📄 License

MIT License.  
Feel free to remix, contribute, and celebrate pride through code!

---

Whether you’re here to build, explore, or celebrate — welcome, and enjoy creating 🌈