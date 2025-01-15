<template>
  <div class="space-y-6">
    <!-- 标题栏 -->
    <div class="flex items-center gap-2 pb-4 border-b border-gray-100">
      <button
        class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        @click="$emit('close')"
      >
        <svg
          class="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <h2 class="text-lg font-medium">编辑个人资料</h2>
    </div>

    <!-- 编辑表单 -->
    <div class="space-y-8">
      <!-- 头像和基本信息 -->
      <div class="flex gap-8">
        <div class="flex-1 grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm text-gray-600 font-bold">昵称</label>
            <a-input
              v-model:value="userInfo.nickname"
              placeholder="请输入昵称"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm text-gray-600 font-bold">性别</label>
            <div class="flex gap-2">
              <button
                class="flex-1 py-2 px-4 rounded-lg text-sm transition-colors border"
                :class="[
                  userInfo.gender === 'male'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-500 hover:text-blue-500',
                ]"
                @click="userInfo.gender = 'male'"
              >
                男
              </button>
              <button
                class="flex-1 py-2 px-4 rounded-lg text-sm transition-colors border"
                :class="[
                  userInfo.gender === 'female'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-500 hover:text-blue-500',
                ]"
                @click="userInfo.gender = 'female'"
              >
                女
              </button>
              <button
                class="flex-1 py-2 px-4 rounded-lg text-sm transition-colors border"
                :class="[
                  userInfo.gender === 'secret'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-500 hover:text-blue-500',
                ]"
                @click="userInfo.gender = 'secret'"
              >
                保密
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 详细信息 -->
      <div class="grid grid-cols-2 gap-6">
        <div class="flex flex-col gap-2">
          <label class="text-sm text-gray-600 font-bold">生日</label>
          <a-date-picker
            v-model:value="userInfo.birthday"
            class="w-full"
            :locale="locale"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-sm text-gray-600 font-bold">现居地</label>
          <a-cascader
            v-model:value="userInfo.location"
            :options="cityOptions"
            placeholder="请选择城市"
            class="!w-full"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-sm text-gray-600 font-bold">就读学校</label>
          <a-input
            v-model:value="userInfo.school"
            placeholder="请输入学校名称"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-sm text-gray-600 font-bold">所在公司</label>
          <a-input
            v-model:value="userInfo.company"
            placeholder="请输入公司名称"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-sm text-gray-600 font-bold">职位</label>
          <a-input v-model:value="userInfo.position" placeholder="请输入职位" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-sm text-gray-600 font-bold">个人网站</label>
          <a-input v-model:value="userInfo.website" placeholder="请输入网址" />
        </div>
      </div>
      <!-- 个人简介 -->
      <div class="flex flex-col gap-2">
        <label class="text-sm text-gray-600 font-bold">个人简介</label>
        <a-textarea
          v-model:value="userInfo.bio"
          :rows="4"
          placeholder="请输入个人简介"
          :maxLength="200"
        />
      </div>
      <!-- 个人标签 -->
      <div class="flex flex-col gap-2">
        <label class="text-sm text-gray-600 font-bold">个人标签</label>
        <div class="flex flex-wrap gap-2">
          <a-tag
            v-for="tag in tagOptions"
            :key="tag.value"
            :color="userInfo.tags.includes(tag.value) ? tag.color : undefined"
            class="px-3 py-1.5 cursor-pointer select-none text-sm"
            @click="toggleTag(tag.value)"
          >
            {{ tag.label }}
          </a-tag>
        </div>
      </div>

      <!-- 保存按钮 -->
      <div class="flex justify-end gap-4">
        <a-button @click="$emit('close')">取消</a-button>
        <a-button
          type="primary"
          class="!bg-blue-500 border-blue-500 hover:!bg-blue-600"
          @click="handleSave"
          >保存修改</a-button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import zhCN from "ant-design-vue/es/date-picker/locale/zh_CN";

const locale = zhCN;
const avatarUrl = ref(
  "https://srv.carbonads.net/static/30242/4f7f59796c5dda8f5dfc63a40583dfde7cebb050"
);

// 用户信息
const userInfo = ref({
  nickname: "咕",
  gender: "secret",
  birthday: null,
  location: [],
  school: "",
  company: "",
  position: "全栈开发工程师",
  website: "",
  tags: [],
  bio: "",
});

