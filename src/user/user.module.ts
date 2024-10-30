import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { AuthMiddleware } from "./auth.middleware";

@Module({
    imports: [

    ],
    controllers:[],
    providers: []
})
export class UserModule implements NestModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes({path: 'user', method: RequestMethod.GET}, {path: 'user', method: RequestMethod.PUT})
    }
}