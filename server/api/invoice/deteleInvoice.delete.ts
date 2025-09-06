import { createResponse } from "../../utils/createStatus";
import { readBody } from "#imports";
import { deleteServiceByIdOfInvoice, deleteInvoiceByID } from "~~/server/controllers/invoice";

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const invoice_id = body?.invoice_id;
        
        if (!invoice_id) {
            return createResponse({ message: 'invoice_id is required' }, 400);
        }

        const numericInvoiceId = parseInt(invoice_id);
        if (isNaN(numericInvoiceId)) {
            return createResponse({ message: 'Invalid invoice_id format' }, 400);
        }

        // Try to delete services first (don't fail if no services exist)
        try {
            const deleteService = await deleteServiceByIdOfInvoice({ invoice_id: numericInvoiceId })
            // Don't fail if services don't exist (404 is OK)
            if (deleteService.status !== 200 && deleteService.status !== 404) {
                // Continue with invoice deletion even if services fail
            }
        } catch (serviceError) {
            console.log('Service deletion failed, but continuing:', serviceError)
        }

        // Delete the invoice
        const deleteInvoice = await deleteInvoiceByID({ invoice_id: numericInvoiceId })
        
        if (deleteInvoice.status !== 200) {
            return createResponse({ deleteInvoice }, deleteInvoice.status);
        }

        return createResponse({ message: 'delete success' }, 200);

    } catch (error) {
        console.log('Error in delete invoice endpoint:', error)
        return createResponse({ message: 'Request error', error: (error as any).message }, 500);
    }
})
