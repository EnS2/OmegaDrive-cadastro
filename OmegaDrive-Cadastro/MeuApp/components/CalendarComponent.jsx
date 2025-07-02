import React, { useState } from "react";
import { View, Text, StyleSheet, Platform, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const CalendarComponent = ({ selectedDate, onDateChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  const formatarData = (data) => {
    return data.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const handleChange = (event, date) => {
    setShowPicker(false);
    if (date) {
      onDateChange(date);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendário</Text>
        <Text style={styles.dateInfo}>{formatarData(selectedDate)}</Text>
      </View>

      {Platform.OS === "android" ? (
        <>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowPicker(true)}>
            <Text style={styles.dateButtonText}>Selecionar Data</Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="calendar"
              onChange={handleChange}
              locale="pt-BR"
            />
          )}
        </>
      ) : (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="inline"
          onChange={handleChange}
          locale="pt-BR"
          style={styles.pickerIOS}
        />
      )}
    </View>
  );
};

export default CalendarComponent;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#f9f9ff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  dateInfo: {
    fontSize: 14,
    color: "#7b2ff7",
    fontWeight: "500",
    marginTop: 4,
  },
  dateButton: {
    backgroundColor: "#7b2ff7",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 12,
  },
  dateButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  pickerIOS: {
    marginTop: 8,
    width: "100%",
  },
});
