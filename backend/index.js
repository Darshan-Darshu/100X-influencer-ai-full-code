import Fastify from "fastify";
import WebSocket from "ws";
import fs from "fs";
import dotenv from "dotenv";
import fastifyFormBody from "@fastify/formbody";
import fastifyWs from "@fastify/websocket";
import fetch from "node-fetch";
dotenv.config();
const { OPENAI_API_KEY } = process.env;
if (!OPENAI_API_KEY) {
  console.error("Missing OpenAI API key. Please set it in the .env file.");
  process.exit(1);
}
const fastify = Fastify();
fastify.register(fastifyFormBody);
fastify.register(fastifyWs);
const SYSTEM_MESSAGE = `
    ### Role
    You are an AI negotiator named Darshan, working at Ekalvaya. Your role is to negotiate the price with influencer for our brand Ekalvaya promotion and make a deal with them

    ### START WITH
    Greeting the influencer.
    Ask your interseted to promote
    If yes then start the negotiation with the influencer.
    ### NOT TO DO
    - Don't ask for the details of the influencer.
    ### DO
    - You ask only one question at a time and respond promptly to avoid 
    - Start the negotiation with the influencer as soon as possible.
    - Make your answer too short so that it could be interactive with the influencer.
    ### Persona
    - Your tone is friendly, professional, and efficient.
    - You keep conversations focused and concise, bringing them back on topic if necessary.
    - You ask only one question at a time and respond promptly to avoid wasting the customer's time.
    ### Conversation Guidelines
    - Always be polite and maintain a medium-paced speaking style.
    - When the conversation veers off-topic, gently bring it back with a polite reminder.
    ### Conversation Flow
    share the details of our brand Ekalvaya and ask them to promote our brand.
    ### Handling FAQs
    Use the function \`asking_the_details_of_influencer\` to ask the details from the influencer related to promotion.
    ### Negotiate the price for our influencer
    When a customer said about price:
    1. Negotiate with them for less price, use the \`negotiation\` function to negotiate.
    2. Once you and influencer concluded, make a deal.
    `;
