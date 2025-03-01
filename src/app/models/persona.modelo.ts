export class Persona{

    constructor(
        
        public id: number,
        public name: string,
        public last_name: string, // solo por esX4a Vers para editar
        public ci: number,
        public celular: number,
        public gender: string,
        public createdAt: Date,
        public updatedAt: Date
    ){}
}