<template>
  <v-container class="text-center py-16">
    <h2 class="text-h4 font-weight-bold mb-12">
      How would you like to create your Pride Frame?
    </h2>

    <v-row justify="center" align="center">
      <v-col cols="12" md="4">
        <RouterLink to="/create/default" style="text-decoration: none;">
          <v-card class="pa-8" color="pink lighten-4" hover>
            <v-card-text class="text-h6 font-weight-medium">
              Use a Ready-Made Frame
            </v-card-text>
          </v-card>
        </RouterLink>
      </v-col>

      <v-col cols="12" md="1" class="d-flex align-center justify-center">
        <div class="text-h6">or</div>
      </v-col>

      <v-col cols="12" md="4">
        <RouterLink to="/create/custom" style="text-decoration: none;">
          <v-card class="pa-8" color="blue lighten-4" hover>
            <v-card-text class="text-h6 font-weight-medium">
              Make Your Own
            </v-card-text>
          </v-card>
        </RouterLink>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// 特にスクリプトは不要
</script>
