import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, getRepository, Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import { CreateUserDto, LoginUserDto, UpdateUserDto } from "./dto";
import { UserRO } from "./user.interface";
import { validate } from "class-validator";
const jwt = require('jsonwebtoken');
import * as argon2 from 'argon2';
import {SECRET} from '../config';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>){}

        async findAll(): Promise<UserEntity[]>{
            return await this.userRepository.find();
        }

        async findOne({email, password} : LoginUserDto): Promise<UserEntity>{
            const user =  await this.userRepository.findOne({where: {email}});
            if(!user){
                return null;
            }

            if(await argon2.verify(user.password,password)){
                return user;
            }

            return null;
        }

        async create(dto: CreateUserDto): Promise<UserRO> {

            const { username, email, password} = dto;
            const qb = await getRepository(UserEntity)
                .createQueryBuilder('user')
                .where('user.username = :username', {username})
                .orWhere('user.email = :email', {email});

            const user = await qb.getOne();

            if(user){
                const errors = {username: 'Username and emial must be unique'};
                throw new HttpException({message: 'Input data validation failed', errors}, HttpStatus.BAD_REQUEST);
            }

            let newUser = new UserEntity();
            newUser.username = username;
            newUser.email = email;
            newUser.password = password;
            newUser.todos = [];

            const errors = await validate(newUser);
            if(errors.length > 0){
                const _errors = {username: "Username input is not valid"};
                throw new HttpException({message: 'Input data validation failed', _errors}, HttpStatus.BAD_REQUEST);
            }else{
                const savedUser = await this.userRepository.save(newUser);
                return this.buildUserRO(savedUser);
            }
        }

        async update(id: number, dto: UpdateUserDto): Promise<UserEntity> {
            let toUpdate = await this.userRepository.findOne({where: {id}});
            delete toUpdate.password

            let updated = Object.assign(toUpdate, dto);
            return await this.userRepository.save(updated)
        }

        async delete(email: string): Promise<DeleteResult>{
            return await this.userRepository.delete({email: email});
        }

        async findById(id: number): Promise<UserRO>{
            const user = await this.userRepository.findOne({where: {id}});

            if(!user){
                const errors = {User: ' not found'};
                throw new HttpException({errors}, 401)
            }

            return this.buildUserRO(user);
        }


        async findByEmail(email: string): Promise<UserRO>{
            const user = await this.userRepository.findOne({where: {email}});
            return this.buildUserRO(user);
        }

        public generateJWT(user){
            let today = new Date();
            let exp = new Date(today);

            exp.setDate(today.getDate() + 60);

            return jwt.sign({
                id: user.id,
                username: user.username,
                email: user.email,
                exp: exp.getTime() / 1000,
            },SECRET)
        }

        private buildUserRO(user: UserEntity){
            const userRo = {
                id: user.id,
                username: user.username,
                email: user.username,
                token: this.generateJWT(user),
                image: user.image
            }
            return {user: userRo}
        }

}

