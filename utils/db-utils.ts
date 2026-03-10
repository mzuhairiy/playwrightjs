import mysql, { type Connection } from 'mysql2/promise';

export async function connectToDatabase(): Promise<Connection> {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'demo'
        });
        return connection;
    } catch (error) {
        console.error('Connection failed:', error);
        throw error;
    }
}
