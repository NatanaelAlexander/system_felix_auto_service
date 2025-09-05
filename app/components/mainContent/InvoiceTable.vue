<template>
  <div class="space-y-4 sm:space-y-6">
    <!-- Filters -->
    <InvoiceFilters @filters-changed="handleFiltersChange" />

    <!-- Loading State -->
    <div v-if="isLoading" class="bg-gray-800 rounded-xl sm:rounded-2xl p-6 text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
      <p class="text-gray-400">Loading invoices...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-900/20 border border-red-500 rounded-xl sm:rounded-2xl p-4 sm:p-6">
      <div class="flex items-center space-x-3">
        <svg class="w-6 h-6 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <h3 class="text-red-400 font-semibold">Error loading invoices</h3>
          <p class="text-red-300 text-sm">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="invoices.length === 0" class="bg-gray-800 rounded-xl sm:rounded-2xl p-6 text-center">
      <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      </div>
      <h3 class="text-white font-semibold mb-2">No invoices found</h3>
      <p class="text-gray-400 text-sm">There are no more invoices to display on this page.</p>
    </div>

    <!-- Invoices Table -->
    <div v-else class="space-y-3 sm:space-y-4">
      <div v-for="invoice in invoices" :key="invoice.id" @click="openModal(invoice)" class="bg-gray-800 hover:bg-gray-700 hover:shadow-lg hover:shadow-black/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 cursor-pointer transition-all duration-300 transform hover:scale-[1.02]">
        <!-- Mobile Layout -->
        <div class="block sm:hidden">
          <div class="flex items-start justify-between mb-3">
            <div>
              <h3 class="text-white font-semibold text-sm">Invoice #{{ invoice.id }}</h3>
              <p class="text-gray-400 text-xs">{{ formatDate(invoice.date) }}</p>
            </div>
            <div class="text-right">
              <p class="text-red-400 font-bold text-sm">${{ invoice.total.toFixed(2) }}</p>
              <p class="text-gray-400 text-xs">{{ invoice.services.length }} service{{ invoice.services.length !== 1 ? 's' : '' }}</p>
            </div>
          </div>
          
          <div class="space-y-2">
            <div class="flex justify-between text-xs">
              <span class="text-gray-400">Customer:</span>
              <span class="text-white">{{ invoice.customer_name }}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-gray-400">Vehicle:</span>
              <span class="text-white">{{ invoice.vehicle_name }} {{ invoice.vehicle_year }}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-gray-400">Plate:</span>
              <span class="text-white">{{ invoice.vehicle_licence_plate }}</span>
            </div>
          </div>

        </div>

        <!-- Desktop Layout -->
        <div class="hidden sm:block">
          <div class="grid grid-cols-12 gap-4 items-center">
            <!-- Invoice ID & Date -->
            <div class="col-span-2">
              <h3 class="text-white font-semibold text-sm">#{{ invoice.id }}</h3>
              <p class="text-gray-400 text-xs">{{ formatDate(invoice.date) }}</p>
            </div>
            
            <!-- Customer -->
            <div class="col-span-3">
              <p class="text-white text-sm font-medium">{{ invoice.customer_name }}</p>
              <p class="text-gray-400 text-xs">{{ invoice.customer_phone_1 }}</p>
            </div>
            
            <!-- Vehicle -->
            <div class="col-span-3">
              <p class="text-white text-sm">{{ invoice.vehicle_name }} {{ invoice.vehicle_year }}</p>
              <p class="text-gray-400 text-xs">{{ invoice.vehicle_licence_plate }}</p>
            </div>
            
            <!-- Services Count -->
            <div class="col-span-2 text-center">
              <p class="text-white text-sm font-medium">{{ invoice.services.length }}</p>
              <p class="text-gray-400 text-xs">service{{ invoice.services.length !== 1 ? 's' : '' }}</p>
            </div>
            
            <!-- Total -->
            <div class="col-span-2 text-right">
              <p class="text-red-400 font-bold text-sm">${{ invoice.total.toFixed(2) }}</p>
              <p class="text-gray-400 text-xs">Tax: {{ invoice.tax }}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="invoices.length > 0" class="bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
      <div class="flex items-center justify-center space-x-4">
        <button 
          @click="goToPreviousPage" 
          :disabled="currentPage === 1 || isLoading"
          class="w-10 h-10 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        
        <span class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium">
          {{ currentPage }}
        </span>
        
        <button 
          @click="goToNextPage" 
          :disabled="invoices.length < 10 || isLoading"
          class="w-10 h-10 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Invoice Modal -->
    <InvoiceModal 
      :is-open="isModalOpen" 
      :invoice-data="selectedInvoice" 
      @close="closeModal"
      @invoice-deleted="handleInvoiceDeleted"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import InvoiceModal from './InvoiceModal.vue'
