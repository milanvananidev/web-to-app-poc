const express = require("express");
const axios = require("axios");
const fs = require("fs");
const { exec, execSync } = require("child_process");
const path = require("path");

const app = express();
app.use(express.json());

const PROJECT_PATH = "../app-template";

// Endpoint to generate APK
app.post("/generate-apk", async (req, res) => {
    const { userId, websiteUrl, bundleId, logoUrl } = req.body;

    if (!userId || !websiteUrl || !bundleId || !logoUrl) {
        return res.status(400).json({ success: false, message: "Invalid request" });
    }

    console.log(`🚀 Generating APK for ${websiteUrl} with Bundle ID ${bundleId}...`);

    try {
        updateAppConfig(websiteUrl);
        updateAppJson(bundleId, logoUrl);

        // Start Expo EAS Build
        const apkUrl =  await startExpoBuild();

        if (!apkUrl) {
            return res.status(500).json({ success: false, message: "Failed to start Expo build" });
        }

        console.log(`✅ Build started with ID: ${apkUrl}`);

        if (!apkUrl) {
            return res.status(500).json({ success: false, message: "Failed to get APK URL" });
        }

        // Notify Primary Server
        await axios.post("http://localhost:3000/webhook/apk-ready", { userId, apkUrl });

        console.log(`✅ APK generated for ${userId}: ${apkUrl}`);
        res.json({ success: true, apkUrl });
    } catch (err) {
        console.error("❌ Error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Function to modify WebView URL dynamically
function updateAppConfig(websiteUrl) {
    const appJsPath = `${PROJECT_PATH}/App.js`;

    const newAppJsContent = `
import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const App = () => {
  return (
    <View style={styles.container}>
      <WebView source={{ uri: "${websiteUrl}" }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default App;
`;

    fs.writeFileSync(appJsPath, newAppJsContent, "utf8");
    console.log("✅ Updated App.js with WebView URL:", websiteUrl);
}

// Function to update app.json for Bundle ID and Logo
function updateAppJson(bundleId, logoUrl) {
    const appJsonPath = `${PROJECT_PATH}/app.json`;
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, "utf8"));

    appJson.expo.android.package = bundleId;
    appJson.expo.icon = logoUrl;

    fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2), "utf8");
    console.log("✅ Updated app.json with Bundle ID and Logo URL:", bundleId, logoUrl);
}

// Function to start Expo EAS Build
async function startExpoBuild() {
    try {
        console.log("🚀 Starting Expo Build...");

        // Set the working directory to `app-template`
        const appTemplateDir = path.resolve(__dirname, "../app-template");

        // Run the Expo EAS build command inside `app-template`
        const output = execSync("eas build --platform android --profile preview --non-interactive", {
            cwd: appTemplateDir, // Ensure it runs inside app-template directory
            encoding: "utf8",
            stdio: "pipe", // Capture output
        }).toString();
        

        console.log("✅ Expo Build Completed!");
        console.log(output);

        // Extract APK URL from the Expo CLI output
        const apkUrlMatch = output.match(/(https?:\/\/expo\.dev\/artifacts\/eas\/[^ ]+)/);

        console.log(apkUrlMatch,"--- check APK url")
        if (apkUrlMatch) {
            return apkUrlMatch[1]; // Return APK URL
        }

        return null;
    } catch (error) {
        console.error("❌ Expo Build Failed:", error.message);
        return null;
    }
}


app.listen(4000, () => {
    console.log("✅ Secondary Server running on http://localhost:4000");
});
