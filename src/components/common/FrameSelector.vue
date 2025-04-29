<template>
  <v-row class="px-4" dense>
    <v-col
      v-for="frame in matchingFrames"
      :key="frame.name"
      cols="12"
      sm="6"
      md="4"
      class="d-flex justify-center"
    >
      <div
        class="frame-card"
        :class="frame.url === selected ? 'selected' : ''"
        @click="selectFrame(frame.url)"
      >
        <v-img :src="frame.url" height="360" width="360" cover class="rounded-t-xl" />
        <div>
          {{ frame.name }}
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue'

const props = defineProps<{
  canvasSize: { width: number; height: number; shape: 'round' | 'square' }
  selected: string | null
}>()

const emit = defineEmits<{
  (e: 'select', url: string): void
}>()

const frames = [
  { name: 'Rainbow', url: '/frames/rainbow.png', width: 1000, height: 1000, shape: 'square' },
  { name: 'Trans', url: '/frames/trans.png', width: 1000, height: 1000, shape: 'square' },
  { name: 'Bi', url: '/frames/nonbinary.png', width: 1000, height: 1000, shape: 'square' },
]

const matchingFrames = computed(() =>
  frames.filter(frame =>
    frame.width === props.canvasSize.width &&
    frame.height === props.canvasSize.height &&
    frame.shape === props.canvasSize.shape
  )
)

function selectFrame(url: string) {
  emit('select', url)
}
</script>

<style scoped>
.frame-card {
  width: 360px;
  background-color: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border 0.2s ease;
  cursor: pointer;
}

.frame-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.selected {
  box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.2);
}
</style>
