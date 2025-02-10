<template>
  <div
    class="w-screen min-h-screen flex flex-col items-center gap-[20px] mt-[20px] mb-[40px]"
  >
    <!-- Header Skeleton -->
    <div class="w-[1200px] rounded-2xl px-2 pt-6">
      <div class="flex items-center gap-4">
        <div class="w-32 h-32 rounded-full bg-gray-200 animate-pulse"></div>
        <div class="space-y-2">
          <div class="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div class="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div class="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>

    <!-- Content Skeleton -->
    <div class="w-[1200px] flex justify-center gap-[20px] items-start">
      <!-- Left Sidebar Skeleton -->
      <div class="w-[300px] bg-white rounded-2xl p-6">
        <div class="space-y-6">
          <!-- Personal Info Card Skeleton -->
          <div class="space-y-4">
            <div v-for="i in 3" :key="i" class="flex items-center gap-2">
              <div class="w-5 h-5 rounded bg-gray-200 animate-pulse"></div>
              <div class="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          <!-- Action Button Skeleton -->
          <div class="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>

          <!-- Stats Cards Skeleton -->
          <div class="space-y-4">
            <div
              v-for="i in 2"
              :key="i"
              class="w-full p-4 bg-gray-100 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <div class="w-5 h-5 rounded bg-gray-200 animate-pulse"></div>
                <div class="flex-1 flex items-center justify-between">
                  <div class="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div class="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Content Skeleton -->
      <div class="w-[880px] flex flex-col gap-4">
        <!-- Progress Cards Skeleton -->
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white rounded-2xl p-6 h-[200px]">
            <div class="flex items-center justify-between">
              <div
                class="w-[150px] h-[150px] rounded-full bg-gray-200 animate-pulse"
              ></div>
              <div class="w-[140px] space-y-3">
                <div
                  v-for="i in 3"
                  :key="i"
                  class="h-10 bg-gray-200 rounded-lg animate-pulse"
                ></div>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-2xl p-4">
            <div class="grid grid-cols-2 gap-3 w-full">
              <div
                v-for="i in 4"
                :key="i"
                class="h-20 bg-gray-200 rounded-lg animate-pulse"
              ></div>
            </div>
          </div>
        </div>

        <!-- Contribution Graph Skeleton -->
        <div class="bg-white rounded-2xl p-6">
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <div class="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
              <div class="flex gap-3">
                <div class="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div class="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div
              class="h-[120px] w-full bg-gray-200 rounded animate-pulse"
            ></div>
          </div>
        </div>

        <!-- Activity List Skeleton -->
        <div class="bg-white rounded-2xl p-6">
          <div class="space-y-4">
            <div class="flex gap-3">
              <div
                v-for="i in 3"
                :key="i"
                class="h-10 w-24 bg-gray-200 rounded-md animate-pulse"
              ></div>
            </div>
            <div class="space-y-4 pt-4">
              <div
                v-for="i in 3"
                :key="i"
                class="h-16 w-full bg-gray-200 rounded-lg animate-pulse"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No props or complex logic needed for skeleton
</script>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
