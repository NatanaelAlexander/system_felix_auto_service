import bcrypt from 'bcryptjs';
import { createInvoice, createService, deleteServices, deleteInvoice, invoicesPerPage, filterInvoices } from '../models/invoice';

interface typeCreateInvoice {
    date: string,
    customer_name: string,
    customer_phone_1: string | null,
    customer_phone_2: string | null,
    vehicle_name: string | null,
    vehicle_year: number | null,
    vehicle_licence_plate: string,
    vehicle_vin: string,
    sub_total: number,
    tax: number,
    total: number
}

interface Service {
    description: string;
    amount: number;
}

interface createServiceByInvoice {
    invoice_id: number,
    services: Service[]
}

interface typeDeleteInvoiceByID {
    invoice_id: number
}

interface typePostInvoices {
    page: number
}

interface typeFilterInvoices {
    page: number,
    filter?: string,
    date?: string
}

export const putCreateInvoice = async ({ date, customer_name, customer_phone_1, customer_phone_2, vehicle_name, vehicle_year, vehicle_licence_plate, vehicle_vin, sub_total, tax, total }: typeCreateInvoice) => {
    try {

        /* verificar datos relevantes */
        if (!date || date.trim() == "" || date == undefined || date == null)
            return { message: 'Required fields missing: date', status: 400 }

        if (!customer_name || customer_name.trim() == "" || customer_name == undefined || customer_name == null)
            return { message: 'Required fields missing: customerName', status: 400 }

        if (!vehicle_name || vehicle_name.trim() == "" || vehicle_name == undefined || vehicle_name == null)
            return { message: 'Required fields missing: vehicle_name', status: 400 }

        if (!vehicle_year || vehicle_year == undefined || vehicle_year == null)
            return { message: 'Required fields missing: vehicle_year', status: 400 }

        if (!vehicle_licence_plate || vehicle_licence_plate.trim() == "" || vehicle_licence_plate == undefined || vehicle_licence_plate == null)
            return { message: 'Required fields missing: vehicle_licence_plate', status: 400 }

        if (!vehicle_vin || vehicle_vin.trim() == "" || vehicle_vin == undefined || vehicle_vin == null)
            return { message: 'Required fields missing: vehicle_vin', status: 400 }

        if (!sub_total || sub_total == undefined || sub_total == null)
            return { message: 'Required fields missing: sub_total', status: 400 }

        if (!tax || tax == undefined || tax == null)
            return { message: 'Required fields missing: tax', status: 400 }

        if (!total || total == undefined || total == null)
            return { message: 'Required fields missing: total', status: 400 }

        /* Verificar datos opcionales */
        let newPhone1: string | null = customer_phone_1 ? customer_phone_1.trim() === "" ? null : customer_phone_1.trim() : null

        let newPhone2: string | null = customer_phone_2 ? customer_phone_2.trim() === "" ? null : customer_phone_2.trim() : null

        const response = await createInvoice({ date, customer_name, newPhone1, newPhone2, vehicle_name, vehicle_year, vehicle_licence_plate, vehicle_vin, sub_total, tax, total })

        if (response.status === 200) {
            return { data: response.data, status: 200 };
        } else {
            return { message: 'Could not create the invoice', status: 404 }
        }

    } catch (error) {
        console.error("Error, putCreateInvoice: ", error)
        return { message: 'Unknown error while fetching the putCreateInvoice', status: 500 }
    }
}

export const createServiceByInvoice = async ({ invoice_id, services }: createServiceByInvoice) => {
    try {

        /* verificar datos relevantes */
        if (!invoice_id || invoice_id == undefined || invoice_id == null)
            return { message: 'Required fields missing: invoice_id', status: 400 }

        // Validar services
        if (!services || !Array.isArray(services) || services.length === 0) {
            return { message: 'Required field missing or empty: services', status: 400 };
        }

        // Validar cada servicio
        for (const service of services) {
            if (!service.description || service.description.trim() === '') {
                return { message: 'Each service must have a description', status: 400 };
            }
            if (service.amount == null || isNaN(service.amount) || service.amount === 0) {
                return { message: 'Each service amount must not be 0', status: 400 };
            }
        }

        for (const service of services) {
            let description: string = service.description
            let amount: number = service.amount
            const response = await createService({ invoice_id, description, amount })
            if (response.status !== 200) {
                return { message: 'Could not create the invoice', status: 404 }
            }
        }

        return { data: "create success", status: 200 };
    } catch (error) {
        console.error("Error, putCreateInvoice: ", error)
        return { message: 'Unknown error while fetching the putCreateInvoice', status: 500 }
    }
}

export const deleteInvoiceByID = async ({ invoice_id }: typeDeleteInvoiceByID) => {
    try {

        if (!invoice_id || invoice_id == undefined || invoice_id == null)
            return { message: 'Required fields missing: invoice_id', status: 400 }

        const response = await deleteInvoice({ invoice_id })
        const rowsAffected = (response.data as any)?.rowsAffected ?? 0;
        if (rowsAffected === 0) {
            return { data: "Service not found", status: 404 };
        }

        return { data: "delete success", status: 200 };
    } catch (error) {
        console.error("Error, deleteInvoiceByID: ", error)
        return { message: 'Unknown error while fetching the putCreateInvoice', status: 500 }
    }
}

