const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let appRequests = {}; // In-memory storage

// User requests app creation
app.post("/create-app", async (req, res) => {
    const { userId, websiteUrl, bundleId, logoUrl } = req.body;

    if (!userId || !websiteUrl || !bundleId || !logoUrl) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    appRequests[userId] = { websiteUrl, bundleId, logoUrl, status: "processing" };

    try {
        await axios.post("http://localhost:4000/generate-apk", {
            userId,
            websiteUrl,
            bundleId,
            logoUrl,
        });

        res.json({ success: true, message: "App creation started" });
    } catch (error) {
        console.error("Error triggering APK generation:", error);
        res.status(500).json({ success: false, message: "Failed to start app creation" });
    }
});

// Webhook for receiving APK-ready event
app.post("/webhook/apk-ready", (req, res) => {
    const { userId, apkUrl } = req.body;

    if (!userId || !apkUrl || !appRequests[userId]) {
        return res.status(400).json({ success: false, message: "Invalid data" });
    }

    appRequests[userId].status = "completed";
    appRequests[userId].apkUrl = apkUrl;

    res.json({ success: true, message: "Webhook received" });
});

// User checks app status
app.get("/app-status/:userId", (req, res) => {
    const { userId } = req.params;

    if (!appRequests[userId]) {
        return res.status(404).json({ success: false, message: "App request not found" });
    }

    res.json({ success: true, data: appRequests[userId] });
});

app.listen(3000, () => {
    console.log("✅ Primary Server running on http://localhost:3000");
});
