import React, { useEffect, useState } from "react";
import { StyleSheet, View, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { router } from "expo-router";
import { useParkingStore } from "@/store/parkingStore";
import { BookingCard } from "@/components/BookingCard";
import { EmptyState } from "@/components/EmptyState";
import { colors } from "@/constants/colors";
import { ClipboardList } from "lucide-react-native";
import { Booking, ParkingSpot } from "@/types";

export default function BookingsScreen() {
  const { bookings, parkingSpots, isLoading, loadBookings, loadParkingSpots } = useParkingStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([loadBookings(), loadParkingSpots()]);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleBookingPress = (booking: Booking) => {
    router.push(`/booking/${booking.id}`);
  };

  const getParkingSpotForBooking = (booking: Booking): ParkingSpot => {
    const spot = parkingSpots.find(s => s.id === booking.parkingSpotId);
    // Return a default if not found (shouldn't happen in real app)
    return spot || {
      id: "unknown",
      name: "Unknown Parking",
      location: "Location not available",
      hourlyRate: 0,
      available: false,
      totalSpots: 0,
      availableSpots: 0,
      imageUrl: "",
    };
  };

  if (isLoading && !refreshing && bookings.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookingCard 
            booking={item} 
            parkingSpot={getParkingSpotForBooking(item)}
            onPress={handleBookingPress} 
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            title="No Bookings Yet"
            message="You haven't made any parking bookings yet. Book a parking spot to see it here."
            icon={<ClipboardList size={48} color={colors.textSecondary} />}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
});