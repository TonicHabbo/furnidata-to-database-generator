import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity('items_base')
export class ItemBaseEntity extends BaseEntity
{
    @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
    public id: number;

    @Column('int', { name: 'sprite_id', default: '0' })
    public spriteId: number;

    @Column('varchar', { name: 'public_name', length: 56 })
    public publicName: string;

    @Column('varchar', { name: 'item_name', length: 70 })
    public itemName: string;

    @Column('varchar', { name: 'type', length: 3, default: 's' })
    public type: string;

    @Column('int', { name: 'width', default: '1' })
    public width: number;

    @Column('int', { name: 'length', default: '1' })
    public length: number;

    @Column('double', {
        name: 'stack_height',
        precision: 4,
        scale: 2,
        default: '0.00',
    })
    public stackHeight: number;

    @Column('tinyint', { name: 'allow_stack', width: 1, default: '1' })
    public allowStack: boolean;

    @Column('tinyint', { name: 'allow_sit', width: 1, default: '0' })
    public allowSit: boolean;

    @Column('tinyint', { name: 'allow_lay', width: 1, default: '0' })
    public allowLay: boolean;

    @Column('tinyint', { name: 'allow_walk', width: 1, default: '0' })
    public allowWalk: boolean;

    @Column('tinyint', { name: 'allow_gift', width: 1, default: '1' })
    public allowGift: boolean;

    @Column('tinyint', { name: 'allow_trade', width: 1, default: '1' })
    public allowTrade: boolean;

    @Column('tinyint', { name: 'allow_recycle', width: 1, default: '0' })
    public allowRecycle: boolean;

    @Column('tinyint', {
        name: 'allow_marketplace_sell',
        width: 1,
        default: '0',
    })
    public allowMarketplaceSell: boolean;

    @Column('tinyint', {
        name: 'allow_inventory_stack',
        width: 1,
        default: '1',
    })
    public allowInventoryStack: boolean;

    @Column('varchar', {
        name: 'interaction_type',
        length: 500,
        default: 'default',
    })
    public interactionType: string;

    @Column('int', { name: 'interaction_modes_count', default: '1' })
    public interactionModesCount: number;

    @Column('varchar', { name: 'vending_ids', length: 255, default: '0' })
    public vendingIds: string;

    @Column('varchar', { name: 'multiheight', length: 50, default: '0' })
    public multiheight: string;

    @Column('varchar', { name: 'customparams', length: 256 })
    public customparams: string;

    @Column('int', { name: 'effect_id_male', default: '0' })
    public effectIdMale: number;

    @Column('int', { name: 'effect_id_female', default: '0' })
    public effectIdFemale: number;

    @Column('varchar', { name: 'clothing_on_walk', length: 255 })
    public clothingOnWalk: string;
}
