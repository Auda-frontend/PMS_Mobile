import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useParkingStore } from "@/store/parkingStore";
import { Button } from "@/components/Button";
import { colors } from "@/constants/colors";
import { Image } from "expo-image";
import { MapPin, Clock, Calendar, DollarSign } from "lucide-react-native";
import { Booking, ParkingSpot } from "@/types";

export default function BookingDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getBookingById, getParkingSpotById } = useParkingStore();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [parkingSpot, setParkingSpot] = useState<ParkingSpot | undefined>(undefined);

  useEffect(() => {
    loadBookingDetails();
  }, [id]);

  const loadBookingDetails = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const bookingData = await getBookingById(id);
      setBooking(bookingData);

      if (bookingData) {
        const spotData = await getParkingSpotById(bookingData.parkingSpotId);
        setParkingSpot(spotData);
      }
    } catch (error) {
      console.error("Error loading booking details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    if (booking) {
      router.push({ pathname: "/checkout/[id]", params: { id: booking.id } });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!booking || !parkingSpot) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Booking not found</Text>
        <Button title="Go Back" onPress={() => router.back()} style={styles.button} />
      </View>
    );
  }

  const isActive = booking.status === "active";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image
        source={{ uri: parkingSpot.imageUrl }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.parkingName}>{parkingSpot.name}</Text>
        <View style={styles.locationContainer}>
          <MapPin size={18} color={colors.textSecondary} />
          <Text style={styles.location}>{parkingSpot.location}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Booking Information</Text>
          <View style={styles.infoRow}>
            <Calendar size={20} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Check-in Time</Text>
              <Text style={styles.infoValue}>{formatDate(booking.startTime)}</Text>
            </View>
          </View>
          {booking.endTime && (
            <View style={styles.infoRow}>
              <Calendar size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Check-out Time</Text>
                <Text style={styles.infoValue}>{formatDate(booking.endTime)}</Text>
              </View>
            </View>
          )}
          <View style={styles.infoRow}>
            <Clock size={20} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Status</Text>
              <View
                style={[styles.statusBadge, { backgroundColor: isActive ? colors.primary : colors.success }]}
              >
                <Text style={styles.statusText}>{isActive ? "Active" : "Completed"}</Text>
              </View>
            </View>
          </View>
          <View style={styles.infoRow}>
            <DollarSign size={20} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Rate</Text>
              <Text style={styles.infoValue}>${parkingSpot.hourlyRate.toFixed(2)}/hour</Text>
            </View>
          </View>
          {booking.totalCost !== null && (
            <View style={styles.infoRow}>
              <DollarSign size={20} color={colors.success} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Total Cost</Text>
                <Text style={styles.totalCost}>${booking.totalCost.toFixed(2)}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
      {isActive && (
        <Button title="Checkout" onPress={handleCheckout} style={styles.button} />
      )}
      {!isActive && (
        <Button
          title="View Receipt"
          variant="outline"
          onPress={() => router.push("/ticket")}
          style={styles.button}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: 18,
    color: colors.danger,
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 200,
  },
  detailsContainer: {
    padding: 16,
  },
  parkingName: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  location: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
    color: "white",
  },
  totalCost: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.success,
  },
  button: {
    marginHorizontal: 16,
    marginTop: 8,
  },
});