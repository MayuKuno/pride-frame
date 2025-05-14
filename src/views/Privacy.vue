<template>
  <v-container class="py-12" style="max-width: 600px;">
    <h1 class="text-h5 mb-6 font-weight-medium">Privacy Policy</h1>

    <p class="mb-4">
      This site is a personal project created for fun and learning. To help improve the experience, I use Google Analytics to collect basic, anonymous usage data.
    </p>

    <p class="mb-4">
      The information collected includes things like page views, time spent on the site, and general device or browser types. This data does not include any personal information such as your name, email address, or IP address.
    </p>
    <p class="mb-4">
      Any photos you upload to create a pride frame are processed entirely in your browser. They are not stored or transmitted to any server.
    </p>

    <p class="mb-4">
      If you choose to share your framed photo in the public gallery, only that specific image will be uploaded and stored. No other personal data is collected or saved.
    </p>
    <BackToHome />
  </v-container>
</template>

<script setup lang="ts">
import BackToHome from '@/components/common/BackToHome.vue'
</script>
