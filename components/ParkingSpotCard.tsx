import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from "react-native";
import { Image } from "expo-image";
import { ParkingSpot } from "@/types";
import { colors } from "@/constants/colors";
import { MapPin, DollarSign } from "lucide-react-native";

interface ParkingSpotCardProps {
  spot: ParkingSpot;
  onPress: (spot: ParkingSpot) => void;
}

const { width } = Dimensions.get("window");

export const ParkingSpotCard: React.FC<ParkingSpotCardProps> = ({ spot, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress(spot)}
      disabled={!spot.available}
    >
      <Image
        source={{ uri: spot.imageUrl }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      
      <View style={styles.content}>
        <Text style={styles.name}>{spot.name}</Text>
        
        <View style={styles.locationContainer}>
          <MapPin size={16} color={colors.textSecondary} />
          <Text style={styles.location}>{spot.location}</Text>
        </View>
        
        <View style={styles.detailsRow}>
          <View style={styles.rateContainer}>
            <DollarSign size={16} color={colors.primary} />
            <Text style={styles.rate}>${spot.hourlyRate.toFixed(2)}/hr</Text>
          </View>
          
          <View style={[
            styles.availabilityBadge, 
            { backgroundColor: spot.available ? colors.success : colors.danger }
          ]}>
            <Text style={styles.availabilityText}>
              {spot.available 
                ? `${spot.availableSpots} spots` 
                : "Full"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 150,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  location: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rate: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    marginLeft: 4,
  },
  availabilityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: "500",
    color: "white",
  },
});