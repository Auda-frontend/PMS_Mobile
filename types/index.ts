export interface ParkingSpot {
    id: string;
    name: string;
    location: string;
    hourlyRate: number;
    available: boolean;
    totalSpots: number;
    availableSpots: number;
    imageUrl: string;
  }
  
  export interface Booking {
    id: string;
    parkingSpotId: string;
    startTime: string;
    endTime: string | null;
    status: "active" | "completed";
    totalCost: number | null;
  }
  
  export interface Ticket {
    bookingId: string;
    parkingSpotName: string;
    startTime: string;
    endTime: string;
    duration: string;
    totalCost: number;
  }