export const deleteServiceByIdOfInvoice = async ({ invoice_id }: typeDeleteInvoiceByID) => {
    try {
        console.log('deleteServiceByIdOfInvoice called with invoice_id:', invoice_id)

        if (!invoice_id || invoice_id == undefined || invoice_id == null) {
            console.log('Missing invoice_id')
            return { message: 'Required fields missing: invoice_id', status: 400 }
        }

        console.log('Calling deleteServices model function')
        const response = await deleteServices({ invoice_id })
        console.log('deleteServices model response:', response)
        
        const rowsAffected = (response.data as any)?.rowsAffected ?? 0;
        console.log('Services rows affected:', rowsAffected)
        
        // Don't fail if no services found - this is OK
        if (rowsAffected === 0) {
            console.log('No services found to delete - this is OK')
            return { data: "No services found", status: 200 }; // Changed from 404 to 200
        }
        
        console.log('Services deleted successfully')
        return { data: "delete success", status: 200 };
    } catch (error) {
        console.error("Error, deleteServiceByIdOfInvoice: ", error)
        return { message: 'Unknown error while deleting services', status: 500 }
    }
}

export const sourceInvoicesPerPage = async ({ page }: typePostInvoices) => {
    try {

        if (!page || page == undefined || page == null)
            return { message: 'Required fields missing: page', status: 400 }

        let offset: number = (page - 1) * 10

        const response = await invoicesPerPage({ offset })
        if (!response.data?.rows) {
            return { message: 'No invoices could be found.', status: 400 }
        }
        // 🔹 Agrupar por invoice_id
        const invoicesMap = new Map<number, any>()

        for (const row of response.data.rows) {
            const invoiceId = row.invoice_id as number

            if (!invoicesMap.has(invoiceId)) {
                invoicesMap.set(invoiceId, {
                    id: invoiceId,
                    date: row.date as string,
                    customer_name: row.customer_name as string,
                    customer_phone_1: row.customer_phone_1 as string,
                    customer_phone_2: row.customer_phone_2 as string | null,
                    vehicle_name: row.vehicle_name as string,
                    vehicle_year: row.vehicle_year as number,
                    vehicle_licence_plate: row.vehicle_licence_plate as string,
                    vehicle_vin: row.vehicle_vin as string,
                    sub_total: row.sub_total as number,
                    tax: row.tax as number,
                    total: row.total as number,
                    services: []
                })
            }

            if (row.service_id) {
                invoicesMap.get(invoiceId)!.services.push({
                    id: row.service_id as number,
                    description: row.description as string,
                    amount: row.amount as number
                })
            }
        }

        const invoices = Array.from(invoicesMap.values())

        return { data: invoices, status: 200 }

    } catch (error) {
        console.error("Error, sourceInvoicesPerPage: ", error)
        return { message: 'Unknown error while fetching the sourceInvoicesPerPage', status: 500 }
    }
}

export const sourceFilterInvoices = async ({ page, filter, date }: typeFilterInvoices) => {
    try {

        if (!page || page == undefined || page == null)
            return { message: 'Required fields missing: page', status: 400 }

        // Si no hay filtro ni fecha, no devolver nada
        if ((!filter || filter.trim() === "") && (!date || date.trim() === "")) {
            return { data: [], status: 200 }
        }

        let offset: number = (page - 1) * 10

        const response = await filterInvoices({ offset, filter, date })
        if (!response.data?.rows) {
            return { message: 'No invoices could be found.', status: 400 }
        }
        
        // 🔹 Agrupar por invoice_id
        const invoicesMap = new Map<number, any>()

        for (const row of response.data.rows) {
            const invoiceId = row.invoice_id as number

            if (!invoicesMap.has(invoiceId)) {
                invoicesMap.set(invoiceId, {
                    id: invoiceId,
                    date: row.date as string,
                    customer_name: row.customer_name as string,
                    customer_phone_1: row.customer_phone_1 as string,
                    customer_phone_2: row.customer_phone_2 as string | null,
                    vehicle_name: row.vehicle_name as string,
                    vehicle_year: row.vehicle_year as number,
                    vehicle_licence_plate: row.vehicle_licence_plate as string,
                    vehicle_vin: row.vehicle_vin as string,
                    sub_total: row.sub_total as number,
                    tax: row.tax as number,
                    total: row.total as number,
                    services: []
                })
            }

            if (row.service_id) {
                invoicesMap.get(invoiceId)!.services.push({
                    id: row.service_id as number,
                    description: row.description as string,
                    amount: row.amount as number
                })
            }
        }

        const invoices = Array.from(invoicesMap.values())

        return { data: invoices, status: 200 }

    } catch (error) {
        console.error("Error, sourceFilterInvoices: ", error)
        return { message: 'Unknown error while fetching the sourceFilterInvoices', status: 500 }
    }
}