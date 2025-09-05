<template>
  <div v-if="showPreview" class="space-y-4 sm:space-y-6">
    <!-- Invoice preview -->
    <div class="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <div class="flex items-center space-x-2 sm:space-x-3">
          <div class="w-8 h-8 sm:w-10 sm:h-10 bg-red-600 rounded-lg flex items-center justify-center">
            <img src="/logo_fenix_sin_fondo.png" alt="Logo" class="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
          </div>
          <div>
            <h1 class="text-base sm:text-lg font-bold text-gray-900">RICARDO FELIX</h1>
            <p class="text-xs sm:text-sm font-semibold text-red-600">FELIX AUTO SERVICE LLC</p>
          </div>
        </div>
        <div class="text-left sm:text-right">
          <h2 class="text-lg sm:text-xl font-bold text-gray-900">INVOICE</h2>
          <p class="text-xs text-gray-600">#{{ getInvoiceNumber() }}</p>
        </div>
      </div>
      
      <!-- Customer information -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div class="bg-gray-50 rounded-lg p-3 sm:p-4">
          <h3 class="text-sm sm:text-base font-semibold text-gray-900 mb-2">Customer</h3>
          <p class="text-sm text-gray-700">{{ getCustomerName() }}</p>
          <p class="text-sm text-gray-700">{{ getCustomerPhone() }}</p>
        </div>
        <div class="bg-gray-50 rounded-lg p-3 sm:p-4">
          <h3 class="text-sm sm:text-base font-semibold text-gray-900 mb-2">Vehicle</h3>
          <p class="text-sm text-gray-700">{{ getVehicleName() }} {{ getVehicleYear() }}</p>
          <p class="text-sm text-gray-700">License Plate: {{ getLicensePlate() }}</p>
          <p class="text-xs text-gray-700">VIN: {{ getVIN() }}</p>
        </div>
      </div>
      
      <!-- Services -->
      <div class="mb-4 sm:mb-6">
        <h3 class="text-sm sm:text-base font-semibold text-gray-900 mb-3">Services</h3>
        <div class="space-y-2">
          <div v-for="(service, index) in getServices()" :key="index" class="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-200 last:border-b-0 space-y-1 sm:space-y-0">
            <span class="text-sm text-gray-700 break-words">{{ service.description }}</span>
            <span class="text-sm font-semibold text-gray-900">${{ parseFloat(service.amount).toFixed(2) }}</span>
          </div>
        </div>
      </div>
      
      <!-- Totals -->
      <div class="border-t border-gray-200 pt-3 sm:pt-4">
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">Subtotal:</span>
            <span class="text-sm text-black font-semibold">${{ getSubtotal().toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">Tax ({{ getTaxRate() }}%):</span>
            <span class="text-sm text-black font-semibold">${{ getTaxAmount().toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-base sm:text-lg font-bold text-red-600">
            <span>TOTAL:</span>
            <span>${{ getTotal().toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Download button -->
    <button v-if="showDownloadButton" @click="generatePDF" :disabled="isGenerating" class="w-full bg-red-600 hover:bg-red-700 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold text-base sm:text-lg flex items-center justify-center transition-colors duration-200">
      <svg v-if="!isGenerating" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
      </svg>
      <span v-if="isGenerating">Generating...</span>
      <span v-else>Download PDF</span>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const props = defineProps({
  invoiceData: {
    type: Object,
    required: true
  },
  showPreview: {
    type: Boolean,
    default: true
  },
  showDownloadButton: {
    type: Boolean,
    default: true
  },
  createInvoiceInDB: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['pdf-generated'])
const isGenerating = ref(false)

// Helper functions to handle different data formats
const getInvoiceNumber = () => {
  return props.invoiceData.invoice || props.invoiceData.id || 'N/A'
}

const getCustomerName = () => {
  return props.invoiceData.name || props.invoiceData.customer_name || 'N/A'
}

const getCustomerPhone = () => {
  return props.invoiceData.phone || props.invoiceData.customer_phone_1 || 'N/A'
}

const getVehicleName = () => {
  return props.invoiceData.car || props.invoiceData.vehicle_name || 'N/A'
}

const getVehicleYear = () => {
  return props.invoiceData.year || props.invoiceData.vehicle_year || 'N/A'
}

const getLicensePlate = () => {
  return props.invoiceData.plate || props.invoiceData.vehicle_licence_plate || 'N/A'
}

const getVIN = () => {
  return props.invoiceData.vin || props.invoiceData.vehicle_vin || 'N/A'
}

const getServices = () => {
  return props.invoiceData.services || []
}

const getSubtotal = () => {
  return props.invoiceData.subtotal || props.invoiceData.sub_total || 0
}

const getTaxRate = () => {
  return props.invoiceData.taxRate || props.invoiceData.tax || 0
}

const getTaxAmount = () => {
  if (props.invoiceData.taxAmount) {
    return props.invoiceData.taxAmount
  }
  const subtotal = getSubtotal()
  const taxRate = getTaxRate()
  return subtotal * (taxRate / 100)
}

const getTotal = () => {
  return props.invoiceData.total || 0
}

// Function to split text into multiple lines based on width
const splitTextToSize = (pdf, text, maxWidth) => {
  const words = text.split(' ')
  const lines = []
  let currentLine = ''
  
  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine ? currentLine + ' ' + words[i] : words[i]
    const testWidth = pdf.getTextWidth(testLine)
    
    if (testWidth > maxWidth && currentLine !== '') {
      lines.push(currentLine)
      currentLine = words[i]
    } else {
      currentLine = testLine
    }
  }
  
  if (currentLine) {
    lines.push(currentLine)
  }
  
  return lines
}

// Function to draw header (only on first page)
const drawHeader = async (pdf, yPos, parsedDate) => {
  const primaryColor = [220, 38, 38]
  const lightGray = [248, 250, 252]
  const darkGray = [55, 65, 81]
  const borderGray = [229, 231, 235]
  
  // Light background for entire page
  pdf.setFillColor(...lightGray)
  pdf.rect(0, 0, 210, 297, 'F')
  
  // Minimalist header with white background
  pdf.setFillColor(255, 255, 255)
  pdf.rect(0, 0, 210, 45, 'F')
  
  // Header bottom border
  pdf.setDrawColor(...borderGray)
  pdf.setLineWidth(0.5)
  pdf.line(20, 45, 190, 45)
  
  // Load and add the real logo
  try {
    const logoResponse = await fetch('/logo_fenix_sin_fondo.png')
    const logoBlob = await logoResponse.blob()
    const logoBase64 = await new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsDataURL(logoBlob)
    })
    
    // Add logo to PDF
    pdf.addImage(logoBase64, 'PNG', 20, 10, 25, 25)
  } catch (logoError) {
    console.warn('Could not load logo, using placeholder:', logoError)
    // Fallback: red circle with "F"
    pdf.setFillColor(...primaryColor)
    pdf.circle(32.5, 22.5, 12, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text('F', 28.5, 27)
  }
  
  // Company information
  pdf.setTextColor(...darkGray)
  pdf.setFontSize(16)
  pdf.setFont('helvetica', 'bold')
  pdf.text('FELIX AUTO SERVICE LLC', 55, 20)
  
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Professional Automotive Services', 55, 28)
  
  // Invoice number and date
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('INVOICE', 150, 20)
  
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`#${getInvoiceNumber()}`, 150, 28)
  pdf.text(`Date: ${formatDate(parsedDate)}`, 150, 35)
  
  // Company information (details)
  let currentY = 60
  pdf.setFontSize(9)
  pdf.setTextColor(...darkGray)
  pdf.text('RICARDO FELIX - Owner', 20, currentY)
  currentY += 5
  pdf.text('Phone: (757) 839-5504', 20, currentY)
  currentY += 5
  pdf.text('Address: 2359 S Military Hwy unit C', 20, currentY)
  currentY += 5
  pdf.text('Chesapeake, VA 23323', 20, currentY)
  
  // Customer section
  currentY += 15
  pdf.setFillColor(255, 255, 255)
  pdf.rect(20, currentY - 5, 170, 25, 'F')
  pdf.setDrawColor(...borderGray)
  pdf.rect(20, currentY - 5, 170, 25, 'S')
  
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...darkGray)
  pdf.text('CUSTOMER INFORMATION', 25, currentY)
  
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Name: ${getCustomerName()}`, 25, currentY + 8)
  pdf.text(`Phone: ${getCustomerPhone()}`, 25, currentY + 13)
  pdf.text(`Vehicle: ${getVehicleName()} ${getVehicleYear()}`, 25, currentY + 18)
  pdf.text(`License Plate: ${getLicensePlate()}`, 110, currentY + 8)
  pdf.text(`VIN: ${getVIN()}`, 110, currentY + 13)
  
  return currentY + 35 // Return the Y position after header
}

// Function to draw footer (only signature on last page)
const drawFooter = (pdf, pageNumber, totalPages, totalsEndY = 0) => {
  const borderGray = [229, 231, 235]
  const darkGray = [55, 65, 81]
  
  // Only add signature section on the last page
  if (pageNumber === totalPages) {
    // Add legal text above signature
    const legalText = "By signing this document, the client confirms that they agree with the described service and ensures that it corresponds to what was requested."
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(156, 163, 175) // Lighter gray color
    
    // Split text into multiple lines to fit within reduced width
    const maxWidth = 130 // Reduced width (content is 170, so this gives more padding)
    const lines = splitTextToSize(pdf, legalText, maxWidth)
    
    // Calculate where to start the legal text based on where totals ended
    let legalY = 225 // Default position
    
    if (totalsEndY > 0) {
      // Use the actual position where totals ended, with some spacing
      legalY = totalsEndY + 10
    } else {
      // Fallback positions if totalsEndY is not provided
      if (totalPages === 1) {
        legalY = 180 // For single page
      } else {
        legalY = 225 // For multiple pages
      }
    }
    
    lines.forEach((line, index) => {
      pdf.text(line, 105, legalY + (index * 4), { align: 'center' })
    })
    
    // Add signature line above the text (with more padding)
    const signatureY = legalY + (lines.length * 4) + 10 // Position after legal text
    pdf.setDrawColor(...borderGray)
    pdf.line(50, signatureY, 160, signatureY) // Even more padding (50-160 instead of 40-170)
    
    // Add "Client Signature" text below the line
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...darkGray)
    pdf.text('Client Signature', 105, signatureY + 8, { align: 'center' })
  }
}

// Function to calculate services position without drawing (for simulation)
const calculateServicesPosition = (pdf, services, startY, maxHeight) => {
  const darkGray = [55, 65, 81]
  const borderGray = [229, 231, 235]
  const colWidths = [120, 50]
  const startX = 20
  const lineHeight = 4.5
  const minRowHeight = 10
  
  let currentY = startY
  let servicesDrawn = 0
  let remainingServices = [...services]
  
  // Calculate services title position
  currentY += 15
  
  // Calculate table header position
  currentY += 8
  
  // Calculate services until we run out of space
  while (remainingServices.length > 0 && currentY < maxHeight - 40) {
    const service = remainingServices[0]
    const serviceIndex = services.length - remainingServices.length + 1
    
    // Split description into multiple lines if needed
    const description = `${serviceIndex}. ${service.description}`
    const maxWidth = colWidths[0] - 6
    const lines = splitTextToSize(pdf, description, maxWidth)
    
    // Calculate row height
    const rowHeight = Math.max(minRowHeight, (lines.length * lineHeight) + 4)
    
    // Check if this service would fit
    if (currentY + rowHeight > maxHeight - 40) {
      break // Stop calculating services for this page
    }
    
    currentY += rowHeight
    servicesDrawn++
    remainingServices.shift() // Remove the calculated service
  }
  
  return {
    servicesDrawn,
    remainingServices,
    currentY
  }
}

// Function to draw services table
const drawServicesTable = (pdf, services, startY, maxHeight) => {
  const darkGray = [55, 65, 81]
  const borderGray = [229, 231, 235]
  const colWidths = [120, 50]
  const startX = 20
  const lineHeight = 4.5
  const minRowHeight = 10
  
  let currentY = startY
  let servicesDrawn = 0
  let remainingServices = [...services]
  
  // Draw services title
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...darkGray)
  pdf.text('SERVICES PERFORMED', 105, currentY, { align: 'center' })
  currentY += 15
  
  // Table header
  pdf.setFillColor(248, 250, 252)
  pdf.rect(startX, currentY - 5, colWidths[0], 8, 'F')
  pdf.rect(startX + colWidths[0], currentY - 5, colWidths[1], 8, 'F')
  pdf.setDrawColor(...borderGray)
  pdf.rect(startX, currentY - 5, colWidths[0], 8, 'S')
  pdf.rect(startX + colWidths[0], currentY - 5, colWidths[1], 8, 'S')
  
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...darkGray)
  pdf.text('Description', startX + 3, currentY)
  pdf.text('Price', startX + colWidths[0] + 3, currentY)
  currentY += 8
  
  // Draw services until we run out of space
  while (remainingServices.length > 0 && currentY < maxHeight - 40) {
    const service = remainingServices[0]
    const serviceIndex = services.length - remainingServices.length + 1
    
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...darkGray)
    
    // Split description into multiple lines if needed
    const description = `${serviceIndex}. ${service.description}`
    const maxWidth = colWidths[0] - 6
    const lines = splitTextToSize(pdf, description, maxWidth)
    
    // Calculate row height
    const rowHeight = Math.max(minRowHeight, (lines.length * lineHeight) + 4)
    
    // Check if this service would fit
    if (currentY + rowHeight > maxHeight - 40) {
      break // Stop drawing services for this page
    }
    
    // Draw background rectangles
    pdf.setFillColor(255, 255, 255)
    pdf.rect(startX, currentY - 5, colWidths[0], rowHeight, 'F')
    pdf.rect(startX + colWidths[0], currentY - 5, colWidths[1], rowHeight, 'F')
    pdf.setDrawColor(...borderGray)
    pdf.rect(startX, currentY - 5, colWidths[0], rowHeight, 'S')
    pdf.rect(startX + colWidths[0], currentY - 5, colWidths[1], rowHeight, 'S')
    
    // Draw description lines
    const textStartY = currentY + 1
    lines.forEach((line, lineIndex) => {
      pdf.text(line, startX + 3, textStartY + (lineIndex * lineHeight))
    })
    
    // Draw price
    const priceY = currentY + (rowHeight / 2) - 4
    pdf.text(`$${parseFloat(service.amount).toFixed(2)}`, startX + colWidths[0] + 3, priceY)
    
    currentY += rowHeight
    servicesDrawn++
    remainingServices.shift() // Remove the drawn service
  }
  
  return {
    servicesDrawn,
    remainingServices,
    currentY
  }
}

// Function to draw totals (only on last page)
const drawTotals = (pdf, yPos) => {
  const primaryColor = [220, 38, 38]
  const darkGray = [55, 65, 81]
  const borderGray = [229, 231, 235]
  
  pdf.setFillColor(255, 255, 255)
  pdf.rect(20, yPos - 3, 170, 20, 'F')
  pdf.setDrawColor(...borderGray)
  pdf.rect(20, yPos - 3, 170, 20, 'S')
  
  // Centered summary title
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...darkGray)
  pdf.text('COST SUMMARY', 105, yPos + 1, { align: 'center' })
  
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Subtotal:', 25, yPos + 7)
  pdf.text(`$${getSubtotal().toFixed(2)}`, 150, yPos + 7)
  
  pdf.text(`Tax (${getTaxRate()}%):`, 25, yPos + 11)
  pdf.text(`$${getTaxAmount().toFixed(2)}`, 150, yPos + 11)
  
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...primaryColor)
  pdf.text('TOTAL:', 25, yPos + 16)
  pdf.text(`$${getTotal().toFixed(2)}`, 150, yPos + 16)
}

// Function to parse date from text format to API format (2025-09-05)
const parseDateToAPIFormat = (dateString) => {
  if (!dateString) {
    // Return current date in Washington DC timezone
    const now = new Date()
    const washingtonTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}))
    return washingtonTime.toISOString().split('T')[0]
  }
  
  // If it's already in YYYY-MM-DD format, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString
  }
  
  // Parse date from text format like "August 31, 2025"
  // Create date in Washington DC timezone to avoid timezone issues
  const date = new Date(dateString + ' 12:00:00')
  if (isNaN(date.getTime())) {
    // If parsing fails, return current date in Washington DC timezone
    const now = new Date()
    const washingtonTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}))
    return washingtonTime.toISOString().split('T')[0]
  }
  
  // Format to YYYY-MM-DD using the date as-is (no timezone conversion needed since we set 12:00:00)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  
  return `${year}-${month}-${day}`
}

// Function to create invoice in the database
const createInvoiceInDB = async (invoiceData) => {
  try {
    const config = useRuntimeConfig()
    const url = config.public.apiBase
    
    // Parse date to API format
    const apiDate = parseDateToAPIFormat(invoiceData.date)
    
    // Prepare data for API
    const apiData = {
      date: apiDate,
      customer_name: getCustomerName(),
      customer_phone_1: getCustomerPhone() || null,
      customer_phone_2: null,
      vehicle_name: getVehicleName(),
      vehicle_year: parseInt(getVehicleYear()),
      vehicle_licence_plate: getLicensePlate(),
      vehicle_vin: getVIN(),
      sub_total: parseFloat(getSubtotal()),
      tax: parseFloat(getTaxRate()),
      total: parseFloat(getTotal()),
      services: getServices().map(service => ({
        description: service.description,
        amount: parseFloat(service.amount)
      }))
    }
    
    const response = await axios.put(`${url}/api/invoice/createInvoice`, apiData, {
      withCredentials: true // Include cookies for authentication
    })
    
    if (response.data.response.status === 200) {
      return { success: true, data: response.data }
    } else {
      throw new Error(response.data.response.message || 'Failed to create invoice')
    }
    
  } catch (error) {
    console.error('Error creating invoice:', error)
    if (error.response) {
      console.error('Error response:', error.response.data)
      throw new Error(error.response.data.message || 'Failed to create invoice')
    }
    throw error
  }
}

const generatePDF = async () => {
  isGenerating.value = true
  
  try {
    // Only create the invoice in the database if requested
    if (props.createInvoiceInDB) {
      const createResult = await createInvoiceInDB(props.invoiceData)
      
      if (!createResult.success) {
        throw new Error('Failed to create invoice in database')
      }
    } else {
    }
    
    // Parse the date to ensure consistency between API and PDF
    const parsedDate = parseDateToAPIFormat(props.invoiceData.date)
    
    const jsPDF = await import('jspdf')
    
    const pdf = new jsPDF.default('p', 'mm', 'a4')
    
    const pageHeight = 297 // A4 height in mm
    const maxContentHeight = pageHeight - 40 // Leave space for footer (will be adjusted per page)
    let currentPage = 1
    let remainingServices = [...getServices()]
    
    
    // Draw first page with header
    let yPos = await drawHeader(pdf, 0, parsedDate)
    
    // Calculate available height for first page (we don't know if it's the last page yet)
    const firstPageResult = drawServicesTable(pdf, remainingServices, yPos, maxContentHeight)
    remainingServices = firstPageResult.remainingServices
    
    // Check if this will be the only page
    const isFirstPageLast = remainingServices.length === 0
    
    // Don't draw footer yet, we'll do it at the end with correct page count
    
    // Draw additional pages if needed
    while (remainingServices.length > 0) {
      currentPage++
      pdf.addPage()
      
      // Set background for new page
      const lightGray = [248, 250, 252]
      pdf.setFillColor(...lightGray)
      pdf.rect(0, 0, 210, 297, 'F')
      
      // Check if this will be the last page
      const isLastPage = remainingServices.length <= 6 // Rough estimate for remaining services
      
      // Calculate available height for this page (last page needs more space for footer + signature)
      const pageMaxHeight = isLastPage ? pageHeight - 100 : maxContentHeight
      
      // Draw services on new page (no header)
      const pageResult = drawServicesTable(pdf, remainingServices, 30, pageMaxHeight)
      remainingServices = pageResult.remainingServices
    }
    
    // Get the actual total pages
    const actualTotalPages = currentPage
    
    // Draw totals on the last page FIRST (before footers)
    let totalsEndY = 0 // Track where totals end
    
    if (actualTotalPages === 1) {
      // If only one page, draw totals after services
      const totalsY = firstPageResult.currentY + 10
      drawTotals(pdf, totalsY)
      totalsEndY = totalsY + 20 // Totals section is now 20mm high (reduced from 30mm)
    } else {
      // If multiple pages, draw totals on the last page
      pdf.setPage(actualTotalPages)
      
      // Calculate where services ended on the last page
      // We need to find the last service position without actually drawing
      let lastServiceY = 30 // Start position for services on additional pages
      let tempServices = [...getServices()]
      
      // Simulate drawing services to find where they end (without actually drawing)
      for (let pageNum = 1; pageNum < actualTotalPages; pageNum++) {
        const pageMaxHeight = pageNum === actualTotalPages - 1 ? pageHeight - 100 : maxContentHeight
        const pageResult = calculateServicesPosition(pdf, tempServices, pageNum === 1 ? yPos : 30, pageMaxHeight)
        tempServices = pageResult.remainingServices
        if (pageNum === actualTotalPages - 1) {
          lastServiceY = pageResult.currentY
        }
      }
      
      // Position totals right after the last service, with some spacing
      const totalsY = lastServiceY + 15
      drawTotals(pdf, totalsY)
      totalsEndY = totalsY + 20 // Totals section is now 20mm high (reduced from 30mm)
    }
    
    // Now draw all footers with correct total page count (AFTER totals)
    for (let pageNum = 1; pageNum <= actualTotalPages; pageNum++) {
      pdf.setPage(pageNum)
      drawFooter(pdf, pageNum, actualTotalPages, totalsEndY)
    }
    
    // Save PDF
    const fileName = `invoice-${getInvoiceNumber()}.pdf`
    pdf.save(fileName)
    
    emit('pdf-generated')
    
  } catch (error) {
    console.error('Error generating PDF:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    
    // Show user-friendly error
    let errorMessage = 'An error occurred while processing your request.'
    
    if (error.message.includes('create invoice')) {
      errorMessage = `Failed to create invoice: ${error.message}`
    } else if (error.message.includes('PDF')) {
      errorMessage = `Failed to generate PDF: ${error.message}`
    } else {
      errorMessage = `Error: ${error.message}`
    }
    
    alert(errorMessage)
  } finally {
    isGenerating.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  
  // If it's already in YYYY-MM-DD format, parse it correctly
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
  if (isNaN(date.getTime())) return ''
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Expose the generatePDF function for external use
defineExpose({
  generatePDF
})
</script>

<style scoped>
/* Additional styles for preview */
@media print {
  .invoice-preview {
    box-shadow: none;
    border: none;
  }
}

/* Smooth animations */
.invoice-preview {
  transition: all 0.3s ease-in-out;
}

/* Hover effects for interactive elements */
.hover\:bg-gray-50:hover {
  background-color: rgba(249, 250, 251, 0.8);
}
</style> 