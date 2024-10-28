import 'dotenv/config'
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/db/migrations/*{.ts,.js}'],  // Sửa path cho đúng
  synchronize: false,  // Tắt synchronize
  logging: true,
};

const dataSourceLocal = new DataSource(dataSourceOptions);

export default dataSourceLocal;