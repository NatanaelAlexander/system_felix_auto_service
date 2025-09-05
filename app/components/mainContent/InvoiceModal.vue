<template>
  <!-- Modal Overlay -->
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="closeModal">
    <!-- Modal Content -->
    <div class="bg-gray-800 rounded-xl sm:rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" @click.stop>
      <!-- Header -->
      <div class="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg sm:text-xl font-semibold text-white">Invoice Details</h2>
            <p class="text-sm text-gray-400">Invoice #{{ invoiceData?.id }}</p>
          </div>
          <button @click="closeModal" class="text-gray-400 hover:text-white transition-colors duration-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 modal-scroll">
        <!-- Invoice Information -->
        <div class="bg-gray-700 rounded-xl p-4 sm:p-6">
          <h3 class="text-base sm:text-lg font-semibold text-white mb-4">Invoice Information</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p class="text-gray-400 text-sm">Invoice ID</p>
              <p class="text-white font-medium">#{{ invoiceData?.id }}</p>
            </div>
            <div>
              <p class="text-gray-400 text-sm">Date</p>
              <p class="text-white font-medium">{{ formatDate(invoiceData?.date) }}</p>
            </div>
          </div>
        </div>

        <!-- Customer Information -->
        <div class="bg-gray-700 rounded-xl p-4 sm:p-6">
          <h3 class="text-base sm:text-lg font-semibold text-white mb-4">Customer Information</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p class="text-gray-400 text-sm">Name</p>
              <p class="text-white font-medium">{{ invoiceData?.customer_name }}</p>
            </div>
            <div>
              <p class="text-gray-400 text-sm">Phone</p>
              <p class="text-white font-medium">{{ invoiceData?.customer_phone_1 }}</p>
            </div>
          </div>
        </div>

        <!-- Vehicle Information -->
        <div class="bg-gray-700 rounded-xl p-4 sm:p-6">
          <h3 class="text-base sm:text-lg font-semibold text-white mb-4">Vehicle Information</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p class="text-gray-400 text-sm">Vehicle</p>
              <p class="text-white font-medium">{{ invoiceData?.vehicle_name }} {{ invoiceData?.vehicle_year }}</p>
            </div>
            <div>
              <p class="text-gray-400 text-sm">License Plate</p>
              <p class="text-white font-medium">{{ invoiceData?.vehicle_licence_plate }}</p>
            </div>
            <div class="sm:col-span-2">
              <p class="text-gray-400 text-sm">VIN</p>
              <p class="text-white font-medium text-xs sm:text-sm">{{ invoiceData?.vehicle_vin }}</p>
            </div>
          </div>
        </div>

        <!-- Services -->
        <div class="bg-gray-700 rounded-xl p-4 sm:p-6">
          <h3 class="text-base sm:text-lg font-semibold text-white mb-4">Services ({{ invoiceData?.services?.length || 0 }})</h3>
          <div class="space-y-3">
            <div v-for="(service, index) in invoiceData?.services" :key="service.id" class="bg-gray-600 rounded-lg p-3 sm:p-4">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div class="flex-1">
                  <p class="text-white font-medium text-sm sm:text-base">{{ index + 1 }}. {{ service.description }}</p>
                </div>
                <div class="text-right">
                  <p class="text-red-400 font-bold text-sm sm:text-base">${{ service.amount.toFixed(2) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Totals -->
        <div class="bg-gray-700 rounded-xl p-4 sm:p-6">
          <h3 class="text-base sm:text-lg font-semibold text-white mb-4">Cost Summary</h3>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-400">Subtotal:</span>
              <span class="text-white font-medium">${{ invoiceData?.sub_total?.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Tax ({{ invoiceData?.tax }}%):</span>
              <span class="text-white font-medium">${{ ((invoiceData?.sub_total || 0) * ((invoiceData?.tax || 0) / 100)).toFixed(2) }}</span>
            </div>
            <div class="border-t border-gray-600 pt-2">
              <div class="flex justify-between">
                <span class="text-white font-bold text-lg">Total:</span>
                <span class="text-red-400 font-bold text-lg">${{ invoiceData?.total?.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-4 sm:p-6 rounded-b-xl sm:rounded-b-2xl">
        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <!-- Generate PDF Button -->
          <button 
            @click="generatePDF" 
            :disabled="isGeneratingPDF"
            class="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white py-3 px-4 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <svg v-if="!isGeneratingPDF" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            <div v-else class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>{{ isGeneratingPDF ? 'Generating...' : 'Generate PDF' }}</span>
          </button>

          <!-- Delete Button -->
          <button 
            @click="showDeleteConfirmation" 
            :disabled="isDeleting"
            class="flex-1 bg-red-800 hover:bg-red-900 disabled:bg-gray-600 text-white py-3 px-4 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <svg v-if="!isDeleting" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            <div v-else class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>{{ isDeleting ? 'Deleting...' : 'Delete Invoice' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-[60]" @click="cancelDelete">
      <div class="bg-gray-800 rounded-xl sm:rounded-2xl w-full max-w-md p-6" @click.stop>
        <!-- Warning Icon -->
        <div class="flex items-center justify-center w-16 h-16 bg-red-900/20 rounded-full mx-auto mb-4">
          <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        
        <!-- Title -->
        <h3 class="text-lg font-semibold text-white text-center mb-2">Delete Invoice</h3>
        
        <!-- Message -->
        <p class="text-gray-400 text-sm text-center mb-6">
          Are you sure you want to delete invoice <span class="text-white font-medium">#{{ invoiceData?.id }}</span>? 
          This action cannot be undone.
        </p>
        
        <!-- Buttons -->
        <div class="flex flex-col sm:flex-row gap-3">
          <button 
            @click="cancelDelete"
            class="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-xl font-medium transition-colors duration-200"
          >
            Cancel
          </button>
          <button 
            @click="deleteInvoice"
            :disabled="isDeleting"
            class="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white py-3 px-4 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <div v-if="isDeleting" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>{{ isDeleting ? 'Deleting...' : 'Delete' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Hidden PDF Generator Component -->
    <InvoicePDF 
      v-if="invoiceData"
      ref="pdfGeneratorRef"
      :invoice-data="invoiceData"
      :show-preview="false"
      :show-download-button="false"
      :create-invoice-in-d-b="false"
      @pdf-generated="isGeneratingPDF = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import InvoicePDF from './InvoicePDF.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  invoiceData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'invoice-deleted'])

const isGeneratingPDF = ref(false)
const isDeleting = ref(false)
const showDeleteConfirm = ref(false)
const pdfGeneratorRef = ref(null)

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
      month: 'long',
      day: 'numeric'
    })
  }
  
  // For other formats, parse normally
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Close modal
const closeModal = () => {
  emit('close')
}

// Generate PDF
const generatePDF = async () => {
  if (!pdfGeneratorRef.value) return
  
  isGeneratingPDF.value = true
  try {
    await pdfGeneratorRef.value.generatePDF()
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Error generating PDF')
  } finally {
    isGeneratingPDF.value = false
  }
}

// Show delete confirmation modal
const showDeleteConfirmation = () => {
  showDeleteConfirm.value = true
}

// Cancel delete
const cancelDelete = () => {
  showDeleteConfirm.value = false
}

// Delete invoice
const deleteInvoice = async () => {
  if (!props.invoiceData?.id) return
  
  isDeleting.value = true
  showDeleteConfirm.value = false
  
  try {
    const config = useRuntimeConfig()
    const url = config.public.apiBase
    
    const response = await axios.delete(`${url}/api/invoice/deteleInvoice`, {
      data: {
        invoice_id: props.invoiceData.id
      },
      withCredentials: true // Include cookies for authentication
    })
    
    if (response.data.message === 'delete success') {
      emit('invoice-deleted')
      closeModal()
    } else {
      throw new Error(response.data.message || 'Failed to delete invoice')
    }
    
  } catch (error) {
    console.error('Error deleting invoice:', error)
    alert(error.response?.data?.message || error.message || 'Failed to delete invoice')
  } finally {
    isDeleting.value = false
  }
}
</script>

<style scoped>
/* Custom scrollbar for modal content */
.modal-scroll::-webkit-scrollbar {
  width: 8px;
}

.modal-scroll::-webkit-scrollbar-track {
  background: #374151; /* gray-700 */
  border-radius: 4px;
}

.modal-scroll::-webkit-scrollbar-thumb {
  background: #6B7280; /* gray-500 */
  border-radius: 4px;
}

.modal-scroll::-webkit-scrollbar-thumb:hover {
  background: #9CA3AF; /* gray-400 */
}

/* Firefox scrollbar */
.modal-scroll {
  scrollbar-width: thin;
  scrollbar-color: #6B7280 #374151;
}
</style>
