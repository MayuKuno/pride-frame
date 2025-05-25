<template>
  <div class="backToHome text-center mt-4">
    <v-btn variant="text" @click="goHome">
      <v-icon start icon="mdi-home" /> Back to Home
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<style scoped>
.backToHome {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
</style>
