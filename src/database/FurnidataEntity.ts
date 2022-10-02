import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('furnidatas')
export class FurnidataEntity extends BaseEntity
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    classname: string;

    @Column()
    name: string;

    @Column()
    revision: number;

    @Column()
    description: string;

    @Column()
    category: string;

    @Column()
    offerid: number;

    @Column()
    xdim: number;

    @Column()
    ydim: number;

    @Column()
    partcolors: string;

    @Column()
    adurl: string;

    @Column()
    type: number;

    @Column()
    buyout: number;

    @Column()
    rentofferid: number;

    @Column()
    rentbuyout: number;

    @Column()
    bc: number;

    @Column()
    excludeddynamic: number;

    @Column()
    customparams: string;

    @Column()
    specialtype: number;

    @Column()
    canstandon: number;

    @Column()
    cansiton: number;

    @Column()
    canlayon: number;

    @Column()
    furniline: string;

    @Column()
    environment: string;

    @Column()
    rare: number;
}
