import { computed } from 'vue';
import { defineStore } from 'pinia';

export const useLoginModalStore = defineStore('loginModal', {
  state: () => ({
    isVisible: false,
  }),
  actions: {
    show() {
      this.isVisible = true;
    },
    hide() {
      this.isVisible = false;
    },
  },
});

export const useLoginModal = () => {
  const loginModalStore = useLoginModalStore();
  
  return {
    showLoginModal: () => loginModalStore.show(),
    hideLoginModal: () => loginModalStore.hide(),
    isLoginModalVisible: computed(() => loginModalStore.isVisible),
  };
};
