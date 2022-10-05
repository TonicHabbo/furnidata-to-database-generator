import { createWriteStream, existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { pipeline } from "stream/promises";
import { promisify } from "util";
import { Database } from "./database/Database";
import { FurnidataEntity } from "./database/FurnidataEntity";
import { ItemBaseEntity } from "./database/ItemBaseEntity";

const writeFilePromise = promisify(writeFile);

interface IFurni
{
    id: number;
    classname: string;
    name: string;
    revision: number;
    description: string;
    category: string;
    offerid: number;
    xdim: number;
    ydim: number;
    partcolors: string;
    adurl: string;
    type: number;
    buyout: number;
    rentofferid: number;
    rentbuyout: number;
    bc: number;
    excludeddynamic: number;
    customparams: string;
    specialtype: number;
    canstandon: number;
    cansiton: number;
    canlayon: number;
    furniline: string;
    environment: string;
    rare: number;
}
interface IFurnidata
{
    roomitemtypes: {
        furnitype: IFurni[];
    }

    wallitemtypes: {
        furnitype: IFurni[];
    }
}
class FurniGenerator
{
    private localFurnidata: IFurnidata;
    private habboFurnidata: IFurnidata;

    private downloadedFloor: IFurni[];
    private downloadedWall: IFurni[];

    constructor()
    {
        console.clear();
        console.log('furnigenerator \u001b[33m-TONIC\u001b[0m\n')
        this.init();
    }

    private async init()
    {
        this.downloadedFloor = [];
        this.downloadedWall = [];

        (await import('dotenv')).config();
        await new Database().setup();

        await this.directories('./swfs');
        await this.directories('./queries');
        await this.directories('./icons');
        await this.fetchFurnidata(process.env.localFurnidata, true);
        await this.fetchFurnidata('https://habbo.com/gamedata/furnidata_json/1');
        await this.downloadSwfs();

        await this.generateQueries();

        process.exit
    }

    private async directories(dir: string)
    {
        if (existsSync(dir)) return;

        await mkdir(dir);
    }

    private async fetchFurnidata(url: string, local: boolean = false)
    {
        console.log(`loading ${url}`)
        await new Promise<void>(async (resolve, reject) =>
        {
            try
            {
                let data = await (await fetch(url)).json();

                if (!data) return;

                if (local) this.localFurnidata = data;
                else this.habboFurnidata = data;

                resolve();
            }
            catch (e)
            {
                reject();
            }
        });
    }

    private async downloadSwfs()
    {
        let localFloor = this.localFurnidata.roomitemtypes.furnitype;
        let floor = this.habboFurnidata.roomitemtypes.furnitype;

        let localWall = this.localFurnidata.wallitemtypes.furnitype;
        let wall = this.habboFurnidata.wallitemtypes.furnitype;

        await this.downloadFiles(localFloor, floor);
        await this.downloadFiles(localWall, wall, false);

        await this.downloadIcons([].concat(localFloor,localWall), [].concat(wall,floor));

        console.log(`found ${this.downloadedFloor.length + this.downloadedWall.length} missing furnis!`)
    }

    private async downloadFiles(local: IFurni[], habbo: IFurni[], floor: boolean = true)
    {
        console.log(`downloading ${floor ? 'floor' : 'wall'} items...`)
        await Promise.all(habbo.map(async (furniJson: IFurni) =>
        {
            let exists = local.find(val => val.classname === furniJson.classname);
            if (exists) return;

            let url = `https://images.habbo.com/dcr/hof_furni/${furniJson.revision}/${furniJson.classname.split('*')[0]}.swf`;
            let res = await fetch(url);

            if (floor) this.downloadedFloor.push(furniJson);
            else this.downloadedWall.push(furniJson);

            const blob = await res.blob();
            const stream = blob.stream();
            const filePath = join('./swfs', furniJson.classname + ".swf");
            await writeFile(filePath, stream);
        }));

        console.log(`downloaded ${floor ? this.downloadedFloor.length : this.downloadedWall.length} ${floor ? 'floor' : 'wall'} items! `)
    }

    private async downloadIcons(local: IFurni[], habbo: IFurni[])
    {
        let icons = 0;
        await Promise.all(habbo.map(async (furniJson: IFurni) =>
        {
            let exists = local.find(val => val.classname === furniJson.classname);
            if (exists) return;

            let url = `https://images.habbo.com/dcr/hof_furni/${furniJson.revision}/${furniJson.classname.replace("*","_")}_icon.png`;
            let res = await fetch(url);

            icons++;

            const blob = await res.blob();
            const stream = blob.stream();
            const filePath = join('./icons', `${furniJson.classname.replace("*","_")}_icon.png`);
            await writeFile(filePath, stream);
        }));

        console.log(`downloaded ${icons} icons!`);
    }

    private async generateQueries()
    {
        let lastFurniData = await FurnidataEntity.createQueryBuilder().orderBy('id', 'DESC').getOne();
        let lastItemBase = await ItemBaseEntity.createQueryBuilder().orderBy('id', 'DESC').getOne();

        let allStr = "";

        const writeToStr = (furniJson: IFurni, index: number, type: number) =>
        {
            let values = [];

            let lastItemId = Math.floor(+lastItemBase.id + +index + +1);

            furniJson.id = Math.floor(+lastFurniData.id + +index + +1);

            furniJson.offerid = furniJson.id;

            Object.keys(furniJson).forEach(key =>
            {
                let val = "";
                let keyVal = furniJson[key];

                if (keyVal == null) keyVal = "unknown";

                if (key == "partcolors")
                    val = `'${JSON.stringify(keyVal)}'`;
                else val = JSON.stringify(keyVal);

                values.push(val);
            });

            if (parseInt(process.env.furnidatas_table) == 1) allStr += "INSERT INTO `furnidatas` (" + Object.keys(furniJson).join(", ") + ", type) VALUES(" + values.join(", ") + ", " + type + ");\n";

            allStr += "INSERT INTO `items_base` (`id`, `sprite_id`, `public_name`, `item_name`, `type`, `width`, `length`, `stack_height`, `allow_stack`, `allow_sit`, `allow_lay`, `allow_walk`, `allow_gift`, `allow_trade`, `allow_recycle`, `allow_marketplace_sell`, `allow_inventory_stack`)";
            allStr += "VALUES(" + lastItemId + ", " + furniJson.id + ", '" + furniJson.name + "', '" + furniJson.classname + "', '" + (type ? 'i' : 's') + "', '" + furniJson.xdim + "', '" + furniJson.ydim + "', '0.00', '0', '" + (furniJson.cansiton ? 1 : 0) + "', '" + (furniJson.canlayon ? 1 : 0) + "', '" + (furniJson.canstandon ? 1 : 0) + "', '0', '0', '0', '0', '1'); \n"


            allStr += "INSERT INTO `catalog_items` (`item_ids`, `page_id`, `catalog_name`,`offer_id`) ";
            allStr += `VALUES('${lastItemId}','${process.env.catalog_page_id}','${furniJson.classname}','${furniJson.offerid}');\n`;

            allStr += "\n"
        }

        this.downloadedFloor.forEach(async (furniJson, index) => writeToStr(furniJson, index, 0));
        this.downloadedWall.forEach(async (furniJson, index) => writeToStr(furniJson, index, 1));

        await writeFile("./queries/all.sql", allStr);

        console.log('saved to /queries/all.sql')
    }
}

new FurniGenerator();