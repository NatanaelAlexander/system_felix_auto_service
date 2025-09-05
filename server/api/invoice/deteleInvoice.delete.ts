import { createResponse } from "../../utils/createStatus";
import { readBody } from "#imports";
import { deleteServiceByIdOfInvoice, deleteInvoiceByID } from "~~/server/controllers/invoice";

export default defineEventHandler(async (event) => {
    try {
        console.log('Delete invoice endpoint called')

        // Add timeout to the entire operation
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Endpoint timeout')), 10000) // 10 second timeout
        })

        const operationPromise = (async () => {
            console.log('Starting to read body...')
            const body = await readBody(event);
            console.log('Body read successfully:', body)

            const { invoice_id } = body;
            console.log('Invoice ID extracted:', invoice_id)

            if (!invoice_id) {
                console.log('No invoice_id provided')
                return createResponse({ message: 'invoice_id is required' }, 400);
            }

            // Try to delete services first (don't fail if no services exist)
            console.log('Attempting to delete services for invoice:', invoice_id)
            try {
                const deleteService = await deleteServiceByIdOfInvoice({ invoice_id })
                console.log('Delete services result:', deleteService.status)
                // Don't fail if services don't exist (404 is OK)
                if (deleteService.status !== 200 && deleteService.status !== 404) {
                    console.log('Failed to delete services, but continuing with invoice deletion')
                }
            } catch (serviceError) {
                console.log('Service deletion failed, but continuing:', serviceError)
            }

            // Delete the invoice
            console.log('Attempting to delete invoice:', invoice_id)
            const deleteInvoice = await deleteInvoiceByID({ invoice_id })
            console.log('Delete invoice result:', deleteInvoice.status)
            
            if (deleteInvoice.status !== 200) {
                console.log('Failed to delete invoice')
                return createResponse({ deleteInvoice }, deleteInvoice.status);
            }

            console.log('Invoice deleted successfully')
            return createResponse({ message: 'delete success' }, 200);
        })()

        return await Promise.race([operationPromise, timeoutPromise]);

    } catch (error) {
        console.log('Error in delete invoice endpoint:', error)
        return createResponse({ message: 'Request error', error: (error as any).message }, 500);
    }
})