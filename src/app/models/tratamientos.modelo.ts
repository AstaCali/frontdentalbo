export class Tratamiento{

    constructor(
        
        public id: number,
        public name_treatment: string,
        public price: number,
        public discount: number,
        public state: boolean,
        public createdAt: Date,
        public updatedAt: Date

    ){}
}