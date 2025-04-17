import postgres from 'postgres'

// const connectionString = process.env.DATABASE_URL;
const connectionString = '';
const sql = postgres(connectionString)

export default sql