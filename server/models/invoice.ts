import { tursoClient } from "../bd/index";

interface typeCreateInvoice {
    date: string,
    customer_name: string,
    newPhone1: string | null,
    newPhone2: string | null,
    vehicle_name: string | null,
    vehicle_year: number | null,
    vehicle_licence_plate: string,
    vehicle_vin: string,
    sub_total: number,
    tax: number,
    total: number
}

interface typeCreateService {
    invoice_id: number,
    description: string,
    amount: number
}

interface typeDeleteService {
    invoice_id: number
}

interface typeInvoicesPerPage {
    offset: number
}

interface typeFilterInvoices {
    offset: number,
    filter?: string,
    date?: string
}

export const createInvoice = async ({ date, customer_name, newPhone1, newPhone2, vehicle_name, vehicle_year, vehicle_licence_plate, vehicle_vin, sub_total, tax, total }: typeCreateInvoice) => {
    try {

        const invoice = await tursoClient.execute({
            sql: `
            INSERT INTO invoices (date, customer_name, customer_phone_1, customer_phone_2, vehicle_name, vehicle_year, vehicle_licence_plate, vehicle_vin, sub_total, tax, total)   
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [date, customer_name, newPhone1, newPhone2, vehicle_name, vehicle_year, vehicle_licence_plate, vehicle_vin, sub_total, tax, total]
        });

        const invoiceId = Number(invoice.lastInsertRowid); // convertir de BigInt a number

        return { data: { id: invoiceId }, status: 200 };

    } catch (error) {
        console.log("createInvoice error", error);
        return { message: 'Error desconocido al buscar al crear usuario', status: 500 }
    };
}

export const createService = async ({ invoice_id, description, amount }: typeCreateService) => {
    try {

        const service = await tursoClient.execute({
            sql: `
            INSERT INTO services (invoice_id, description, amount)   
            VALUES (?, ?, ?)`,
            args: [invoice_id, description, amount]
        });

        return { data: service, status: 200 };

    } catch (error) {
        console.log("createService error", error);
        return { message: 'Error desconocido al buscar al crear usuario', status: 500 }
    };
}

export const deleteServices = async ({ invoice_id }: typeDeleteService) => {
    try {

        const service = await tursoClient.execute({
            sql: `
            DELETE FROM services WHERE invoice_id = ?`,
            args: [invoice_id]
        });

        return { data: service, status: 200 };

    } catch (error) {
        console.log("deleteService error", error);
        return { message: 'Error desconocido al buscar al crear usuario', status: 500 }
    };
}

export const deleteInvoice = async ({ invoice_id }: typeDeleteService) => {
    try {

        const service = await tursoClient.execute({
            sql: `
            DELETE FROM invoices WHERE id = ?`,
            args: [invoice_id]
        });

        return { data: service, status: 200 };

    } catch (error) {
        console.log("deleteInvoice error", error);
        return { message: 'Error desconocido al buscar al crear usuario', status: 500 }
    };
}

export const invoicesPerPage = async ({ offset }: typeInvoicesPerPage) => {
    try {

        const service = await tursoClient.execute({
            sql: `
            SELECT i.id AS invoice_id, i.date, i.customer_name, i.customer_phone_1, i.customer_phone_2, i.vehicle_name, i.vehicle_year,
           i.vehicle_licence_plate, i.vehicle_vin, i.sub_total, i.tax, i.total,
           s.id AS service_id, s.description, s.amount
            FROM (
                SELECT id, date, customer_name, customer_phone_1, customer_phone_2, vehicle_name, vehicle_year,
                       vehicle_licence_plate, vehicle_vin, sub_total, tax, total
                FROM invoices
                ORDER BY id DESC
                LIMIT ? OFFSET ?
            ) i
            LEFT JOIN services s ON i.id = s.invoice_id
            ORDER BY i.id DESC`,
            args: [10, offset]
        });

        return { data: service, status: 200 };

    } catch (error) {
        console.log("deleteInvoice error", error);
        return { message: 'Error desconocido al buscar al crear usuario', status: 500 }
    };
}

export const filterInvoices = async ({ offset, filter, date }: typeFilterInvoices) => {
    try {
        // Construir la subconsulta para obtener los 10 invoices filtrados
        let subquery = `
            SELECT id, date, customer_name, customer_phone_1, customer_phone_2, vehicle_name, vehicle_year,
                   vehicle_licence_plate, vehicle_vin, sub_total, tax, total
            FROM invoices
            WHERE 1=1`;
        
        let args: any[] = [];

        // Agregar filtro de fecha si existe
        if (date && date.trim() !== "") {
            subquery += ` AND date = ?`;
            args.push(date);
        }

        // Lógica de 3 pasos para el filtro
        if (filter && filter.trim() !== "") {
            subquery += ` AND (
                customer_name LIKE ? OR 
                vehicle_vin LIKE ? OR 
                vehicle_licence_plate LIKE ?
            )`;
            const filterPattern = `%${filter}%`;
            args.push(filterPattern, filterPattern, filterPattern);
        }

        subquery += ` ORDER BY id DESC LIMIT ? OFFSET ?`;
        args.push(10, offset);

        // Query principal con JOIN a services
        const sql = `
            SELECT i.id AS invoice_id, i.date, i.customer_name, i.customer_phone_1, i.customer_phone_2, i.vehicle_name, i.vehicle_year,
           i.vehicle_licence_plate, i.vehicle_vin, i.sub_total, i.tax, i.total,
           s.id AS service_id, s.description, s.amount
            FROM (${subquery}) i
            LEFT JOIN services s ON i.id = s.invoice_id
            ORDER BY i.id DESC`;

        const service = await tursoClient.execute({
            sql,
            args
        });

        return { data: service, status: 200 };

    } catch (error) {
        console.log("filterInvoices error", error);
        return { message: 'Error desconocido al filtrar invoices', status: 500 }
    };
}