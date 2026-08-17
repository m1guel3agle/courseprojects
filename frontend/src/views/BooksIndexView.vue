<script setup lang="ts">
import { BookService } from '@/services/BookService.js';
const books = BookService.getBooks();

function deleteLastBook() {
  BookService.deleteLastBook();
}
</script>

<template>
  <section>
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-end mb-6 space-x-3">
        <button
          @click="deleteLastBook"
          class="inline-block bg-red-600 text-white font-semibold px-5 py-2 rounded hover:bg-red-700 transition"
        >
          Delete Last Book
        </button>
        <RouterLink
          to="/books/create"
          class="inline-block bg-blue-600 text-white font-semibold px-5 py-2 rounded hover:bg-blue-700 transition"
        >+ Add Book</RouterLink>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="book in books" :key="book.id">
          <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 p-6 border border-gray-200">
            <div class="flex justify-between items-center mb-2">
              <h3 class="text-xl font-semibold text-gray-800">
                {{ book.title }}
              </h3>
              <span v-if="book.stock > 0" class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full ml-2">
                {{ book.stock }} available
              </span>
              <span v-else class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full ml-2">
                Not available
              </span>
            </div>
            <div class="flex justify-center mb-4">
              <img
                src="https://picsum.photos/seed/picsum/536/354"
                alt="Book Cover"
                class="object-cover rounded shadow-sm w-full h-auto"
              />
            </div>
            <p class="text-gray-500 text-sm mb-3">
              <i class="fas fa-tag mr-2"></i>
              {{ book.category }}
            </p>
            <div class="bg-gray-50 rounded-lg p-3 mb-4">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Price:</span>
                <span class="font-semibold">${{ book.price }}</span>
              </div>
            </div>
            <div class="flex justify-center">
              <RouterLink
                :to="`/books/${book.id}`"
                class="bg-blue-100 hover:bg-blue-200 text-blue-600 font-semibold py-2 px-3 rounded transition duration-300"
              >
                More info <i class="fas fa-info-circle"></i>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>