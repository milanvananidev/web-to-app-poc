# POC: Webview App Generator

⚠ **This is just a POC (Proof of Concept).** This is **not** a production-ready codebase. (Don't judge me from this code! 😆)

## 📌 Overview

This project is a **SaaS-based system** that allows users to create a mobile app with a WebView by providing their **website URL, app logo, and bundle ID**. It triggers a secondary service to generate an APK using **Expo & EAS Build**.

## 🛠 Prerequisites

To run this project, you need to set up the following on your local machine:

### **1️⃣ Install Required Dependencies**

- **Node.js** (v16 or later)
- **Expo CLI**
  ```bash
  npm install -g expo-cli eas-cli
  ```
- **Expo Account** (Login required)
  ```bash
  eas login
  ```
- **Git** (for version control)
- **MongoDB (Optional, for persistent storage)**

### **2️⃣ Clone the Repository**

```bash
git clone https://github.com/your-username/app-generator.git
cd app-generator
```

### **3️⃣ Install Project Dependencies**

```bash
npm install
```

### **4️⃣ Start the Primary Server (Port: 3000)**

```bash
node index.js
```

### **5️⃣ Start the Secondary Server (Port: 4000)**

```bash
cd secondary-server
node server.js
```

## ⚠ Known Issues

- **Expo requires login before building** (`eas login`).
- **Build times depend on Expo servers** (usually takes a few minutes).

## 🤝 Contributing

This is just a POC. If you want to improve it, feel free to fork and submit a PR! Or just sit back and laugh at my messy code. 🤷‍♂️

## 📄 License

MIT License. Free to use, modify, or shake your head at. ✌️

