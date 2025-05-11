<template>
  <div class="mt-4 d-flex align-center justify-center">
    <div class="relative flex justify-center items-center w-full max-w-[620px] min-h-[400px]">
      <div class="relative overflow-hidden" :style="getFrameStyle"
      >
        <Cropper
          v-if="uploadedImage"
          :src="uploadedImage"
          :canvasSize="canvasSize"
          @crop="emitCrop"
        />
        <div v-else class="flex justify-center items-center w-full h-full">
          <img src="/icons/user.png" alt="user" class="user-icon" />
        </div>
      </div>
    </div>
  </div>
  <div v-if="uploadedImage" :key="positiveKey || ''" class="positive-message">{{positiveMessage}}</div>
  <div class="mt-4 d-flex align-center justify-center">
    <v-file-input
      :model-value="selectedFile"
      @update:model-value="onFileInputChange"
      style="max-width: 620px;"
      clearable
      prepend-icon=""
      prepend-inner-icon="mdi-camera"
      accept="image/*"
      messages="Don’t worry — your photo never leaves your device. Nothing is uploaded to any server."
      label="Upload your photo"
      variant="underlined"
      @click:clear="onFileClear"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, CSSProperties} from 'vue'
import Cropper from '@/components/common/Cropper.vue'

const props = defineProps<{
  canvasSize: { width: number; height: number; shape: string }
}>()
defineExpose({
  clear: onFileClear
})

const selectedFile = ref<File | null>(null)
const uploadedImage = ref<string | null>(null)
const positiveKey = ref(0)


const positiveMessages = [
  "Honey, you’re pure beauty! 💖",
  "Yasss, that smile shines! 🌟",
  "You look amazing, darling!",
  "Fabulous and fierce! 🔥",
  "Iconic, simply iconic! 👑",
  "Wow, you shine so bright!",
  "You look so beautiful!"
]

const positiveMessage = computed(() => {
  if (!uploadedImage.value) return ''
  const index = Math.floor(Math.random() * positiveMessages.length)
  return positiveMessages[index]
})

const getFrameStyle = computed(() => ({
  width: `${props.canvasSize.width}px`,
  height: `${props.canvasSize.height}px`,
  backgroundColor: '#efece8ff',
  borderRadius: props.canvasSize.shape === 'round' ? '9999px' : '0px',
  overflow: 'hidden',
  position: 'relative',
} as CSSProperties))


async function onFileInputChange(file: File | null) {
  selectedFile.value = file

  if (file) {
    const reader = new FileReader()
    reader.onload = e => {
      uploadedImage.value = e.target?.result as string
      positiveKey.value = Date.now()
    }
    reader.readAsDataURL(file)
  } else {
    uploadedImage.value = null
  }
}

function onFileClear() {
  selectedFile.value = null
  uploadedImage.value = null
}

const emit = defineEmits<{
  (e: 'croppedImage', dataUrl: string): void
}>()

function emitCrop(croppedDataUrl: string) {
  emit('croppedImage', croppedDataUrl)
}
</script>

<style>
.user-icon {
  width: calc(100% - 120px);
  height: calc(100% - 120px);
  position: absolute;
  bottom: 70px;
  left: 50%;
  transform: translateX(-50%);
}

@keyframes popIn {
  0% {
    opacity: 0;
    transform: scale(0.8) rotate(-5deg);
  }
  60% {
    opacity: 1;
    transform: scale(1.05) rotate(2deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

.positive-message {
  background: linear-gradient(90deg, #d8151c, #ed9b18, #d7c700, #52a8dd, #995292);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  margin-top: 24px;
  font-size: 20px;
  animation: popIn 0.6s ease;
}

.v-stepper.v-sheet {
  box-shadow: none !important;
}
</style>
