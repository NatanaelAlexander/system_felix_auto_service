<template>
  <div class="space-y-4 sm:space-y-6">
    <!-- Customer Information -->
    <div class="bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
      <h3 class="text-lg font-semibold text-white mb-4">Customer Information</h3>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Customer Name</label>
          <input v-model="form.name" @input="toUpperCase('name')" type="text" class="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white" placeholder="Full name" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Phone</label>
          <input v-model="form.phone" type="tel" class="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white" placeholder="(757) 123-4567" />
        </div>
      </div>
    </div>

    <!-- Vehicle Information -->
    <div class="bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
      <h3 class="text-base sm:text-lg font-semibold text-white mb-4">Vehicle Information</h3>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Vehicle</label>
          <input v-model="form.car" @input="toUpperCase('car')" type="text" class="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white" placeholder="Toyota Camry" />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Year</label>
            <input v-model="form.year" type="text" class="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white" placeholder="2020" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">License Plate</label>
            <input v-model="form.plate" @input="toUpperCase('plate')" type="text" class="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white" placeholder="ABC-123" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">VIN</label>
          <input v-model="form.vin" @input="toUpperCase('vin')" type="text" class="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white" placeholder="1HGBH41JXMN109186" />
        </div>
      </div>
    </div>

    <!-- Services -->
    <div class="bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-base sm:text-lg font-semibold text-white">Services</h3>
        <button @click="addService" class="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm transition-colors duration-200">
          + Add
        </button>
      </div>
      <div class="space-y-3 sm:space-y-4">
        <div v-for="(service, index) in form.services" :key="index" class="bg-gray-700 rounded-lg sm:rounded-xl p-3 sm:p-4">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-gray-300">Service {{ index + 1 }}</span>
            <button v-if="form.services.length > 1" @click="removeService(index)" class="text-red-400 text-sm">
              Remove
            </button>
          </div>
          <div class="space-y-3">
            <input v-model="service.description" @input="toUpperCaseService(index, 'description')" type="text" class="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white" placeholder="Service description" />
            <input v-model="service.amount" type="number" step="0.01" class="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white" placeholder="0.00" />
          </div>
        </div>
      </div>
    </div>

    <!-- Totals -->
    <div class="bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
      <h3 class="text-base sm:text-lg font-semibold text-white mb-4">Summary</h3>
      <div class="space-y-3">
        <div class="flex justify-between">
          <span class="text-gray-300">Subtotal:</span>
          <span class="text-white font-semibold">${{ subtotal.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-300">Tax ({{ taxRate }}%):</span>
          <span class="text-white font-semibold">${{ taxAmount.toFixed(2) }}</span>
        </div>
        <div class="border-t border-gray-600 pt-3">
          <div class="flex justify-between">
            <span class="text-white font-bold text-lg">Total:</span>
            <span class="text-red-400 font-bold text-lg">${{ total.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Errors -->
    <div v-if="errors.length > 0" class="bg-red-900/20 border border-red-500 rounded-xl p-4">
      <h4 class="text-red-400 font-semibold mb-2">Please complete the following fields:</h4>
      <ul class="space-y-1">
        <li v-for="error in errors" :key="error" class="text-red-300 text-sm">
          • {{ error }}
        </li>
      </ul>
    </div>

    <!-- Continue Button -->
    <button @click="handleSubmit" class="w-full bg-red-600 hover:bg-red-700 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold text-base sm:text-lg transition-colors duration-200">
      Continue
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  initialData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['form-submitted'])

const form = ref({
  name: '',
  phone: '',
  car: '',
  year: '',
  plate: '',
  vin: '',
  invoice: generateInvoiceNumber(),
  date: new Date().toISOString().split('T')[0],
  services: [{ description: '', amount: 0 }]
})

const errors = ref([])
const taxRate = 6.5

// Function to convert text to uppercase
const toUpperCase = (field) => {
  if (form.value[field]) {
    form.value[field] = form.value[field].toUpperCase()
  }
}

// Function to convert service description to uppercase
const toUpperCaseService = (index, field) => {
  if (form.value.services[index] && form.value.services[index][field]) {
    form.value.services[index][field] = form.value.services[index][field].toUpperCase()
  }
}

// Watch for initial data changes and populate form
watch(() => props.initialData, (newData) => {
  if (newData) {
    form.value = {
      name: newData.name || '',
      phone: newData.phone || '',
      car: newData.car || '',
      year: newData.year || '',
      plate: newData.plate || '',
      vin: newData.vin || '',
      invoice: newData.invoice || generateInvoiceNumber(),
      date: newData.date || new Date().toISOString().split('T')[0],
      services: newData.services ? [...newData.services] : [{ description: '', amount: 0 }]
    }
  }
}, { immediate: true })

const subtotal = computed(() => {
  return form.value.services.reduce((sum, service) => {
    return sum + (parseFloat(service.amount) || 0)
  }, 0)
})

const taxAmount = computed(() => {
  return subtotal.value * (taxRate / 100)
})

const total = computed(() => {
  return subtotal.value + taxAmount.value
})

function generateInvoiceNumber() {
  return 'INV-' + Date.now().toString().slice(-6)
}

function addService() {
  form.value.services.push({ description: '', amount: 0 })
}

function removeService(index) {
  if (form.value.services.length > 1) {
    form.value.services.splice(index, 1)
  }
}

function handleSubmit() {
  errors.value = []
  
  // Validate customer information
  if (!form.value.name.trim()) {
    errors.value.push('Customer name')
  }
  
  // Validate vehicle information
  if (!form.value.car.trim()) {
    errors.value.push('Vehicle model')
  }
  
  if (!form.value.year.trim()) {
    errors.value.push('Vehicle year')
  }
  
  if (!form.value.plate.trim()) {
    errors.value.push('Vehicle license plate')
  }
  
  if (!form.value.vin.trim()) {
    errors.value.push('Vehicle VIN')
  }
  
  // Validate services
  form.value.services.forEach((service, index) => {
    if (!service.description.trim()) {
      errors.value.push(`Service ${index + 1} description`)
    }
    
    if (!service.amount || service.amount === '' || parseFloat(service.amount) === 0) {
      errors.value.push(`Service ${index + 1} price (cannot be empty or $0)`)
    }
  })
  
  // If there are errors, don't continue
  if (errors.value.length > 0) {
    return
  }
  
  // If everything is good, send data
  const invoiceData = {
    ...form.value,
    subtotal: subtotal.value,
    taxRate,
    taxAmount: taxAmount.value,
    total: total.value
  }
  emit('form-submitted', invoiceData)
}
</script> 