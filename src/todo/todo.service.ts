import { TodoEntity } from "./todo.entity";
import { TodoRO } from "./todo.interface";

@Injectable()
export class TodoService{

    constructor(){

    }


    async findAll(query): Promise<TodoRO>{
        const qb = await getRepository(TodoEntity)
            .createQueryBuilder('todo')
            .leftJoinAndSelect('todo.owner', 'owner');

        qb.where('1 = 1');

        if ('owner' in query){
            qb.andWhere("")
        }
    }

    async findOne(){}

    async addTodo(){}

    async removeTodo(){}

    async updateTodo(){}
}