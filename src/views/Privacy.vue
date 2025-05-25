<template>
  <v-container class="py-12" style="max-width: 620px;">
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
  </v-container>
  <v-container style="max-width: 880px;">
    <h1 class="text-h5 mb-6 font-weight-medium">Posting Rules</h1>
    <p class="mb-4">
      To maintain a safe and inclusive environment, submissions to the public gallery may be reviewed.
      If a post is found to be harmful, offensive, or inappropriate, it may be removed without notice.
      <br />
      If you come across any content that you believe violates these values, please
      <a
        href="https://forms.gle/PduwRtu1udHDCFTZ6"
        target="_blank"
        rel="noopener noreferrer"
        class="text-primary font-weight-medium text-decoration-underline"
      >
        report it here
      </a>.
    </p>
    <BackToHome />
  </v-container>
</template>

<script setup lang="ts">
import BackToHome from '@/components/common/BackToHome.vue'
</script>
