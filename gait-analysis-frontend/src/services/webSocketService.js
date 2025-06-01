import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export function connectWebSocket(authToken, onMessageHandlers) {
  const socket = new SockJS("http://localhost:8080/ws");

  // Optional: log the token being used
  console.log("🔐 JWT Token for WebSocket:", authToken);

  stompClient = new Client({
    webSocketFactory: () => socket,

    connectHeaders: authToken ? { Authorization: `Bearer ${authToken}` } : {},

    onConnect: () => {
      console.log("✅ WebSocket connected");

      // Subscribe to user-specific topics
      stompClient.subscribe("/user/topic/status/alive", (msg) =>
        onMessageHandlers.onDeviceAlive?.(JSON.parse(msg.body))
      );

      stompClient.subscribe("/user/topic/status/calibration", (msg) =>
        onMessageHandlers.onCalibration?.(JSON.parse(msg.body))
      );

      stompClient.subscribe("/user/topic/status/orientation", (msg) =>
        onMessageHandlers.onOrientation?.(JSON.parse(msg.body))
      );

      stompClient.subscribe("/user/topic/status/results", (msg) =>
        onMessageHandlers.onResultsReady?.(JSON.parse(msg.body))
      );

      stompClient.subscribe("/user/topic/data/sensor", (msg) =>
        onMessageHandlers.onSensorData?.(JSON.parse(msg.body))
      );
    },

    onStompError: (frame) => {
      console.error("❌ STOMP error:", frame.headers["message"]);
      console.error("📦 Details:", frame.body);
    },

    onWebSocketError: (event) => {
      console.error("🚨 WebSocket error:", event);
    },

    reconnectDelay: 5000,
    debug: (str) => console.log(str),
  });

  stompClient.activate();
}

export function disconnectWebSocket() {
  if (stompClient) {
    stompClient.deactivate();
    console.log("🛑 WebSocket disconnected");
  }
}
