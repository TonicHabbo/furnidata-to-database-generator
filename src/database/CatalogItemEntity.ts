import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { OffOnEnum } from './enum/OffOnEnum';

@Entity('catalog_items')
export class CatalogItemEntity extends BaseEntity
{
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    public id: number;

    @Column('varchar', { name: 'item_ids', length: 666 })
    public itemIds: string;

    @Column('int', { name: 'page_id' })
    public pageId: number;

    @Column('varchar', { name: 'catalog_name', length: 100 })
    public catalogName: string;

    @Column('int', { name: 'cost_credits', default: '3' })
    public costCredits: number;

    @Column('int', { name: 'cost_points', default: '0' })
    public costPoints: number;

    @Column('int', { name: 'points_type', default: '0' })
    public pointsType: number;

    @Column('int', { name: 'amount', default: '1' })
    public amount: number;

    @Column('int', { name: 'limited_stack', default: '0' })
    public limitedStack: number;

    @Column('int', { name: 'limited_sells', default: '0' })
    public limitedSells: number;

    @Column('int', { name: 'order_number', default: '1' })
    public orderNumber: number;

    @Column('int', { name: 'offer_id', default: '-1' })
    public offerId: number;

    @Column('int', { name: 'song_id', unsigned: true, default: '0' })
    public songId: number;

    @Column('varchar', { name: 'extradata', length: 500 })
    public extradata: string;

    @Column('enum', {
        name: 'have_offer',
        enum: OffOnEnum,
        default: OffOnEnum.ON,
    })
    public haveOffer: OffOnEnum;

    @Column('enum', {
        name: 'club_only',
        enum: OffOnEnum,
        default: OffOnEnum.OFF,
    })
    public clubOnly: OffOnEnum;
}
