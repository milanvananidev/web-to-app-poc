
import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const App = () => {
  return (
    <View style={styles.container}>
      <WebView source={{ uri: "https://milanvanani.in" }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default App;
