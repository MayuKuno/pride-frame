<template>
  <div class="py-20 container">
    <h2 class="text-4xl font-bold text-center mb-6 text-gray-800">
      How would you like to create your <span class="rainbow">Pride Frame</span>?
    </h2>
    <p class="text-center text-lg mb-12 text-gray-600">
      Pick a Pride frame from the gallery or create your own custom design.
    </p>

    <v-row justify="center" align="center" dense>
      <v-col cols="12" md="5">
        <div
          class="selectable-card"
        >
          <RouterLink to="/create/default">
            <v-card
              class="pa-8 rounded-xl shadow-md border"
              style="border-color: #EC4899; background-color: #FFFFFF;"
            >
              <v-avatar size="80" class="mb-4" color="#F8F8F8">
                <img src="/gallery.png" alt="palette icon" style="width: 100%; height: 100%; object-fit: contain;" />
              </v-avatar>
              <v-card-title class="text-xl font-semibold mb-2 text-gray-800 text-center">
                Choose a <span class="rainbow">Pride Frame</span> from Gallery
              </v-card-title>
              <v-card-text class="text-base text-gray-600 mb-4">
                Choose from a curated collection of Pride frames designed for instant use.
                Perfect if you want something quick, polished, and beautiful.
              </v-card-text>
            </v-card>
          </RouterLink>
        </div>
      </v-col>

      <v-col cols="12" md="1">
        <div>or</div>
      </v-col>

      <v-col cols="12" md="5">
        <div
          class="selectable-card"
        >
          <RouterLink to="/create/custom">
            <v-card
              class="pa-8 rounded-xl shadow-md border"
              style="border-color: #3B82F6; background-color: #FFFFFF;"
            >
              <v-avatar size="80" class="mb-4" color="#F8F8F8">
                <img src="/icons/palette.png" alt="palette icon" style="width: 100%; height: 100%; object-fit: contain;" />
              </v-avatar>
              <v-card-title class="text-xl font-semibold mb-2 text-gray-800 text-center">
                Upload Your Own <span class="rainbow">Pride Frame</span>
              </v-card-title>
              <v-card-text class="text-base text-gray-600 mb-4">
                Create a custom frame from scratch and upload your own design.
                Perfect for creatives who want full control and personal expression.
              </v-card-text>
            </v-card>
          </RouterLink>
        </div>
      </v-col>
    </v-row>

    <BackToHome />
  </div>
</template>

<script setup lang="ts">
import BackToHome from '@/components/common/BackToHome.vue'
</script>

<style scoped>
.container {
  padding: 100px 20px;
}

.selectable-card {
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.selectable-card:hover {
  transform: scale(1.05);
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