const VOICE = "alloy";
const PORT = process.env.PORT || 5050;
const MAKE_WEBHOOK_URL = process.env.CALL_LOG_URL;
const sessions = new Map();
const LOG_EVENT_TYPES = [
  "response.content.done",
  "rate_limits.updated",
  "response.done",
  "input_audio_buffer.committed",
  "input_audio_buffer.speech_stopped",
  "input_audio_buffer.speech_started",
  "session.created",
  "response.text.done",
  "conversation.item.input_audio_transcription.completed",
];
fastify.get("/", async (request, reply) => {
  reply.send({ message: "Twilio Media Stream Server is running!" });
});
fastify.all("/incoming-call", async (request, reply) => {
  console.log("Incoming call");
  const twilioParams = request.body || request.query;
  console.log("Twilio Inbound Details:", JSON.stringify(twilioParams, null, 2));
  const callerNumber = twilioParams.From || "Unknown";
  const sessionId = twilioParams.CallSid;
  console.log("Caller Number:", callerNumber);
  console.log("Session ID (CallSid):", sessionId);
  let firstMessage = "Hello";
  try {
    const webhookResponse = await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "1",
        data1: callerNumber,
        data2: "empty",
        sid: sessionId,
      }),
    });
    if (webhookResponse.ok) {
      const responseText = await webhookResponse.text();
      console.log("Make.com webhook response:", responseText);
      try {
        const responseData = JSON.parse(responseText);
        if (responseData && responseData.firstMessage) {
          firstMessage = responseData.firstMessage;
          console.log("Parsed firstMessage from Make.com:", firstMessage);
        }
      } catch (parseError) {
        console.error("Error parsing webhook response:", parseError);
        firstMessage = responseText.trim();
      }
    } else {
      console.error(
        "Failed to send data to Make.com webhook:",
        webhookResponse.statusText
      );
    }
  } catch (error) {
    console.error("Error sending data to Make.com webhook:", error);
  }
  let session = {
    transcript: "",
    streamSid: null,
    callerNumber: callerNumber,
    callDetails: twilioParams,
    firstMessage: firstMessage,
  };
  sessions.set(sessionId, session);
  const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
                          <Response>
                              <Connect>
                                  <Stream url="wss://${request.headers.host}/media-stream">
                                        <Parameter name="firstMessage" value="${firstMessage}" />
                                        <Parameter name="callerNumber" value="${callerNumber}" />
                                  </Stream>
                              </Connect>
                          </Response>`;
  reply.type("text/xml").send(twimlResponse);
});
fastify.register(async (fastify) => {
  fastify.get("/media-stream", { websocket: true }, (connection, req) => {
    console.log("Client connected to media-stream");
    let firstMessage = "";
    let streamSid = "";
    let openAiWsReady = false;
    let queuedFirstMessage = null;
    let threadId = "";
    const sessionId =
      req.headers["x-twilio-call-sid"] || `session_${Date.now()}`;
    let session = sessions.get(sessionId) || {
      transcript: "",
      streamSid: null,
    };
    sessions.set(sessionId, session);
    const callerNumber = session.callerNumber;
    console.log("Caller Number:", callerNumber);
    const openAiWs = new WebSocket(
      "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01",
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "OpenAI-Beta": "realtime=v1",
        },
      }
    );
    const sendSessionUpdate = () => {
      const sessionUpdate = {
        type: "session.update",
        session: {
          turn_detection: { type: "server_vad" },
          input_audio_format: "g711_ulaw",
          output_audio_format: "g711_ulaw",
          voice: VOICE,
          instructions: SYSTEM_MESSAGE,
          modalities: ["text", "audio"],
          temperature: 0.8,
          input_audio_transcription: {
            model: "whisper-1",
          },
          tools: [
            {
              type: "function",
              name: "asking_the_details_of_influencer",
              description:
                "Get the details from the influencer related to promotion",
              parameters: {
                type: "object",
                properties: {
                  details: { type: "string" },
                },
                required: ["question"],
              },
            },
            {
              type: "function",
              name: "negotiation",
              description: "Negotiate the price for our influencer",
              parameters: {
                type: "object",
                properties: {
                  price: { type: "number" },
                },
                required: ["address"],
              },
            },
          ],
          tool_choice: "auto",
        },
      };
      console.log("Sending session update:", JSON.stringify(sessionUpdate));
      openAiWs.send(JSON.stringify(sessionUpdate));
    };
    const sendFirstMessage = () => {
      if (queuedFirstMessage && openAiWsReady) {
        console.log("Sending queued first message:", queuedFirstMessage);
        openAiWs.send(JSON.stringify(queuedFirstMessage));
        openAiWs.send(JSON.stringify({ type: "response.create" }));
        queuedFirstMessage = null;
      }
    };
    openAiWs.on("open", () => {
      console.log("Connected to the OpenAI Realtime API");
      openAiWsReady = true;
      sendSessionUpdate();
      sendFirstMessage();
    });
    connection.on("message", (message) => {
      try {
        const data = JSON.parse(message);
        if (data.event === "start") {
          streamSid = data.start.streamSid;
          const callSid = data.start.callSid;
          const customParameters = data.start.customParameters;
          console.log("CallSid:", callSid);
          console.log("StreamSid:", streamSid);
          console.log("Custom Parameters:", customParameters);
          const callerNumber = customParameters?.callerNumber || "Unknown";
          session.callerNumber = callerNumber;
          firstMessage =
            customParameters?.firstMessage || "Hello, how can I assist you?";
          console.log("First Message:", firstMessage);
          console.log("Caller Number:", callerNumber);
          queuedFirstMessage = {
            type: "conversation.item.create",
            item: {
              type: "message",
              role: "user",
              content: [{ type: "input_text", text: firstMessage }],
            },
          };
          if (openAiWsReady) {
            sendFirstMessage();
          }
        } else if (data.event === "media") {
          if (openAiWs.readyState === WebSocket.OPEN) {
            const audioAppend = {
              type: "input_audio_buffer.append",
              audio: data.media.payload,
            };
            openAiWs.send(JSON.stringify(audioAppend));
          }
        }
      } catch (error) {
        console.error("Error parsing message:", error, "Message:", message);
      }
    });
    openAiWs.on("message", async (data) => {
      try {
        const response = JSON.parse(data);
        if (response.type === "response.audio.delta" && response.delta) {
          connection.send(
            JSON.stringify({
              event: "media",
              streamSid: streamSid,
              media: { payload: response.delta },
            })
          );
        }
        if (response.type === "response.function_call_arguments.done") {
          console.log("Function called:", response);
          const functionName = response.name;
          const args = JSON.parse(response.arguments);
          if (functionName === "question_and_answer") {
            const question = args.question;
            try {
              const webhookResponse = await sendToWebhook({
                route: "3",
                data1: question,
                data2: threadId,
                sid: sessionId,
              });
              console.log("Webhook response:", webhookResponse);
              const parsedResponse = JSON.parse(webhookResponse);
              const answerMessage =
                parsedResponse.message ||
                "I'm sorry, I couldn't find an answer to that question.";
              if (parsedResponse.thread) {
                threadId = parsedResponse.thread;
                console.log("Updated thread ID:", threadId);
              }
              const functionOutputEvent = {
                type: "conversation.item.create",
                item: {
                  type: "function_call_output",
                  role: "system",
                  output: answerMessage,
                },
              };
              openAiWs.send(JSON.stringify(functionOutputEvent));
              openAiWs.send(
                JSON.stringify({
                  type: "response.create",
                  response: {
                    modalities: ["text", "audio"],
                    instructions: `Respond to the user's question "${question}" based on this information: ${answerMessage}. Be concise and friendly.`,
                  },
                })
              );
            } catch (error) {
              console.error("Error processing question:", error);
              sendErrorResponse();
            }
          } else if (functionName === "book_tow") {
            const address = args.address;
            try {
              const webhookResponse = await sendToWebhook({
                route: "4",
                data1: session.callerNumber,
                data2: address,
                sid: sessionId,
              });
              console.log("Webhook response:", webhookResponse);
              const parsedResponse = JSON.parse(webhookResponse);
              const bookingMessage =
                parsedResponse.message ||
                "I'm sorry, I couldn't book the tow service at this time.";
              const functionOutputEvent = {
                type: "conversation.item.create",
                item: {
                  type: "function_call_output",
                  role: "system",
                  output: bookingMessage,
                },
              };
              openAiWs.send(JSON.stringify(functionOutputEvent));
              openAiWs.send(
                JSON.stringify({
                  type: "response.create",
                  response: {
                    modalities: ["text", "audio"],
                    instructions: `Inform the user about the tow booking status: ${bookingMessage}. Be concise and friendly.`,
                  },
                })
              );
            } catch (error) {
              console.error("Error booking tow:", error);
              sendErrorResponse();
            }
          }
        }
        if (response.type === "response.done") {
          const agentMessage =
            response.response.output[0]?.content?.find(
              (content) => content.transcript
            )?.transcript || "Agent message not found";
          session.transcript += `Agent: ${agentMessage}\n`;
          console.log(`Agent (${sessionId}): ${agentMessage}`);
        }
        if (
          response.type ===
            "conversation.item.input_audio_transcription.completed" &&
          response.transcript
        ) {
          const userMessage = response.transcript.trim();
          session.transcript += `User: ${userMessage}\n`;
          console.log(`User (${sessionId}): ${userMessage}`);
        }
        if (LOG_EVENT_TYPES.includes(response.type)) {
          console.log(`Received event: ${response.type}`, response);
        }
      } catch (error) {
        console.error(
          "Error processing OpenAI message:",
          error,
          "Raw message:",
          data
        );
      }
    });
    connection.on("close", async () => {
      if (openAiWs.readyState === WebSocket.OPEN) {
        openAiWs.close();
      }
      console.log(`Client disconnected (${sessionId}).`);
      console.log("Full Transcript:");
      console.log(session.transcript);
      console.log("Final Caller Number:", session.callerNumber);
      await sendToWebhook({
        route: "2",
        data1: session.callerNumber,
        data2: session.transcript,
        sid: sessionId,
      });
      sessions.delete(sessionId);
    });
    openAiWs.on("error", (error) => {
      console.error("Error in the OpenAI WebSocket:", error);
    });
    function sendErrorResponse() {
      openAiWs.send(
        JSON.stringify({
          type: "response.create",
          response: {
            modalities: ["text", "audio"],
            instructions:
              "I apologize, but I'm having trouble processing your request right now. Is there anything else I can help you with?",
          },
        })
      );
    }
  });
});
async function sendToWebhook(payload) {
  console.log("Sending data to webhook:", JSON.stringify(payload, null, 2));
  try {
    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    console.log("Webhook response status:", response.status);
    if (response.ok) {
      const responseText = await response.text();
      console.log("Webhook response:", responseText);
      return responseText;
    } else {
      console.error("Failed to send data to webhook:", response.statusText);
      throw new Error("Webhook request failed");
    }
  } catch (error) {
    console.error("Error sending data to webhook:", error);
    throw error;
  }
}
fastify.listen({ port: PORT }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is listening on port ${PORT}`);
});
