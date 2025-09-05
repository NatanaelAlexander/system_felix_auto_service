import { createResponse } from "../../utils/createStatus";
import { readBody, getQuery } from "#imports";
import { deleteServiceByIdOfInvoice, deleteInvoiceByID } from "~~/server/controllers/invoice";

export default defineEventHandler(async (event) => {
    try {
        console.log('Delete invoice endpoint called')
        console.log('Request method:', event.node.req.method)
        console.log('Request headers:', event.node.req.headers)
        console.log('Request URL:', event.node.req.url)

        // Add timeout to the entire operation
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Endpoint timeout')), 10000) // 10 second timeout
        })

        const operationPromise = (async () => {
            let invoice_id = null;
            
            // Try to get invoice_id from body first
            try {
                console.log('Starting to read body...')
                
                // Add timeout specifically for readBody
                const readBodyTimeout = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('readBody timeout')), 5000) // 5 second timeout for readBody
                })
                
                const readBodyPromise = readBody(event);
                const body = await Promise.race([readBodyPromise, readBodyTimeout]);
                console.log('Body read successfully:', body)
                console.log('Body type:', typeof body)
                console.log('Body keys:', Object.keys(body || {}))

                invoice_id = body?.invoice_id;
                console.log('Invoice ID extracted from body:', invoice_id)
                console.log('Invoice ID type:', typeof invoice_id)
            } catch (bodyError) {
                console.log('Failed to read body, trying query params:', bodyError)
                
                // Fallback to query parameters
                try {
                    const query = getQuery(event);
                    console.log('Query params:', query)
                    invoice_id = query.invoice_id;
                    console.log('Invoice ID extracted from query:', invoice_id)
                } catch (queryError) {
                    console.log('Failed to read query params:', queryError)
                }
            }

            // If still no invoice_id, try to get it from the request body directly
            if (!invoice_id) {
                console.log('Trying alternative methods to get invoice_id...')
                
                // Try to get from request body directly
                try {
                    const rawBody = await readBody(event);
                    console.log('Raw body alternative:', rawBody)
                    invoice_id = rawBody?.invoice_id || rawBody?.id;
                    console.log('Invoice ID from raw body:', invoice_id)
                } catch (rawBodyError) {
                    console.log('Raw body alternative failed:', rawBodyError)
                }
                
                // Try to get from URL path
                if (!invoice_id) {
                    const url = event.node.req.url;
                    console.log('Request URL for path extraction:', url)
                    const pathMatch = url?.match(/\/deteleInvoice\/(\d+)/);
                    if (pathMatch) {
                        invoice_id = pathMatch[1];
                        console.log('Invoice ID from URL path:', invoice_id)
                    }
                }
            }

            console.log('Final invoice_id value:', invoice_id)
            console.log('Final invoice_id type:', typeof invoice_id)
            console.log('Final invoice_id truthy:', !!invoice_id)

            // Convert to number if it's a string
            if (invoice_id && typeof invoice_id === 'string') {
                invoice_id = parseInt(invoice_id);
                console.log('Converted invoice_id to number:', invoice_id)
            }

            if (!invoice_id || isNaN(invoice_id)) {
                console.log('No valid invoice_id provided in body, query, or URL path')
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