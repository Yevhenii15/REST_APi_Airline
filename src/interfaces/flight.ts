export interface Flight extends Document {
    flight_id: number;
    flightNumber: number;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    status: string;
    seatsAvailable: number;
    depatureDate: Date;
    arrivalDate: Date;
    departureAirport_id: number;
    arrivalAirport_id: number;
    aircraft_id: number;
} 
