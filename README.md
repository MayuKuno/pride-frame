# 🌈 Pride Frame

Pride Frame is a fun and empowering web application that allows users to upload their photos, add pride-themed frames, and download their creations to share with the world.

## ✨ Features

- **Frame Customization (Coming Soon)**  
  Users will be able to design their own pride-themed frames.

- **Image Upload & Frame Overlay**  
  Upload your photo and choose from a variety of default pride frames (rainbow, trans, nonbinary, and more).

- **Canvas Composition & Download**  
  Combine your photo and frame on a canvas and download it as a single image.

- **Gallery View (Planned)**  
  Share your creations anonymously and explore others' framed images.

## 🚀 Tech Stack

| Area        | Technology            |
|-------------|------------------------|
| Frontend    | Vue 3, TypeScript, Vite |
| Backend     | AWS Lambda, API Gateway (planned) |
| Storage     | Amazon S3              |
| Database    | DynamoDB (planned)     |
| Deployment  | Render / Vercel / Netlify (TBD) |

## 🧠 Project Purpose

This project was built to empower LGBTQ+ individuals and allies to express their identities proudly and creatively through visual media.  
It also explores scalable frontend-backend integration using serverless technologies.

## 🎯 Development Approach

- Started from a simple MVP: upload → select frame → download.
- Canvas image composition using `<canvas>` and dynamic PNG overlays.
- Custom frame creation and image sharing via S3 and DynamoDB are planned.
- Designed to be accessible, mobile-friendly, and extendable.

## 📸 User Flow

```plaintext
Home
└── Create
    ├── Use Default Frame
    │   └── Upload Photo → Preview & Download
    └── Create Custom Frame (Planned)
        └── Design → Upload Photo → Preview → Download → Share to Gallery
```

## 📦 Folder Structure (simplified)

```bash
src/
├── views/
│   ├── Home.vue
│   ├── CreateStart.vue
│   ├── CreateDefault.vue
│   ├── CreateCustom.vue       # Custom frame creation (planned)
│   ├── UploadCustom.vue       # Upload step after frame creation
│   └── Gallery.vue            # View shared frames (planned)
├── components/
│   └── FrameSelector.vue
├── assets/
│   └── frames/
└── router/
    └── index.ts
```

## ✅ TODO

- [x] Image upload
- [x] Frame selection from default list
- [x] Canvas composition + download
- [ ] Upload to S3 via presigned URL
- [ ] Gallery view from S3/DynamoDB
- [ ] Custom frame creation UI

## 📄 License

MIT License.  
Feel free to remix, contribute, and celebrate pride through code!

---

> “You can’t blend in when you were born to stand out.” – R.J. Palacio
