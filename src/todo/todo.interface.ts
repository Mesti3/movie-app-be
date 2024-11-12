export interface TodoData{
    id: number;
    title: string;
    description: string;
    completed: boolean;
    releaseDate: Date;
    owner: string;
}

export interface TodoRO{
    todo: TodoData;
}