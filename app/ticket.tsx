import React, { useEffect } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { router } from "expo-router";
import { useParkingStore } from "@/store/parkingStore";
import { TicketView } from "@/components/TicketView";
import { Button } from "@/components/Button";
import { colors } from "@/constants/colors";
import { EmptyState } from "@/components/EmptyState";
import { Ticket } from "lucide-react-native";

export default function TicketScreen() {
  const { currentTicket, clearTicket } = useParkingStore();

  useEffect(() => {
    return () => {
      // Clear the ticket when navigating away
      clearTicket();
    };
  }, []);

  const handleDone = () => {
    router.replace("/(tabs)");
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
    >
      {currentTicket ? (
        <>
          <TicketView ticket={currentTicket} />
          <Button 
            title="Done" 
            onPress={handleDone} 
            style={styles.button}
          />
        </>
      ) : (
        <EmptyState
          title="No Ticket Available"
          message="There is no active parking ticket to display."
          icon={<Ticket size={48} color={colors.textSecondary} />}
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
    padding: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
  button: {
    marginTop: 24,
  },
});