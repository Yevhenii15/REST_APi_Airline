export interface Airport extends Document {
    airport_id: string;
    name: string;
    airportCode: string;
    postalCode: string;
    city: string;
    country: string;
}