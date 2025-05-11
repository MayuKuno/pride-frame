<template>
  <div>
    <h2 class="text-4xl font-bold text-center mb-6 text-gray-800">
      What will you use the <span class="rainbow">Pride Frame</span> for?
    </h2>
    <p class="text-center text-lg mb-12 text-gray-600">
      Pick a frame that’s perfectly sized for your platform, making sure your Pride Photo looks its best wherever you share it.
    </p>

    <div style="display: flex; justify-content: space-evenly;">
      <v-card
        v-for="option in sizeOptions"
        :key="option.value"
        class="pa-8 rounded-xl shadow-md border relative transition-all duration-300"
        style="border-color: #EC4899; background-color: #FFFFFF; width:240px"
        :class="{
          'border-pink-500 shadow-lg scale-105 bg-white opacity-100': isSelected(option.value),
          'border-gray-300 bg-gray-200 opacity-50': !isSelected(option.value)
        }"
        :elevation="isSelected(option.value) ? 8 : 2"
        @click="selectSize(option.value)"
      >
        <div style="min-height: 140px;"><img :src="option.icon" alt="" class="mt-4" width="120px"/></div>
        <v-card-title class="text-center font-semibold card-contents">
          {{ option.label }}<br />
          <div v-if="option.value === 'custom'">
            <div class="flex gap-2 text-sm">
              <input
                :value="customWidth"
                @input="updateWidth"
                type="number"
                min="100"
                max="1000"
                style="font-size: 12px;"
                class="border rounded text-center"
              />
              ×
              <input
                :value="customHeight"
                @input="updateHeight"
                type="number"
                min="100"
                max="1000"
                style="font-size: 12px;"
                class="border rounded text-center w-12"
              />
              <select
                :value="customShape"
                @change="updateShape"
                style="font-size: 12px;"
                class="border rounded px-2 ml-2"
              >
                <option value="round">⚪︎</option>
                <option value="square">◻︎</option>
              </select>
            </div>
          </div>
          <div v-else>
            {{ option.size }}
          </div>
        </v-card-title>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

type SizeOption = 'instagram' | 'linkedin' | 'line' | 'slack' | 'custom'
type ShapeOption = 'round' | 'square'

const selectedSize = ref<SizeOption>('instagram')
const customWidth = ref(600)
const customHeight = ref(600)
const customShape = ref<ShapeOption>('round')

const sizeOptions: { value: SizeOption; label: string; size: string; icon: string }[] = [
  { value: 'instagram', label: 'For Instagram', size: '(320x320)', icon: '/icons/instagram.png' },
  { value: 'linkedin', label: 'For LinkedIn', size: '(400x400)', icon: '/icons/linkedin.png' },
  { value: 'line', label: 'For LINE', size: '(640x640)', icon: '/icons/line.png' },
  { value: 'slack', label: 'For Slack', size: '(512x512)', icon: '/icons/slack.png' },
  { value: 'custom', label: 'Custom', size: '', icon: '/icons/custom.png' },
]

const emit = defineEmits<{
  (e: 'canvasSize', value: { width: number; height: number; shape: string }): void
}>()

const canvasSize = computed(() => {
  const presets: Record<SizeOption, { width: number; height: number; shape: ShapeOption }> = {
    instagram: { width: 320, height: 320, shape: 'round' },
    linkedin: { width: 400, height: 400, shape: 'round' },
    line: { width: 640, height: 640, shape: 'round' },
    slack: { width: 512, height: 512, shape: 'square' },
    custom: { width: customWidth.value, height: customHeight.value, shape: customShape.value },
  }
  return presets[selectedSize.value]
})

watch(canvasSize, (newVal) => {
  emit('canvasSize', newVal)
}, { immediate: true })

const isSelected = (value: string) => selectedSize.value === value

const selectSize = (value: SizeOption) => {
  selectedSize.value = value
}

const updateWidth = (e: Event) => {
  customWidth.value = Number((e.target as HTMLInputElement).value)
}

const updateHeight = (e: Event) => {
  customHeight.value = Number((e.target as HTMLInputElement).value)
}

const updateShape = (e: Event) => {
  customShape.value = (e.target as HTMLSelectElement).value as ShapeOption
}
</script>

<style scoped>
.rainbow {
  background: linear-gradient(90deg, #d8151c, #ed9b18, #d7c700, #52a8dd, #995292);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  margin-bottom: 24px;
}
</style>