// 标签选项
const tagOptions = [
  { value: "frontend", label: "前端开发", color: "blue" },
  { value: "backend", label: "后端开发", color: "green" },
  { value: "android", label: "Android开发", color: "orange" },
  { value: "ios", label: "iOS开发", color: "gold" },
  { value: "design", label: "UI设计", color: "pink" },
  { value: "database", label: "数据库", color: "purple" },
  { value: "algorithm", label: "算法", color: "cyan" },
  { value: "architecture", label: "架构设计", color: "geekblue" },
  { value: "testing", label: "测试", color: "magenta" },
  { value: "devops", label: "DevOps", color: "volcano" },
];

// 标签切换方法
const toggleTag = (tagValue) => {
  const index = userInfo.value.tags.indexOf(tagValue);
  if (index === -1) {
    userInfo.value.tags.push(tagValue);
  } else {
    userInfo.value.tags.splice(index, 1);
  }
};

// 城市选项数据
const cityOptions = [
  {
    value: "guangdong",
    label: "广东省",
    children: [
      {
        value: "shenzhen",
        label: "深圳市",
        children: [
          { value: "nanshan", label: "南山区" },
          { value: "futian", label: "福田区" },
          { value: "luohu", label: "罗湖区" },
          { value: "baoan", label: "宝安区" },
          { value: "longgang", label: "龙岗区" },
          { value: "longhua", label: "龙华区" },
        ],
      },
      {
        value: "guangzhou",
        label: "广州市",
        children: [
          { value: "tianhe", label: "天河区" },
          { value: "yuexiu", label: "越秀区" },
          { value: "haizhu", label: "海珠区" },
          { value: "liwan", label: "荔湾区" },
        ],
      },
    ],
  },
  {
    value: "beijing",
    label: "北京市",
    children: [
      {
        value: "beijing",
        label: "北京市",
        children: [
          { value: "chaoyang", label: "朝阳区" },
          { value: "haidian", label: "海淀区" },
          { value: "dongcheng", label: "东城区" },
          { value: "xicheng", label: "西城区" },
        ],
      },
    ],
  },
  {
    value: "shanghai",
    label: "上海市",
    children: [
      {
        value: "shanghai",
        label: "上海市",
        children: [
          { value: "pudong", label: "浦东新区" },
          { value: "xuhui", label: "徐汇区" },
          { value: "changning", label: "长宁区" },
          { value: "putuo", label: "普陀区" },
        ],
      },
    ],
  },
  {
    value: "zhejiang",
    label: "浙江省",
    children: [
      {
        value: "hangzhou",
        label: "杭州市",
        children: [
          { value: "xihu", label: "西湖区" },
          { value: "shangcheng", label: "上城区" },
          { value: "xiacheng", label: "下城区" },
          { value: "jianggan", label: "江干区" },
        ],
      },
      {
        value: "ningbo",
        label: "宁波市",
        children: [
          { value: "haishu", label: "海曙区" },
          { value: "jiangbei", label: "江北区" },
          { value: "beilun", label: "北仑区" },
        ],
      },
    ],
  },
];

const handleSave = () => {
  console.log("保存的用户信息：", userInfo.value);
  // 这里添加保存逻辑
};

defineEmits(["close"]);
</script>

<style scoped>
:deep(.ant-upload-select) {
  width: 80px !important;
  height: 80px !important;
}

:deep(.ant-input:focus),
:deep(.ant-input-focused) {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1) !important;
}

/* 添加标签过渡动画 */
button {
  transition: all 0.2s ease-in-out;
}

:deep(.ant-tag) {
  margin-right: 0;
  font-size: 14px;
  padding: 4px 8px;
  cursor: pointer;
  transition: all 0.2s;
}

:deep(.ant-tag:hover) {
  opacity: 0.8;
}

:deep(.ant-select-selector) {
  width: 100% !important;
}

:deep(.ant-cascader) {
  width: 100% !important;
}

:deep(.ant-btn-primary) {
  background-color: #3b82f6 !important;
  border-color: #3b82f6 !important;
}

:deep(.ant-btn-primary:hover) {
  background-color: #2563eb !important;
  border-color: #2563eb !important;
}
</style>
