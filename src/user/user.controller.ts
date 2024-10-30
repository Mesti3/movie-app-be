import { Body, Delete, Get, HttpException, Param, Post, Put, UsePipes } from "@nestjs/common";
import { UserRO } from "./user.interface";
import { UserService } from "./user.service";
import { CreateUserDto, LoginUserDto, UpdateUserDto } from "./dto";
import {ValidationPipe} from '../shared/pipes/validation.pipe';
import {User} from './user.decorator';


export class UserController {

    constructor(private readonly userService: UserService){}

    @Get('user')
    async findMe(@User('email') email: string): Promise<UserRO>{
        return await this.userService.findByEmail(email);
    }

    @Put('user')
    async update(@User('id') userId: number, @Body('user') userData: UpdateUserDto){
        return await this.userService.update(userId, userData)
    }

    @UsePipes(new ValidationPipe())
    @Post('users')
    async create(@Body('user') userData: CreateUserDto){
        return this.userService.create(userData)
    }

    @Delete('users/:slug')
    async delete(@Param() params){
        return await this.userService.delete(params.slug);
    }

    @UsePipes(new ValidationPipe())
    @Post('users/login')
    async login(@Body('user') LoginUserDto: LoginUserDto): Promise<UserRO>{
        const _user = await this.userService.findOne(LoginUserDto);

        const errors = {User: ' not found'};
        if(!_user) throw new HttpException({errors}, 401);

        const token = await this.userService.generateJWT(_user);
        const {email, username, image} = _user;
        const user = {email, token, username, image};
        return {user}
    }

    
}