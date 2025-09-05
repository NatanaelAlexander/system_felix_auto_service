<template>
  <div class="bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4">
    <div class="space-y-3 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-4">
      <!-- Search Input -->
      <div class="lg:col-span-2">
        <label class="block text-xs font-medium text-gray-300 mb-1">Search</label>
        <div class="relative">
          <input 
            v-model="filters.search"
            @input="handleSearchChange"
            type="text" 
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 pl-8 text-sm text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors duration-200" 
            placeholder="Name, VIN, or License Plate"
          />
          <svg class="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>

      <!-- Date Filter -->
      <div>
        <label class="block text-xs font-medium text-gray-300 mb-1">Date</label>
        <div class="relative">
          <input 
            v-model="filters.date"
            @change="handleDateChange"
            type="date" 
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 pl-8 text-sm text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors duration-200" 
          />
          <svg class="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
      </div>

      <!-- Clear Filters Button -->
      <div class="lg:col-span-3">
        <button 
          @click="clearFilters"
          class="w-full lg:w-auto bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <span>Clear Filters</span>
        </button>
      </div>
    </div>

    <!-- Loading Indicator -->
    <div v-if="isApplyingFilter" class="mt-3 pt-3 border-t border-gray-700">
      <div class="flex items-center justify-center space-x-2 text-gray-400">
        <div class="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
        <span class="text-xs">Applying filters...</span>
      </div>
    </div>

    <!-- Active Filters Display -->
    <div v-if="hasActiveFilters" class="mt-3 pt-3 border-t border-gray-700">
      <div class="flex flex-wrap items-center gap-1.5">
        <span class="text-xs text-gray-400">Active:</span>
        
        <div v-if="filters.search" class="flex items-center bg-red-600/20 text-red-400 px-2 py-1 rounded text-xs">
          <span class="truncate max-w-20">"{{ filters.search }}"</span>
          <button @click="clearSearch" class="ml-1 hover:text-red-300">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div v-if="filters.date" class="flex items-center bg-red-600/20 text-red-400 px-2 py-1 rounded text-xs">
          <span>{{ formatDisplayDate(filters.date) }}</span>
          <button @click="clearDate" class="ml-1 hover:text-red-300">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const emit = defineEmits(['filters-changed'])

const filters = ref({
  search: '',
  date: ''
})

const isApplyingFilter = ref(false)

// Computed property to check if there are active filters
const hasActiveFilters = computed(() => {
  return filters.value.search.trim() !== '' || filters.value.date !== ''
})

// Watch for changes in filters and emit to parent (with delay)
let filterTimeout = null
watch(filters, (newFilters) => {
  // Clear any existing timeout
  clearTimeout(filterTimeout)
  
  // Show loading state
  isApplyingFilter.value = true
  
  // Set a delay before emitting the changes
  filterTimeout = setTimeout(() => {
    emit('filters-changed', {
      filter: newFilters.search.trim() || undefined,
      date: newFilters.date || undefined
    })
    isApplyingFilter.value = false
  }, 1500) // 1.5 seconds delay
}, { deep: true })

// Handle search input changes
const handleSearchChange = () => {
  // The watch will handle the emission with delay
}

// Handle date changes
const handleDateChange = () => {
  // The watch will handle the emission with delay
}

// Clear all filters
const clearFilters = () => {
  clearTimeout(filterTimeout)
  filters.value.search = ''
  filters.value.date = ''
  isApplyingFilter.value = false
}

// Clear individual filters
const clearSearch = () => {
  filters.value.search = ''
}

const clearDate = () => {
  filters.value.date = ''
}

// Format date for display
const formatDisplayDate = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
/* Custom styles for date input */
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}

input[type="date"]::-webkit-datetime-edit-text {
  color: white;
}

input[type="date"]::-webkit-datetime-edit-month-field,
input[type="date"]::-webkit-datetime-edit-day-field,
input[type="date"]::-webkit-datetime-edit-year-field {
  color: white;
}
</style>
