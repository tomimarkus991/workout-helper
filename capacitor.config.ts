import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.caliwiz.www",
  appName: "CaliWiz",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
};

export default config;