import InvoiceFilters from './InvoiceFilters.vue'

const invoices = ref([])
const currentPage = ref(1)
const isLoading = ref(false)
const error = ref(null)

// Modal state
const isModalOpen = ref(false)
const selectedInvoice = ref(null)

// Filter state
const currentFilters = ref({
  filter: undefined,
  date: undefined
})
const isFiltered = ref(false)

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return ''
  
  // If it's already in YYYY-MM-DD format, parse it correctly to avoid timezone issues
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    // Parse the date string directly to avoid timezone issues
    const [year, month, day] = dateString.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  // For other formats, parse normally
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Fetch invoices from API (normal or filtered)
const fetchInvoices = async (page = 1, filters = null) => {
  isLoading.value = true
  error.value = null
  
  try {
    const config = useRuntimeConfig()
    const url = config.public.apiBase
    
    let response
    
    if (filters && (filters.filter || filters.date)) {
      // Use filtered API
      response = await axios.post(`${url}/api/invoice/filterInvoices`, {
        page: page,
        filter: filters.filter,
        date: filters.date
      }, {
        withCredentials: true
      })
    } else {
      // Use normal API
      response = await axios.post(`${url}/api/invoice/invoicesPerPage`, {
        page: page
      }, {
        withCredentials: true
      })
    }
    
    if (response.data.response.status === 200) {
      invoices.value = response.data.response.data || []
      currentPage.value = page
    } else {
      throw new Error(response.data.response.message || 'Failed to fetch invoices')
    }
    
  } catch (err) {
    console.error('Error fetching invoices:', err)
    error.value = err.response?.data?.message || err.message || 'Failed to load invoices'
    invoices.value = []
  } finally {
    isLoading.value = false
  }
}

// Handle filters change
const handleFiltersChange = (filters) => {
  currentFilters.value = filters
  isFiltered.value = !!(filters.filter || filters.date)
  
  // Reset to page 1 when filters change
  currentPage.value = 1
  fetchInvoices(1, filters)
}

// Navigation functions
const goToNextPage = () => {
  if (invoices.value.length === 10 && !isLoading.value) {
    fetchInvoices(currentPage.value + 1, isFiltered.value ? currentFilters.value : null)
  }
}

const goToPreviousPage = () => {
  if (currentPage.value > 1 && !isLoading.value) {
    fetchInvoices(currentPage.value - 1, isFiltered.value ? currentFilters.value : null)
  }
}

// Modal functions
const openModal = (invoice) => {
  selectedInvoice.value = invoice
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedInvoice.value = null
}

const handleInvoiceDeleted = () => {
  // Refresh the current page to update the list, maintaining current filters
  fetchInvoices(currentPage.value, isFiltered.value ? currentFilters.value : null)
}

// Load initial data
onMounted(() => {
  fetchInvoices(1)
})
</script>

<style scoped>
/* Custom scrollbar for better mobile experience */
.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #374151;
  border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #6B7280;
  border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #9CA3AF;
}
</style>
