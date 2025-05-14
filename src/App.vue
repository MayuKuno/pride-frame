<template>
  <v-app>
    <router-view />
    <!-- <footer class="py-6 text-center text-sm text-gray-600 mt-8">
      © 2025 Pride Frame. Made with love and pride.
      <div class="mt-1 text-[10px] text-gray-400">
        <a href="/privacy" class="underline hover:text-gray-600">プライバシーポリシー</a>
      </div>
    </footer> -->
    <v-footer
      class="d-flex flex-column align-center justify-center mt-8"
      color="transparent"
      height="auto"
    >
      <div class="text-body-2 text-grey-darken-1">
        © 2025 Pride Frame. Made with love and pride.
      </div>
      <div class="text-caption text-grey-lighten-1 mt-1">
        <a href="/privacy" class="text-grey-lighten-1 text-decoration-underline">
          Privacy policy
        </a>
      </div>
    </v-footer>


  </v-app>
</template>
<script setup lang="ts">
</script>