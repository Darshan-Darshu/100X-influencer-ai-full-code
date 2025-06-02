const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { WebSocketServer } = require("ws");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Create HTTP server
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Create WebSocket server on the same HTTP server
  const wss = new WebSocketServer({
    server,
    path: "/api/voice/stream",
  });

  console.log(
    "WebSocket server will be available at ws://localhost:3000/api/voice/stream"
  );

  // Handle WebSocket connections
  wss.on("connection", function connection(ws, request) {
    console.log("🔌 New WebSocket connection from Twilio");

    let openAIWs = null;
    let sessionId = null;

    // Function to connect to OpenAI
    function connectToOpenAI() {
      console.log("🤖 Connecting to OpenAI Realtime API...");

      openAIWs = new (require("ws"))(
        "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01",
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "OpenAI-Beta": "realtime=v1",
          },
        }
      );

      openAIWs.on("open", function () {
        console.log("✅ Connected to OpenAI Realtime API");

        // Configure OpenAI session
        const sessionConfig = {
          type: "session.update",
          session: {
            modalities: ["text", "audio"],
            instructions:
              "You are a helpful AI assistant. Keep responses brief and conversational.",
            voice: "alloy",
            input_audio_format: "pcm16",
            output_audio_format: "pcm16",
            input_audio_transcription: {
              model: "whisper-1",
            },
            turn_detection: {
              type: "server_vad",
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 500,
            },
          },
        };

        openAIWs.send(JSON.stringify(sessionConfig));
      });

      openAIWs.on("message", function (data) {
        const response = JSON.parse(data);

        // Handle different types of responses from OpenAI
        if (response.type === "response.audio.delta") {
          // Send audio back to Twilio
          const audioMessage = {
            event: "media",
            streamSid: sessionId,
            media: {
              payload: response.delta,
            },
          };
          ws.send(JSON.stringify(audioMessage));
        }

        if (response.type === "response.audio_transcript.done") {
          console.log("🤖 AI said:", response.transcript);
        }

        if (
          response.type ===
          "conversation.item.input_audio_transcription.completed"
        ) {
          console.log("👤 User said:", response.transcript);
        }
      });

      openAIWs.on("error", function (error) {
        console.error("❌ OpenAI WebSocket error:", error);
      });

      openAIWs.on("close", function () {
        console.log("🔌 OpenAI WebSocket connection closed");
      });
    }

    // Handle messages from Twilio
    ws.on("message", function (message) {
      const data = JSON.parse(message);

      switch (data.event) {
        case "connected":
          console.log("📞 Twilio connected");
          break;

        case "start":
          sessionId = data.start.streamSid;
          console.log("🎙️ Stream started:", sessionId);
          connectToOpenAI();
          break;

        case "media":
          // Forward audio from Twilio to OpenAI
          if (openAIWs && openAIWs.readyState === 1) {
            // 1 = OPEN
            const audioAppend = {
              type: "input_audio_buffer.append",
              audio: data.media.payload,
            };
            openAIWs.send(JSON.stringify(audioAppend));
          }
          break;

        case "stop":
          console.log("⏹️ Stream stopped");
          if (openAIWs) {
            openAIWs.close();
          }
          break;
      }
    });

    ws.on("close", function () {
      console.log("📞 Twilio WebSocket connection closed");
      if (openAIWs) {
        openAIWs.close();
      }
    });

    ws.on("error", function (error) {
      console.error("❌ Twilio WebSocket error:", error);
    });
  });

  // Start the server
  const port = process.env.PORT || 3000;
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`🚀 Server ready on http://localhost:${port}`);
    console.log(
      `🔌 WebSocket ready on ws://localhost:${port}/api/voice/stream`
    );
  });
});
