import { View, Text } from "react-native";
import React from "react";
import * as Location from "expo-location";

const oWeatherKey = "dff24ec7452c59d5e4d74f256dff3dcf";
let url =
  "http://api.openweathermap.org/data/2.5/onecall?&units=metric&exclude=minutely&appid=${oWeatherKey}";
const Weather = () => {
  const [forecast, setForcast] = useState(null);
  return (
    <View>
      <Text></Text>
    </View>
  );
};

export default Weather;
