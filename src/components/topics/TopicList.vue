<template>
  <div class="bg-white rounded-lg shadow overflow-x-auto">
    <table class="w-full">
      <thead class="bg-gray-50">
        <tr class="h-12">
          <th
            class="px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            状态
          </th>
          <th
            class="px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            题目
          </th>
          <th
            class="px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            题解
          </th>
          <th
            class="px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            通过率
          </th>
          <th
            class="px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            难度
          </th>
          <th
            class="px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            出题频率
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr
          v-for="(problem, index) in problems"
          :key="problem.id"
          :class="[
            index % 2 === 0 ? 'bg-white h-12' : 'bg-[#F7F8FA] h-12',
            'hover:bg-gray-50 cursor-pointer',
          ]"
          @click="handleProblemClick(problem)"
        >
          <td class="px-4 whitespace-nowrap">
            <CheckCircle2
              v-if="problem.status === 'done'"
              class="h-4 w-4 text-green-500"
            />
            <Circle v-else class="h-4 w-4 text-gray-300" />
          </td>
          <td class="px-4 whitespace-nowrap text-gray-900 font-medium">
            {{ problem.title }}
          </td>
          <td class="px-4 whitespace-nowrap text-gray-900">
            {{ problem.solutions }}
          </td>
          <td class="px-4 whitespace-nowrap text-gray-900">
            {{ problem.passRate }}
          </td>
          <td class="px-4 whitespace-nowrap">
            <span
              :class="{
                'text-green-600 font-medium': problem.difficulty === '简单',
                'text-yellow-600 font-medium': problem.difficulty === '中等',
                'text-red-600 font-medium': problem.difficulty === '困难',
              }"
              >{{ problem.difficulty }}</span
            >
          </td>
          <td class="px-4 whitespace-nowrap">
            <Lock class="h-4 w-4 text-gray-400" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { CheckCircle2, Circle, Lock } from "lucide-vue-next";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  problems: {
    type: Array,
    required: true,
  },
});

// 简化点击处理函数
const handleProblemClick = (problem) => {
  router.push({
    name: "SqlProblemDetail",
    params: { id: problem.id },
  });
};
</script>

<style scoped>
table {
  border-collapse: separate;
  border-spacing: 0;
}

thead th:first-child {
  border-top-left-radius: 0.5rem;
}

thead th:last-child {
  border-top-right-radius: 0.5rem;
}

tbody tr:last-child td:first-child {
  border-bottom-left-radius: 0.5rem;
}

tbody tr:last-child td:last-child {
  border-bottom-right-radius: 0.5rem;
}
</style>
