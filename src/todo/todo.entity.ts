import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('todo')
export class TodoEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({default: false})
    completed: boolean;

    @Column()
    releaseDate: Date;

    @Column()
    owner: string;

    
}