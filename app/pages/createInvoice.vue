<template>
  <NuxtLayout name="ejemplo">

    <div class="min-h-screen p-4 sm:p-6 lg:p-8">
      <div class="max-w-4xl mx-auto">
        <div class="space-y-4 sm:space-y-6">
          <!-- Step 1: Form -->
          <div v-if="currentStep === 1">
            <div class="text-center mb-4 sm:mb-6">
              <div
                class="w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span class="text-white font-bold text-sm sm:text-base">1</span>
              </div>
              <h2 class="text-lg sm:text-xl font-semibold text-white">Customer Information</h2>
            </div>
            <InvoiceForm :initial-data="invoiceData" @form-submitted="handleFormSubmit" />
          </div>

          <!-- Step 2: Preview -->
          <div v-if="currentStep === 2">
            <div class="text-center mb-4 sm:mb-6">
              <div
                class="w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span class="text-white font-bold text-sm sm:text-base">2</span>
              </div>
              <h2 class="text-lg sm:text-xl font-semibold text-white">Preview</h2>
            </div>
            <InvoicePDF :invoice-data="invoiceData" @pdf-generated="handlePDFGenerated" />
            <div class="flex space-x-3 mt-4 sm:mt-6">
              <button @click="goBack"
                class="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-xl transition-colors duration-200 font-medium">
                Back
              </button>
            </div>
          </div>

          <!-- Step 3: Download PDF -->
          <div v-if="currentStep === 3">
            <div class="text-center mb-4 sm:mb-6">
              <div
                class="w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span class="text-white font-bold text-sm sm:text-base">3</span>
              </div>
              <h2 class="text-lg sm:text-xl font-semibold text-white">Download PDF</h2>
            </div>
            <div class="bg-gray-800 rounded-2xl p-4 sm:p-6 text-center">
              <div
                class="w-12 h-12 sm:w-16 sm:h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg class="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 class="text-base sm:text-lg font-semibold text-white mb-2">Invoice Generated!</h3>
              <button @click="createNewInvoice"
                class="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl mt-4 sm:mt-6 transition-colors duration-200 font-medium">
                Create New Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref } from 'vue'
import InvoiceForm from '~/components/mainContent/InvoiceForm.vue'
import InvoicePDF from '~/components/mainContent/InvoicePDF.vue'

const currentStep = ref(1)
const invoiceData = ref(null)

const handleFormSubmit = (data) => {
  invoiceData.value = data
  currentStep.value = 2
}

const handlePDFGenerated = () => {
  currentStep.value = 3
}

const goBack = () => {
  currentStep.value = 1
}

const createNewInvoice = () => {
  // Clear the data and reset to step 1
  invoiceData.value = null
  currentStep.value = 1
}
</script>