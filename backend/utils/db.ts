import { Sequelize } from 'sequelize';

const db = new Sequelize(
    process.env.DB_NAME as string,
    process.env.POSTGRES_USER as string,
    process.env.POSTGRES_PASSWORD as string,
    {
        host: process.env.POSTGRES_HOST as string,
        port: process.env.POSTGRES_PORT as unknown as number,
        dialect: 'postgres',
    },
);

const syncDatabase = async () => {
    try {
        await db.authenticate();
        await db.sync({ alter: true });
        console.log('Database synchronised successfully');
    } catch (err) {
        console.error('Error synchronising database:', err);
    }
};

syncDatabase();

export default db;
