import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useParkingStore } from "@/store/parkingStore";
import { Button } from "@/components/Button";
import { colors } from "@/constants/colors";
import { Image } from "expo-image";
import { MapPin, Clock, Car, DollarSign } from "lucide-react-native";
import { ParkingSpot } from "@/types";

export default function ParkingDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getParkingSpotById, bookParkingSpot } = useParkingStore();
  
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [parkingSpot, setParkingSpot] = useState<ParkingSpot | undefined>(undefined);

  useEffect(() => {
    loadParkingDetails();
  }, [id]);

  const loadParkingDetails = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const spotData = await getParkingSpotById(id);
      setParkingSpot(spotData);
    } catch (error) {
      console.error("Error loading parking details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookParking = async () => {
    if (!parkingSpot || booking) return;
    
    setBooking(true);
    try {
      const newBooking = await bookParkingSpot(parkingSpot.id);
      
      if (newBooking) {
        router.push(`/booking/${newBooking.id}`);
      }
    } catch (error) {
      console.error("Error booking parking:", error);
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!parkingSpot) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Parking spot not found</Text>
        <Button 
          title="Go Back" 
          onPress={() => router.back()} 
          style={styles.button}
        />
      </View>
    );
  }

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
          <Text style={styles.sectionTitle}>Parking Information</Text>
          
          <View style={styles.infoRow}>
            <Car size={20} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Total Spots</Text>
              <Text style={styles.infoValue}>{parkingSpot.totalSpots}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Car size={20} color={parkingSpot.available ? colors.success : colors.danger} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Available Spots</Text>
              <Text style={[
                styles.infoValue,
                { color: parkingSpot.available ? colors.success : colors.danger }
              ]}>
                {parkingSpot.availableSpots}
              </Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <DollarSign size={20} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Hourly Rate</Text>
              <Text style={styles.infoValue}>${parkingSpot.hourlyRate.toFixed(2)}/hour</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Clock size={20} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Status</Text>
              <View style={[
                styles.statusBadge, 
                { backgroundColor: parkingSpot.available ? colors.success : colors.danger }
              ]}>
                <Text style={styles.statusText}>
                  {parkingSpot.available ? "Available" : "Full"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {parkingSpot.name} offers convenient parking in a prime location. The facility is well-maintained, 
            secure, and accessible 24/7. Perfect for both short-term and long-term parking needs.
          </Text>
        </View>
      </View>
      
      <Button 
        title="Book This Spot" 
        onPress={handleBookParking} 
        disabled={!parkingSpot.available}
        loading={booking}
        style={styles.button}
      />
      
      {!parkingSpot.available && (
        <Text style={styles.unavailableText}>
          This parking spot is currently full. Please check back later or choose another location.
        </Text>
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
    height: 250,
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
    marginBottom: 16,
  },
  descriptionSection: {
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
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  button: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  unavailableText: {
    fontSize: 14,
    color: colors.danger,
    textAlign: "center",
    marginTop: 8,
    marginHorizontal: 16,
  },
});