import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Booking, ParkingSpot } from "@/types";
import { colors } from "@/constants/colors";
import { Clock, Calendar, CheckCircle } from "lucide-react-native";

interface BookingCardProps {
  booking: Booking;
  parkingSpot: ParkingSpot;
  onPress: (booking: Booking) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({ 
  booking, 
  parkingSpot, 
  onPress 
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(booking)}>
      <View style={styles.header}>
        <Text style={styles.parkingName}>{parkingSpot.name}</Text>
        <View style={[
          styles.statusBadge, 
          { backgroundColor: booking.status === "active" ? colors.primary : colors.success }
        ]}>
          <Text style={styles.statusText}>
            {booking.status === "active" ? "Active" : "Completed"}
          </Text>
        </View>
      </View>
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Calendar size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>
            Check-in: {formatDate(booking.startTime)}
          </Text>
        </View>
        
        {booking.endTime && (
          <View style={styles.detailRow}>
            <Clock size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>
              Check-out: {formatDate(booking.endTime)}
            </Text>
          </View>
        )}
        
        {booking.totalCost !== null && (
          <View style={styles.detailRow}>
            <CheckCircle size={16} color={colors.success} />
            <Text style={styles.costText}>
              Total: ${booking.totalCost.toFixed(2)}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  parkingName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: "white",
  },
  detailsContainer: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  costText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.success,
  },
});