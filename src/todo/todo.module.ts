import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { AuthMiddleware } from "src/user/auth.middleware";
import {TypeOrmModule} from '@nestjs/typeorm';
import {TodoEntity} from './todo.entity';



@Module({
    imports:[TypeOrmModule.forFeature([TodoEntity])],
    providers:[],
    controllers:[]
})
export class TodoModule implements NestModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes({path: 'user', method: RequestMethod.GET}, {path: 'user', method: RequestMethod.PUT})
    }
}