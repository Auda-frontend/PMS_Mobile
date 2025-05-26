import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Ticket } from "@/types";
import { colors } from "@/constants/colors";
import { Calendar, Clock, DollarSign } from "lucide-react-native";

interface TicketViewProps {
  ticket: Ticket;
}

export const TicketView: React.FC<TicketViewProps> = ({ ticket }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Parking Receipt</Text>
        <View style={styles.divider} />
      </View>
      
      <View style={styles.parkingInfo}>
        <Text style={styles.parkingName}>{ticket.parkingSpotName}</Text>
      </View>
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Calendar size={18} color={colors.primary} />
          <View>
            <Text style={styles.detailLabel}>Check-in</Text>
            <Text style={styles.detailValue}>{formatDate(ticket.startTime)}</Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <Calendar size={18} color={colors.primary} />
          <View>
            <Text style={styles.detailLabel}>Check-out</Text>
            <Text style={styles.detailValue}>{formatDate(ticket.endTime)}</Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <Clock size={18} color={colors.primary} />
          <View>
            <Text style={styles.detailLabel}>Duration</Text>
            <Text style={styles.detailValue}>{ticket.duration}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.totalContainer}>
        <DollarSign size={20} color={colors.text} />
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalAmount}>${ticket.totalCost.toFixed(2)}</Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Thank you for using our parking service!</Text>
        <Text style={styles.footerText}>Receipt ID: {ticket.bookingId.substring(0, 8)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  parkingInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  parkingName: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
  },
  detailsContainer: {
    gap: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
  },
  totalContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.primary,
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
});