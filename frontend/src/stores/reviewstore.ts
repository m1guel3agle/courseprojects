import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ReviewInterface } from '@/interfaces/ReviewInterface.js';

export const useReviewStore = defineStore('review', () => {
  const reviews = ref<ReviewInterface[]>([]);

  return { reviews };
});