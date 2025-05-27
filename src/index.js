import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from "react-native";
import * as Location from "expo-location";

const weatherApiKey = "3cc4cb791bef4960b5f100054252705";

const Weather = () => {
  const [forecast, setForecast] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadForecast = async () => {
    setRefreshing(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Adgang nægtet");
      setRefreshing(false);
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
      });

      // WeatherAPI.com current weather endpoint
      const url = `http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${location.coords.latitude},${location.coords.longitude}&aqi=no`;
      console.log("Fetching from", url);

      const response = await fetch(url);
      const data = await response.json();
      console.log("API RESPONSE", data);

      if (!response.ok) {
        Alert.alert(
          "Error",
          data.error?.message || "Something went wrong with the API request"
        );
      } else {
        setForecast(data);
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to load forecast");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadForecast();
  }, []);

  if (!forecast) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  // WeatherAPI.com data structure
  const current = forecast.current;
  const location_info = forecast.location;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadForecast} />
        }
        style={{ marginTop: 50 }}
      >
        <Text style={styles.title}>Current Weather</Text>
        <Text style={{ textAlign: "center" }}>
          {location_info.name}, {location_info.region}
        </Text>
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Text style={{ fontSize: 24 }}>{current.condition.text}</Text>
          <Text>Temperature: {current.temp_c}°C</Text>
          <Text>Feels like: {current.feelslike_c}°C</Text>
          <Text>Humidity: {current.humidity}%</Text>
          <Text>Wind: {current.wind_kph} km/h</Text>
          <Text>Last updated: {current.last_updated}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Weather;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ECDBBA" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    textAlign: "center",
    fontSize: 36,
    fontWeight: "bold",
    color: "#C84831",
  },
});
