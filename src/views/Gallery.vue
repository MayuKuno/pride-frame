<template>
  <v-container fluid class="py-16">
    <v-container class="text-center">
      <h1 class="mb-4">
        <span class="rainbow">Pride Frame</span> Gallery
      </h1>
      <p class="text-subtitle-1 text-grey-darken-1 mb-8">
        Explore amazing Pride frame creations shared by the community.
      </p>

      <!-- Tag Filter Area -->
      <v-row justify="center" class="mb-6">
        <v-chip
          class="ma-1"
          :color="selectedTag === '' ? 'primary' : 'grey lighten-2'"
          text-color="white"
          small
          @click="clearTagFilter"
        >
          Show All
        </v-chip>
        <v-chip
          v-for="tag in allTags"
          :key="tag"
          class="ma-1"
          :color="selectedTag === tag ? 'primary' : 'grey lighten-2'"
          text-color="white"
          small
          @click="selectTag(tag)"
        >
          #{{ tag }}
        </v-chip>
      </v-row>

      <!-- Gallery Grid -->
      <v-row dense>
        <v-col
          v-for="(frame, index) in filteredFrames"
          :key="index"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card elevation="4" hover>
            <v-img
              :src="frame.src"
              aspect-ratio="1"
              alt="Pride frame"
            ></v-img>

            <v-card-title class="justify-center text-subtitle-1 font-weight-medium">
              {{ frame.title }}
            </v-card-title>

            <v-card-actions class="justify-center flex-wrap">
              <v-chip
                v-for="tag in frame.tags"
                :key="tag"
                size="x-small"
                class="ma-1"
                color="primary"
                text-color="white"
              >
                #{{ tag }}
              </v-chip>
            </v-card-actions>

            <v-card-actions class="justify-center">
              <v-btn icon @click="likeFrame(index)">
                <v-icon color="pink">mdi-heart</v-icon>
              </v-btn>
              <span class="text-caption text-grey-darken-1">{{ frame.likes }}</span>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <BackToHome />
  </v-container>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'

const frames = reactive([
  {
    src: '/frames/nonbinary.png',
    title: 'Rainbow Sunset',
    tags: ['nonbinary', 'pride'],
    width: 320,
    height: 320,
    shape: 'round',
    likes: 12,
  },
  {
    src: '/frames/rainbow.png',
    title: 'Bold & Bright',
    tags: ['rainbow', 'trans', 'nonbinary', 'pride', 'dfgdsff', 'bgfdhs'],
    width: 500,
    height: 500,
    shape: 'square',
    likes: 8,
  },
  {
    src: '/frames/trans.png',
    title: 'Classic Pride',
    tags: ['trans', 'pride'],
    width: 320,
    height: 320,
    shape: 'round',
    likes: 20,
  },
  {
    src: '/frames/trans.png',
    title: 'Classic Pride',
    tags: ['trans', 'pride'],
    width: 320,
    height: 320,
    shape: 'round',
    likes: 20,
  },
  {
    src: '/frames/trans.png',
    title: 'Classic Pride',
    tags: ['trans', 'pride'],
    width: 320,
    height: 320,
    shape: 'round',
    likes: 20,
  },
])

const selectedTag = ref('')

const allTags = [...new Set(frames.flatMap(f => f.tags))]

function selectTag(tag: string) {
  selectedTag.value = tag
}

function clearTagFilter() {
  selectedTag.value = ''
}

function likeFrame(index: number) {
  frames[index].likes++
}

const filteredFrames = computed(() =>
  frames.filter(f =>
    selectedTag.value === '' || f.tags.includes(selectedTag.value)
  )
)

</script>

<style scoped>
.rainbow {
  background: linear-gradient(90deg, #d8151c, #ed9b18, #d7c700, #52a8dd, #995292);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}
:deep(.v-card-actions) {
  gap:0;
  padding:0;
  min-height: 56px;
}
</style>
