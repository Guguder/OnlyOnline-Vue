<template>
  <div
    class="mb-4 max-w-full rounded-lg overflow-hidden shadow-sm bg-white border border-gray-200"
  >
    <!-- Header -->
    <div
      class="bg-[#F2F2F2] py-3 px-4 text-sm text-gray-800 font-medium border-b border-gray-200"
    >
      {{ type }}
    </div>

    <!-- Problems List -->
    <div class="flex flex-col">
      <div
        v-for="problem in bankTopicItemVoList"
        :key="problem.id"
        @click="navigateToProblem(problem.id)"
        class="flex justify-between items-center py-4 px-4 border-b border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer group"
      >
        <!-- Left side -->
        <div class="flex items-center gap-3">
          <div
            class="w-4 h-4 rounded-full border-2 border-gray-300 group-hover:border-[#057BEF] transition-colors"
          ></div>
          <div
            class="text-sm text-gray-800 group-hover:text-[#057BEF] transition-colors"
          >
            {{ problem.title }}
          </div>
        </div>

        <!-- Right side -->
        <div class="flex items-center gap-4">
          <div
            class="flex items-center gap-1 text-gray-500 text-sm cursor-pointer hover:text-blue-500 transition-colors"
          >
            <span class="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                ></path>
              </svg>
            </span>
            <span>题解</span>
          </div>
          <div
            :class="{
              'text-green-500': problem.difficulty === 0,
              'text-yellow-500': problem.difficulty === 1,
              'text-red-500': problem.difficulty === 2,
              'text-sm w-10 text-center': true,
            }"
          >
            {{ getDifficultyText(problem.difficulty) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps({
  type: {
    type: String,
    default: "查询",
  },
  bankTopicItemVoList: {
    type: Array,
    default: () => [],
  },
});

const getDifficultyText = (difficulty) => {
  const difficultyMap = {
    0: "简单",
    1: "中等",
    2: "困难",
  };
  return difficultyMap[difficulty] || "未知";
};

const navigateToProblem = (problemId) => {
  router.push(`/problem/${problemId}`);
};
</script>

<style scoped></style>
