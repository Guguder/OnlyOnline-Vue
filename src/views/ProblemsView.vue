<template>
  <div class="problems">
    <h2 class="section-title">学习计划</h2>
    <div class="card-container">
      <a-card
        v-for="(item, index) in problemSets"
        :key="index"
        :title="item.name"
        hoverable
        class="problem-card"
      >
        <img :src="item.cover" :alt="item.name" class="card-img"/>
      </a-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      problemSets: [
        {
          name: "JavaScript基础题库",
          cover: "https://picsum.photos/300/200"
        },
        {
          name: "Vue开发题库",
          cover: "https://picsum.photos/300/200?random=1"
        },
        {
          name: "React实战题库",
          cover: "https://picsum.photos/300/200?random=2"
        },
        {
          name: "算法入门题库",
          cover: "https://picsum.photos/300/200?random=3"
        },
        {
          name: "数据结构基础",
          cover: "https://picsum.photos/300/200?random=4"
        },
        {
          name: "Python编程题库",
          cover: "https://picsum.photos/300/200?random=5"
        },
        {
          name: "前端面试题库",
          cover: "https://picsum.photos/300/200?random=6"
        },
        {
          name: "后端开发题库",
          cover: "https://picsum.photos/300/200?random=7"
        }
      ]
    }
  }
}
</script>

<style scoped>
.problems {
  padding: 20px;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.problem-card {
  width: 300px;
}

.card-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.section-title {
  font-size: 24px;
  font-weight: bold;
  margin: 20px 0;
  text-align: left;
}
</style>
