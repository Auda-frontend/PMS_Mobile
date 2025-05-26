import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useParkingStore } from "@/store/parkingStore";
import { Button } from "@/components/Button";
import { colors } from "@/constants/colors";
import { Clock, Calendar, DollarSign } from "lucide-react-native";
import { Booking, ParkingSpot } from "@/types";

export default function CheckoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getBookingById, getParkingSpotById, checkoutFromParking } = useParkingStore();
  
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [parkingSpot, setParkingSpot] = useState<ParkingSpot | undefined>(undefined);
  const [duration, setDuration] = useState({ hours: 0, minutes: 0 });
  const [estimatedCost, setEstimatedCost] = useState(0);

  useEffect(() => {
    loadBookingDetails();
    
    // Update duration and cost every minute
    const intervalId = setInterval(calculateDurationAndCost, 60000);
    return () => clearInterval(intervalId);
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
        
        if (spotData) {
          calculateDurationAndCost(bookingData, spotData);
        }
      }
    } catch (error) {
      console.error("Error loading booking details:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDurationAndCost = (
    currentBooking = booking, 
    currentSpot = parkingSpot
  ) => {
    if (!currentBooking || !currentSpot) return;
    
    const startTime = new Date(currentBooking.startTime);
    const now = new Date();
    const durationMs = now.getTime() - startTime.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);
    
    const hours = Math.floor(durationHours);
    const minutes = Math.floor((durationHours - hours) * 60);
    
    setDuration({ hours, minutes });
    setEstimatedCost(Math.ceil(durationHours * currentSpot.hourlyRate));
  };

  const handleCheckout = async () => {
    if (!booking) return;
    
    setProcessing(true);
    try {
      const ticket = await checkoutFromParking(booking.id);
      if (ticket) {
        router.replace("/ticket");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to process checkout. Please try again.");
    } finally {
      setProcessing(false);
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
        <Button 
          title="Go Back" 
          onPress={() => router.back()} 
          style={styles.button}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Checkout Summary</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Parking Location</Text>
          <Text style={styles.infoValue}>{parkingSpot.name}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Calendar size={18} color={colors.primary} style={styles.icon} />
          <Text style={styles.infoLabel}>Check-in Time</Text>
          <Text style={styles.infoValue}>{formatDate(booking.startTime)}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Clock size={18} color={colors.primary} style={styles.icon} />
          <Text style={styles.infoLabel}>Duration</Text>
          <Text style={styles.infoValue}>
            {duration.hours}h {duration.minutes}m
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <DollarSign size={18} color={colors.primary} style={styles.icon} />
          <Text style={styles.infoLabel}>Rate</Text>
          <Text style={styles.infoValue}>${parkingSpot.hourlyRate.toFixed(2)}/hour</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Estimated Total</Text>
          <Text style={styles.totalValue}>${estimatedCost.toFixed(2)}</Text>
        </View>
        
        <Text style={styles.note}>
          Note: The final amount will be calculated at the time of checkout.
        </Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Cancel" 
          variant="outline"
          onPress={() => router.back()} 
          style={styles.cancelButton}
        />
        <Button 
          title="Confirm Checkout" 
          onPress={handleCheckout} 
          loading={processing}
          style={styles.confirmButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
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
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 24,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  icon: {
    marginRight: 8,
  },
  infoLabel: {
    flex: 1,
    fontSize: 16,
    color: colors.textSecondary,
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.primary,
  },
  note: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 24,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  confirmButton: {
    flex: 1,
  },
  button: {
    marginTop: 16,
  },
});