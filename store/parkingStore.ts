import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ParkingSpot, Booking, Ticket } from "@/types";
import { 
  fetchParkingSpots, 
  fetchBookings, 
  createBooking, 
  checkoutBooking,
  fetchBookingById,
  fetchParkingSpotById
} from "@/api/mockApi";

interface ParkingState {
  parkingSpots: ParkingSpot[];
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  currentTicket: Ticket | null;
  
  // Actions
  loadParkingSpots: () => Promise<void>;
  loadBookings: () => Promise<void>;
  bookParkingSpot: (parkingSpotId: string) => Promise<Booking | null>;
  checkoutFromParking: (bookingId: string) => Promise<Ticket | null>;
  getBookingById: (bookingId: string) => Promise<Booking | null>;
  getParkingSpotById: (parkingSpotId: string) => Promise<ParkingSpot | undefined>;
  clearTicket: () => void;
}

export const useParkingStore = create<ParkingState>()(
  persist(
    (set, get) => ({
      parkingSpots: [],
      bookings: [],
      isLoading: false,
      error: null,
      currentTicket: null,
      
      loadParkingSpots: async () => {
        set({ isLoading: true, error: null });
        try {
          const spots = await fetchParkingSpots();
          set({ parkingSpots: spots, isLoading: false });
        } catch (error) {
          set({ 
            error: "Failed to load parking spots", 
            isLoading: false 
          });
        }
      },
      
      loadBookings: async () => {
        set({ isLoading: true, error: null });
        try {
          const bookings = await fetchBookings();
          set({ bookings, isLoading: false });
        } catch (error) {
          set({ 
            error: "Failed to load bookings", 
            isLoading: false 
          });
        }
      },
      
      bookParkingSpot: async (parkingSpotId: string) => {
        set({ isLoading: true, error: null });
        try {
          const newBooking = await createBooking(parkingSpotId);
          set(state => ({ 
            bookings: [...state.bookings, newBooking],
            isLoading: false 
          }));
          return newBooking;
        } catch (error) {
          set({ 
            error: "Failed to book parking spot", 
            isLoading: false 
          });
          return null;
        }
      },
      
      checkoutFromParking: async (bookingId: string) => {
        set({ isLoading: true, error: null });
        try {
          const ticket = await checkoutBooking(bookingId);
          
          // Update the booking in the state
          set(state => {
            const updatedBookings = state.bookings.map(booking => 
              booking.id === bookingId 
                ? { 
                    ...booking, 
                    endTime: ticket.endTime, 
                    status: "completed" as const, 
                    totalCost: ticket.totalCost 
                  } 
                : booking
            );
            
            return { 
              ...state,
              bookings: updatedBookings, 
              currentTicket: ticket,
              isLoading: false
            };
          });
          
          return ticket;
        } catch (error) {
          set({ 
            error: "Failed to checkout from parking", 
            isLoading: false 
          });
          return null;
        }
      },
      
      getBookingById: async (bookingId: string) => {
        return await fetchBookingById(bookingId);
      },
      
      getParkingSpotById: async (parkingSpotId: string) => {
        return await fetchParkingSpotById(parkingSpotId);
      },
      
      clearTicket: () => {
        set({ currentTicket: null });
      }
    }),
    {
      name: "parking-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        bookings: state.bookings,
        currentTicket: state.currentTicket
      }),
    }
  )
);