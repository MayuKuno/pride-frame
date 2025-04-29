<template>
  <div class="mt-6">
    <h2 class="mb-6">Select a Frame Size</h2>

    <div class="card-list">
      <v-card
        v-for="option in sizeOptions"
        :key="option.value"
        @click="selectSize(option.value)"
        :elevation="isSelected(option.value) ? 8 : 2"
        :style="cardStyle(option.value, option.color)"
        :class="cardClass(option.value)"
      >
        <img :src="option.icon" alt="" class="icon mt-4" />
        <v-card-text class="text-center font-semibold card-contents">
          {{ option.label }}<br />
          <small>{{ option.size }}</small>
        </v-card-text>
      </v-card>

      <v-card
        @click="selectSize('custom')"
        :elevation="isSelected('custom') ? 8 : 2"
        :style="cardStyle('custom')"
        :class="cardClass('custom')"
      >
        <img src="/icons/custom.png" alt="Custom" class="icon mt-4" />
        <v-card-text class="text-center font-semibold card-contents">
          Custom<br />
          <div class="flex flex-col items-center gap-2 p-4">
            <div class="flex gap-2 text-sm">
              <small>
                <input
                  :value="customWidth"
                  @input="updateWidth"
                  type="number"
                  min="100"
                  max="1000"
                  class="border rounded text-center w-20"
                />
                ×
                <input
                  :value="customHeight"
                  @input="updateHeight"
                  type="number"
                  min="100"
                  max="1000"
                  class="border rounded text-center w-20"
                />
                <select
                  :value="customShape"
                  @change="updateShape"
                  class="border rounded px-2 ml-2"
                >
                  <option value="round">⚪︎</option>
                  <option value="square">◻︎</option>
                </select>
              </small>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  selectedSize: 'instagram' | 'linkedin' | 'line' | 'slack' | 'custom'
  customWidth: number
  customHeight: number
  customShape: 'round' | 'square'
  sizeOptions: Array<{ value: string; label: string; size: string; color: string; icon: string }>
}>()

const emit = defineEmits<{
  (e: 'update:selectedSize', value: string): void
  (e: 'update:customWidth', value: number): void
  (e: 'update:customHeight', value: number): void
  (e: 'update:customShape', value: string): void
}>()

const cardBaseWidth = '180px'
const cardBaseHeight = '160px'

const isSelected = (value: string) => props.selectedSize === value

const cardStyle = (value: string, color?: string) => ({
  width: cardBaseWidth,
  height: value === 'custom' && isSelected('custom') ? 'auto' : cardBaseHeight,
  ...(isSelected(value) && color
    ? { borderColor: color, borderWidth: '3px', borderStyle: 'solid' }
    : {})
})

const cardClass = (value: string) => [
  'cursor-pointer transition-all',
  'min-w-[180px]',
  isSelected(value)
    ? 'border-4 border-primary shadow-2xl scale-110'
    : 'border border-gray-300 hover:shadow-md'
]

const selectSize = (value: string) => {
  emit('update:selectedSize', value)
}

const updateWidth = (e: Event) => {
  emit('update:customWidth', Number((e.target as HTMLInputElement).value))
}

const updateHeight = (e: Event) => {
  emit('update:customHeight', Number((e.target as HTMLInputElement).value))
}

const updateShape = (e: Event) => {
  emit('update:customShape', (e.target as HTMLSelectElement).value)
}
</script>

<style scoped>
.card-list {
  display: flex;
  justify-content: space-evenly;
}
.icon {
  width: 80px;
}
.card-contents {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  padding-bottom: 8px;
  width: 100%;
}
</style>
