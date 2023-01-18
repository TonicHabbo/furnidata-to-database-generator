import { env } from "process";
import { DataSource } from 'typeorm';
import { FurnidataEntity } from "./FurnidataEntity";
import { ItemBaseEntity } from "./ItemBaseEntity";

export class Database
{
    public async setup()
    {
        let manager = new DataSource({
            type: 'mariadb',
            host: process.env.db_host,
            port: parseInt(process.env.db_port),
            username: process.env.db_username,
            password: process.env.db_password,
            database: process.env.db_name,
            synchronize: false,
            entities: [FurnidataEntity, ItemBaseEntity],
            subscribers: [],
            migrations: [],
            logging: false,
        });

        await manager.initialize();
    }
}