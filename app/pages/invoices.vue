<template>
  <NuxtLayout name="ejemplo">
    <div class="min-h-screen p-4 sm:p-6 lg:p-8">
      <div class="max-w-6xl mx-auto">
        <InvoiceTable />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import InvoiceTable from '~/components/mainContent/InvoiceTable.vue'
</script>