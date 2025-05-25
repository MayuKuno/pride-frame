<template>
  <div>
    <!-- Hero Section -->
    <div class="hero text-center">
      <h1 class="text-5xl md:text-7xl font-extrabold mb-4 text-gray-800"><span class="rainbow">Pride Frame</span></h1>
      <p class="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
        Celebrate your identity. Upload your favorite photo, choose a pride-inspired frame, and share your creation with pride.
      </p>
    </div>

    <!-- Scrolling Images -->
    <div class="overflow-hidden w-full bg-white py-4 shadow-inner">
      <div class="scroll-container flex whitespace-nowrap animate-marquee">
        <img v-for="(src, index) in images" :key="index" :src="src" alt="icon" class="h-24 mx-4 rounded-lg shadow" />
        <img v-for="(src, index) in images" :key="'dup-' + index" :src="src" alt="icon" class="h-24 mx-4 rounded-lg shadow" />
      </div>
    </div>

    <!-- How This App Works -->
    <div class="my-12 description">
      <h2 class="text-3xl font-bold text-center mb-10">What This App Offers</h2>
        <v-row justify="center" align="stretch" dense>
          <v-col cols="12" md="4" v-for="(step, index) in steps" :key="index">
            <v-card class="pa-6 text-center hover elevation-4 transition card">
              <div class="mb-4 type"><v-chip v-if="step.type" variant="outlined" color="#d8151c">{{ step.type }}</v-chip></div>
              <v-avatar size="80" class="mb-4" color="#F8F8F8">
                <img :src="step.icon" alt="step icon" style="width: 100%; height: 100%; object-fit: contain;" />
              </v-avatar>
              <h3 class="text-xl font-semibold mb-2">{{ step.title }}</h3>
              <p class="text-base text-gray-600 mb-4">{{ step.description }}</p>
              <v-btn
                v-if="step.link"
                :href="step.link"
                :color="step.buttonColor"
                append-icon="mdi-menu-right"
                large
                rounded
              >
                {{ step.buttonText }}
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
    </div>

    <!-- Gallery Picks -->
    <h2 class="text-3xl font-bold text-center mb-6 mt-12">
       Gallery Picks
    </h2>
    <p class="text-center text-gray-600 mb-10">
      Take a look at some of the awesome frames shared by our community.
    </p>
    <v-container v-if="loading" class="text-center py-16">
        <v-progress-circular color="blue-lighten-3" indeterminate size="128" :width="8"></v-progress-circular>
      </v-container>
    <v-container v-else>
      <v-row dense>
        <v-col
          v-for="(frame, index) in frames"
          :key="index"
          cols="6"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card elevation="4">
            <v-img
              :src="frame.imageUrl"
              aspect-ratio="1"
              alt="Pride frame"
              class="clickable-image"
                @click="goToDetail(frame.id)"
            ></v-img>
            <v-card-actions class="justify-center">
              <v-btn
                class="mt-2 mb-2"
                size="small"
                variant="tonal"
                color="#ed9b18"
                rounded
                @click="useThisFrame(frame)"
              >
                Use This Frame
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <div class="text-center mt-6">
        <v-btn color="purple darken-2" append-icon="mdi-menu-right" variant="text" large to="/gallery">
          Go to Gallery
        </v-btn>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const frames = ref<any[]>([])
const loading = ref(true)

const images = [
  '/images/sample1.png',
  '/images/sample2.png',
  '/images/sample3.png',
  '/images/sample4.png',
  '/images/sample5.png',
  '/images/sample6.png',
]

const steps = [
  {
    icon: '/sharing.png',
    type: '',
    title: 'Share Your Own Pride Frame',
    description:
      'Have a Pride frame to share? Upload it for everyone to use.',
    link: '/share',
    buttonText: 'Share Your Frame',
    buttonColor: 'teal darken-2',
  },
  {
    icon: '/frame.png',
    type: 'Main future',
    title: 'Create Pride Frame Photo',
    description:
      'Upload your photo, decorate it with a Pride frame, and proudly share it',
    link: '/create',
    buttonText: 'Start Creating',
    buttonColor: 'pink darken-2',
  },
  {
    icon: '/gallery.png',
    type: '',
    title: 'Explore the Community Gallery',
    description:
      'Share your Pride creations and discover inspiring frames made by others.',
    link: '/gallery',
    buttonText: 'Go to Gallery',
    buttonColor: 'purple darken-2',
  },
]

onMounted(async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/list-gallery-items`)
    const data = await res.json()
    frames.value = data.slice(0, 4)
  } catch (err) {
    console.error('Failed to fetch gallery items', err)
  } finally {
    loading.value = false
  }
})

function goToDetail(id: string) {
  router.push(`/gallery/${id}`)
}

function useThisFrame(frame: any) {
  router.push({
    path: '/create',
    query: {
      frameId: frame.id,
    }
  })
}
</script>

<style scoped>
@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-100%);
  }
}
.animate-marquee {
  display: flex;
  animation: marquee 40s linear infinite;
}
.scroll-container:hover {
  animation-play-state: paused;
}

.hero {
  padding: 100px 20px 60px 20px;
}

.description {
  background: #F8F8F8;
  padding: 42px;
}

.card{
  min-height: 340px;
}
.button-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.type {
  min-height: 32px;
}
.rainbow {
  background: linear-gradient(90deg, #d8151c, #ed9b18, #d7c700, #52a8dd, #995292);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  margin-bottom: 24px;
}
</style>
