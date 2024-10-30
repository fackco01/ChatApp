"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSourceOptions = void 0;
require("dotenv/config");
const typeorm_1 = require("typeorm");
exports.dataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/db/migrations/*{.ts,.js}'],
    synchronize: false,
    logging: true,
};
const dataSourceLocal = new typeorm_1.DataSource(exports.dataSourceOptions);
exports.default = dataSourceLocal;
//# sourceMappingURL=data-local.js.map