import AsyncStorage from "@react-native-async-storage/async-storage";
import { Booking, ParkingSpot, Ticket } from "@/types";
import { parkingSpots } from "@/mocks/parkingSpots";

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get all parking spots
export const fetchParkingSpots = async (): Promise<ParkingSpot[]> => {
  await delay(800);
  return parkingSpots;
};

// Get parking spot by ID
export const fetchParkingSpotById = async (id: string): Promise<ParkingSpot | undefined> => {
  await delay(500);
  return parkingSpots.find(spot => spot.id === id);
};

// Get all bookings
export const fetchBookings = async (): Promise<Booking[]> => {
  await delay(800);
  try {
    const bookingsJson = await AsyncStorage.getItem("bookings");
    return bookingsJson ? JSON.parse(bookingsJson) : [];
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
};

// Get booking by ID
export const fetchBookingById = async (id: string): Promise<Booking | null> => {
  await delay(500);
  try {
    const bookings = await fetchBookings();
    return bookings.find(booking => booking.id === id) || null;
  } catch (error) {
    console.error("Error fetching booking:", error);
    return null;
  }
};

// Create a new booking
export const createBooking = async (parkingSpotId: string): Promise<Booking> => {
  await delay(1000);
  try {
    const bookings = await fetchBookings();
    
    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      parkingSpotId,
      startTime: new Date().toISOString(),
      endTime: null,
      status: "active",
      totalCost: null,
    };
    
    const updatedBookings = [...bookings, newBooking];
    await AsyncStorage.setItem("bookings", JSON.stringify(updatedBookings));
    
    return newBooking;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw new Error("Failed to create booking");
  }
};

// Checkout from a booking
export const checkoutBooking = async (bookingId: string): Promise<Ticket> => {
  await delay(1000);
  try {
    const bookings = await fetchBookings();
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    
    if (bookingIndex === -1) {
      throw new Error("Booking not found");
    }
    
    const booking = bookings[bookingIndex];
    const parkingSpot = await fetchParkingSpotById(booking.parkingSpotId);
    
    if (!parkingSpot) {
      throw new Error("Parking spot not found");
    }
    
    const startTime = new Date(booking.startTime);
    const endTime = new Date();
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);
    const totalCost = Math.ceil(durationHours * parkingSpot.hourlyRate);
    
    const updatedBooking: Booking = {
      ...booking,
      endTime: endTime.toISOString(),
      status: "completed",
      totalCost,
    };
    
    bookings[bookingIndex] = updatedBooking;
    await AsyncStorage.setItem("bookings", JSON.stringify(bookings));
    
    // Format duration for display
    const hours = Math.floor(durationHours);
    const minutes = Math.floor((durationHours - hours) * 60);
    const durationFormatted = `${hours}h ${minutes}m`;
    
    const ticket: Ticket = {
      bookingId,
      parkingSpotName: parkingSpot.name,
      startTime: booking.startTime,
      endTime: endTime.toISOString(),
      duration: durationFormatted,
      totalCost,
    };
    
    return ticket;
  } catch (error) {
    console.error("Error checking out booking:", error);
    throw new Error("Failed to checkout booking");
  }
};