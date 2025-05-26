import React, { useEffect, useState } from "react";
import { StyleSheet, View, FlatList, ActivityIndicator, RefreshControl, TextInput, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useParkingStore } from "@/store/parkingStore";
import { ParkingSpotCard } from "@/components/ParkingSpotCard";
import { EmptyState } from "@/components/EmptyState";
import { colors } from "@/constants/colors";
import { Car, Search, X } from "lucide-react-native";
import { ParkingSpot } from "@/types";

export default function AvailableParkingScreen() {
  const { parkingSpots, isLoading, loadParkingSpots } = useParkingStore();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSpots, setFilteredSpots] = useState<ParkingSpot[]>([]);

  useEffect(() => {
    loadParkingSpots();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSpots(parkingSpots.filter(spot => spot.available));
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredSpots(
        parkingSpots.filter(
          spot => 
            spot.available && 
            (spot.name.toLowerCase().includes(query) || 
             spot.location.toLowerCase().includes(query))
        )
      );
    }
  }, [searchQuery, parkingSpots]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadParkingSpots();
    setRefreshing(false);
  };

  const handleParkingPress = (spot: ParkingSpot) => {
    router.push(`/parking/${spot.id}`);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search parking spots..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch}>
            <X size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      
      <FlatList
        data={filteredSpots}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ParkingSpotCard 
            spot={item} 
            onPress={handleParkingPress} 
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
            title={searchQuery ? "No Results Found" : "No Parking Available"}
            message={
              searchQuery 
                ? "We couldn't find any parking spots matching your search. Try different keywords."
                : "There are no parking spots available at the moment. Please check back later."
            }
            icon={<Car size={48} color={colors.textSecondary} />}
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
});