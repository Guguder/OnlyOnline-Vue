<template>
  <div class="w-screen min-h-screen flex justify-center gap-[20px] mt-[20px]">
    <!-- 左侧内容区域骨架屏 -->
    <div class="w-[700px] flex flex-col gap-2">
      <!-- 主要内容卡片 -->
      <div class="w-full bg-white rounded-2xl">
        <!-- 头部导航 -->
        <div class="flex items-center justify-between pl-3 pr-6 py-4">
          <div class="w-8 h-8 rounded bg-gray-200 animate-pulse"></div>
          <div class="w-48 h-6 rounded bg-gray-200 animate-pulse"></div>
        </div>
        <div class="mx-5 h-[1px] bg-[#E5E5E5]"></div>

        <div class="px-5 pt-6 pb-2">
          <!-- 标题 -->
          <div class="w-3/4 h-8 rounded bg-gray-200 animate-pulse mb-4"></div>

          <!-- 作者信息 -->
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
            <div class="flex flex-col gap-2">
              <div class="w-24 h-4 rounded bg-gray-200 animate-pulse"></div>
              <div class="w-32 h-3 rounded bg-gray-200 animate-pulse"></div>
            </div>
          </div>

          <!-- 内容占位 -->
          <div class="space-y-4 mb-6">
            <div class="w-full h-4 rounded bg-gray-200 animate-pulse"></div>
            <div class="w-5/6 h-4 rounded bg-gray-200 animate-pulse"></div>
            <div class="w-4/6 h-4 rounded bg-gray-200 animate-pulse"></div>
          </div>

          <!-- 底部操作栏 -->
          <div class="flex items-center justify-between pt-4 border-t">
            <div class="flex gap-4">
              <div class="w-20 h-8 rounded bg-gray-200 animate-pulse"></div>
              <div class="w-20 h-8 rounded bg-gray-200 animate-pulse"></div>
              <div class="w-20 h-8 rounded bg-gray-200 animate-pulse"></div>
            </div>
            <div class="w-24 h-8 rounded bg-gray-200 animate-pulse"></div>
          </div>
        </div>
      </div>

      <!-- 评论导航骨架屏 -->
      <div
        class="w-full bg-white rounded-2xl p-2 flex items-center justify-between"
      >
        <div class="w-32 h-6 ml-3 rounded bg-gray-200 animate-pulse"></div>
        <div class="flex gap-2 mr-3">
          <div class="w-20 h-8 rounded bg-gray-200 animate-pulse"></div>
          <div class="w-20 h-8 rounded bg-gray-200 animate-pulse"></div>
        </div>
      </div>

      <!-- 评论列表骨架屏 -->
      <div class="w-full bg-white rounded-2xl p-5 space-y-4">
        <div v-for="i in 3" :key="i" class="flex gap-3">
          <div class="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
          <div class="flex-1">
            <div class="w-32 h-4 rounded bg-gray-200 animate-pulse mb-2"></div>
            <div class="w-full h-4 rounded bg-gray-200 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧边栏骨架屏 -->
    <div class="w-[300px]">
      <div class="bg-white rounded-2xl p-5">
        <div class="space-y-4">
          <div
            v-for="i in 3"
            :key="i"
            class="flex items-center justify-between"
          >
            <div class="w-20 h-4 rounded bg-gray-200 animate-pulse"></div>
            <div class="w-16 h-6 rounded bg-gray-200 animate-pulse"></div>
          </div>
          <div class="h-[1px] bg-gray-200 my-4"></div>
          <div class="space-y-2">
            <div class="w-24 h-4 rounded bg-gray-200 animate-pulse"></div>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="i in 4"
                :key="i"
                class="w-16 h-6 rounded bg-gray-200 animate-pulse"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
