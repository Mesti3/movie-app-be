import { SECRET } from "src/config";

const jwt = require('jsonwebtoken');


export class BaseController {
    constructor(){}

    protected getUserIdFromToken(authorization){
        if(!authorization) return null;

        const token = authorization.split(' ')[1];
        const decoded: any = jwt.verify(token, SECRET);
        return decoded.id;
    }
}