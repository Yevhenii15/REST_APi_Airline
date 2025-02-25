export interface Airport extends Document {
    airport_id: number;
    name: string;
    airportCode: string;
    postalCode: string;
    city: string;
    country: string;
}