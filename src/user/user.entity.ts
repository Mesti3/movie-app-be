import { TodoEntity } from "src/todo/todo.entity";
import { BeforeInsert, Column, Entity, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";
import {IsEmail} from 'class-validator';
import * as argon2 from 'argon2';


@Entity('user')
export class UserEntity{

    @PrimaryColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    @IsEmail()
    email: string;

    @Column({default: ''})
    image: string;

    @Column()
    password: string;

    @BeforeInsert()
    async hashPassword(){
        this.password = await argon2.hash(this.password);
    }

    @OneToMany(type => TodoEntity, todo => todo.owner)
    todos: TodoEntity[]
}