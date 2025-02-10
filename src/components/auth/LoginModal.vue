<template>
  <a-modal
    v-model:visible="isVisible"
    :mask-closable="false"
    :footer="null"
    width="400px"
    :centered="true"
    :destroy-on-close="true"
    class="modal-transform custom-modal"
    :closable="true"
    :body-style="{ padding: 0 }"
    @cancel="handleCancel"
  >
    <div class="p-8">
      <!-- 标题区域 -->
      <div class="text-center mb-8">
        <h2 class="text-2xl font-semibold text-primary-900">
          {{ isLogin ? "欢迎回来" : "创建账号" }}
        </h2>
        <p class="text-gray-500 mt-2 text-sm">
          {{ isLogin ? "登录你的账号继续" : "快速注册开始体验" }}
        </p>
      </div>

      <!-- 表单区域 -->
      <a-form ref="formRef" :model="formData" @finish="handleSubmit">
        <a-form-item
          name="username"
          :rules="[{ required: true, message: '请输入用户名' }]"
        >
          <a-input
            v-model:value="formData.username"
            placeholder="请输入用户名"
            size="large"
          >
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          name="password"
          :rules="[{ required: true, message: '请输入密码' }]"
        >
          <a-input-password
            v-model:value="formData.password"
            placeholder="请输入密码"
            size="large"
          >
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item
          v-if="!isLogin"
          name="checkPassword"
          :rules="[
            { required: true, message: '请确认密码' },
            { validator: validateCheckPassword },
          ]"
        >
          <a-input-password
            v-model:value="formData.checkPassword"
            placeholder="请确认密码"
            size="large"
          >
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            :loading="loading"
            block
            size="large"
          >
            {{ isLogin ? "登录" : "注册" }}
          </a-button>
        </a-form-item>

        <!-- 切换登录/注册 -->
        <div class="text-center">
          <a-button type="link" @click="toggleMode">
            {{ isLogin ? "还没有账号？点击注册" : "已有账号？点击登录" }}
          </a-button>
        </div>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { useAuthStore } from "../../stores/auth";
import { useLoginModalStore } from "../../stores/useLoginModal";

const loginModalStore = useLoginModalStore();
const authStore = useAuthStore();
const isVisible = computed({
  get: () => loginModalStore.isVisible,
  set: (value) => {
    if (!value) loginModalStore.hide();
  },
});

const isLogin = ref(true);
const loading = ref(false);

const formData = reactive({
  username: "",
  password: "",
  checkPassword: "",
});

// 验证确认密码（改名）
const validateCheckPassword = async (rule, value) => {
  if (value && value !== formData.password) {
    throw new Error("两次输入的密码不一致");
  }
};

// 恢复原来的切换模式方法
const toggleMode = () => {
  isLogin.value = !isLogin.value;
  formData.username = "";
  formData.password = "";
  formData.checkPassword = "";
};

// 处理表单提交
const handleSubmit = async (values) => {
  loading.value = true;
  try {
    if (isLogin.value) {
      const loginResult = await authStore.login({
        username: values.username,
        password: values.password,
      });
      if (loginResult) {
        loginModalStore.hide();
        message.success("登录成功");
      }
    } else {
      await authStore.register({
        username: values.username,
        password: values.password,
        checkPassword: values.checkPassword,
      });
      isLogin.value = true;
      message.success("注册成功，请登录");
    }
  } catch (error) {
    console.error("认证错误:", error);
  } finally {
    loading.value = false;
  }
};

// 取消处理
const handleCancel = () => {
  loginModalStore.hide();
};

// 获取滚动条宽度
const getScrollbarWidth = () => {
  const outer = document.createElement("div");
  outer.style.visibility = "hidden";
  outer.style.overflow = "scroll";
  document.body.appendChild(outer);

  const inner = document.createElement("div");
  outer.appendChild(inner);

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  outer.parentNode.removeChild(outer);

  return scrollbarWidth;
};

// 监听模态框显示状态
watch(isVisible, (newValue) => {
  if (newValue) {
    // 模态框打开时
    const scrollbarWidth = getScrollbarWidth();
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.overflow = "hidden";
  } else {
    // 模态框关闭时，等待动画结束
    setTimeout(() => {
      document.body.style.paddingRight = "";
      document.body.style.overflow = "";
    }, 300); // 300ms 与动画时长保持一致
  }
});
</script>

<style scoped>
.modal-transform {
  transform-origin: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-transform-enter-from,
.modal-transform-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.modal-transform-enter-to,
.modal-transform-leave-from {
  opacity: 1;
  transform: scale(1);
}

/* 自定义模态框样式 */
:deep(.ant-modal-content) {
  padding: 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

:deep(.ant-modal-body) {
  padding: 0;
}

:deep(.ant-modal-footer) {
  display: none;
}

/* 动画效果 */
.modal-transform {
  transform-origin: center;
}

:deep(.ant-modal) {
  padding-bottom: 0;
}

:deep(.ant-modal-mask) {
  background-color: rgba(0, 0, 0, 0.45);
}

/* Ant Design 表单样式调整 */
:deep(.ant-input-affix-wrapper) {
  border-radius: 8px;
  padding: 8px 11px;
}

:deep(.ant-btn) {
  border-radius: 8px;
  height: 42px;
  margin-top: 0;
}

:deep(.ant-btn-primary) {
  background: linear-gradient(to right, #3b82f6, #2563eb);
  border: none;
  transition: all 0.3s ease;
}

:deep(.ant-btn-primary:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

:deep(.site-form-item-icon) {
  color: #bfbfbf;
}

:deep(.ant-form-item-explain-error) {
  font-size: 12px;
  margin-top: 4px;
}

/* 统一表单项间距 */
:deep(.ant-form-item) {
  margin-bottom: 24px !important;
}

:deep(.ant-form-item:last-child) {
  margin-bottom: 0;
}

/* 自定义关闭按钮样式 */
:deep(.ant-modal-close) {
  top: 16px;
  right: 16px;
  color: #999;
  transition: all 0.3s ease;
}

:deep(.ant-modal-close:hover) {
  color: #666;
  transform: rotate(90deg);
}

:deep(.ant-modal-close-x) {
  width: 32px;
  height: 32px;
  line-height: 32px;
}
</style>
