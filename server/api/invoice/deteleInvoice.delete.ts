import { createResponse } from "../../utils/createStatus";
import { readBody } from "#imports";
import { deleteServiceByIdOfInvoice, deleteInvoiceByID } from "~~/server/controllers/invoice";

export default defineEventHandler(async (event) => {
    try {
        console.log('Delete invoice endpoint called')
        console.log('Request method:', event.node.req.method)
        console.log('Request URL:', event.node.req.url)
        
        // Read the body to get invoice_id
        console.log('Reading request body...')
        const body = await readBody(event);
        console.log('Body received:', body)
        
        const invoice_id = body?.invoice_id;
        console.log('Invoice ID extracted:', invoice_id)
        
        if (!invoice_id) {
            console.log('No invoice_id provided in request body')
            return createResponse({ message: 'invoice_id is required' }, 400);
        }

        // Convert to number if it's a string
        const numericInvoiceId = parseInt(invoice_id);
        if (isNaN(numericInvoiceId)) {
            console.log('Invalid invoice_id format:', invoice_id)
            return createResponse({ message: 'Invalid invoice_id format' }, 400);
        }

        console.log('Processing deletion for invoice:', numericInvoiceId)

        // Try to delete services first (don't fail if no services exist)
        console.log('Attempting to delete services for invoice:', numericInvoiceId)
        try {
            const deleteService = await deleteServiceByIdOfInvoice({ invoice_id: numericInvoiceId })
            console.log('Delete services result:', deleteService.status)
            // Don't fail if services don't exist (404 is OK)
            if (deleteService.status !== 200 && deleteService.status !== 404) {
                console.log('Failed to delete services, but continuing with invoice deletion')
            }
        } catch (serviceError) {
            console.log('Service deletion failed, but continuing:', serviceError)
        }

        // Delete the invoice
        console.log('Attempting to delete invoice:', numericInvoiceId)
        const deleteInvoice = await deleteInvoiceByID({ invoice_id: numericInvoiceId })
        console.log('Delete invoice result:', deleteInvoice.status)
        
        if (deleteInvoice.status !== 200) {
            console.log('Failed to delete invoice')
            return createResponse({ deleteInvoice }, deleteInvoice.status);
        }

        console.log('Invoice deleted successfully')
        return createResponse({ message: 'delete success' }, 200);

    } catch (error) {
        console.log('Error in delete invoice endpoint:', error)
        return createResponse({ message: 'Request error', error: (error as any).message }, 500);
    }
})
