export class Region {
    nom:string
    id:string
    constructor(Id:string, Nom:string){
        this.nom = Nom
        this.id = Id
    }
}


export class Departement extends Region{
    coord:[number,number]
    constructor(Id:string, Nom:string, Coord:[number,number]){
        super(Id, Nom)
        this.coord = Coord
    }
}