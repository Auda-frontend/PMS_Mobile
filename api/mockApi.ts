import AsyncStorage from "@react-native-async-storage/async-storage";
import { Booking, ParkingSpot, Ticket } from "@/types";
import { parkingSpots } from "@/mocks/parkingSpots";

const BASE_URL = "https://6834e461cd78db2058bfa8a2.mockapi.io/api/v1";

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// register user
export const registerUser = async (userData: {
  fullNames: string;
  email: string;
  password: string;
}): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...userData,
        createdAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || 'Registration failed' };
    }

    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/users?email=${encodeURIComponent(email)}`);
    if (!response.ok) {
      return false;
    }
    const users = await response.json();
    return users.length > 0;
  } catch (error) {
    console.error('Error checking email:', error);
    return false;
  }
};

// Get all parking spots
export const fetchParkingSpots = async (): Promise<ParkingSpot[]> => {
  try {
    const response = await fetch(`${BASE_URL}/parkingSpots`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching parking spots:", error);
    // Fallback to local storage if API fails
    try {
      const localSpots = await AsyncStorage.getItem("parkingSpots");
      return localSpots ? JSON.parse(localSpots) : [];
    } catch (localError) {
      console.error("Error fetching from local storage:", localError);
      return [];
    }
  }
};

// Get parking spot by ID
export const fetchParkingSpotById = async (id: string): Promise<ParkingSpot | null> => {
  try {
    const response = await fetch(`${BASE_URL}/parkingSpots/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching parking spot ${id}:`, error);
    // Fallback to local storage
    try {
      const localSpots = await AsyncStorage.getItem("parkingSpots");
      if (localSpots) {
        const spots: ParkingSpot[] = JSON.parse(localSpots);
        return spots.find(spot => spot.id === id) || null;
      }
      return null;
    } catch (localError) {
      console.error("Error fetching from local storage:", localError);
      return null;
    }
  }
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