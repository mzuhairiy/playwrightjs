import { connectToDatabase } from './db-utils';
import type { RowDataPacket } from 'mysql2/promise';

interface CustomerRow extends RowDataPacket {
    firstname: string;
    lastname: string;
    email: string;
}

export async function checkUserDataInDatabase(email: string): Promise<CustomerRow[]> {
    try {
        const connection = await connectToDatabase();
        const [rows] = await connection.execute<CustomerRow[]>(
            'SELECT * FROM oc_customer WHERE email = ?',
            [email]
        );

        await connection.end();
        return rows;
    } catch (error) {
        console.error('Error querying database:', error);
        throw error;
    }
}

export async function getRandomExistingEmail(): Promise<string | null> {
    try {
        const connection = await connectToDatabase();
        const [rows] = await connection.execute<CustomerRow[]>(
            'SELECT email FROM oc_customer ORDER BY RAND() LIMIT 1'
        );
        await connection.end();
        return rows[0]?.email || null;
    } catch (error) {
        console.error('Error querying database:', error);
        throw error;
    }
}
