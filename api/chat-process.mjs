var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/_tsup@6.7.0@tsup/assets/esm_shims.js
var init_esm_shims = __esm({
  "node_modules/_tsup@6.7.0@tsup/assets/esm_shims.js"() {
  }
});

// src/utils/index.ts
function sendResponse(options) {
  if (options.type === "Success") {
    return Promise.resolve({
      message: options.message ?? null,
      data: options.data ?? null,
      status: options.type
    });
  }
  return Promise.reject({
    message: options.message ?? "Failed",
    data: options.data ?? null,
    status: options.type
  });
}
var init_utils = __esm({
  "src/utils/index.ts"() {
    init_esm_shims();
  }
});

// src/utils/is.ts
function isNotEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}
var init_is = __esm({
  "src/utils/is.ts"() {
    init_esm_shims();
  }
});

// src/chatgpt/index.ts
import "isomorphic-fetch";
import { ChatGPTAPI, ChatGPTUnofficialProxyAPI } from "chatgpt";
import { SocksProxyAgent } from "socks-proxy-agent";
import httpsProxyAgent from "https-proxy-agent";
import fetch from "node-fetch";
async function chatReplyProcess(options) {
  const { message, lastContext, process: process2, systemMessage, temperature, top_p } = options;
  try {
    let options2 = { timeoutMs };
    if (apiModel === "ChatGPTAPI") {
      if (isNotEmptyString(systemMessage))
        options2.systemMessage = systemMessage;
      options2.completionParams = { model, temperature, top_p };
    }
    if (lastContext != null) {
      if (apiModel === "ChatGPTAPI")
        options2.parentMessageId = lastContext.parentMessageId;
      else
        options2 = { ...lastContext };
    }
    const response = await api.sendMessage(message, {
      ...options2,
      onProgress: (partialResponse) => {
        process2?.(partialResponse);
      }
    });
    return sendResponse({ type: "Success", data: response });
  } catch (error) {
    const code = error.statusCode;
    global.console.log(error);
    if (Reflect.has(ErrorCodeMessage, code))
      return sendResponse({ type: "Fail", message: ErrorCodeMessage[code] });
    return sendResponse({ type: "Fail", message: error.message ?? "Please check the back-end console" });
  }
}
function setupProxy(options) {
  if (isNotEmptyString(process.env.SOCKS_PROXY_HOST) && isNotEmptyString(process.env.SOCKS_PROXY_PORT)) {
    const agent = new SocksProxyAgent({
      hostname: process.env.SOCKS_PROXY_HOST,
      port: process.env.SOCKS_PROXY_PORT,
      userId: isNotEmptyString(process.env.SOCKS_PROXY_USERNAME) ? process.env.SOCKS_PROXY_USERNAME : void 0,
      password: isNotEmptyString(process.env.SOCKS_PROXY_PASSWORD) ? process.env.SOCKS_PROXY_PASSWORD : void 0
    });
    options.fetch = (url, options2) => {
      return fetch(url, { agent, ...options2 });
    };
  } else if (isNotEmptyString(process.env.HTTPS_PROXY) || isNotEmptyString(process.env.ALL_PROXY)) {
    const httpsProxy = process.env.HTTPS_PROXY || process.env.ALL_PROXY;
    if (httpsProxy) {
      const agent = new HttpsProxyAgent(httpsProxy);
      options.fetch = (url, options2) => {
        return fetch(url, { agent, ...options2 });
      };
    }
  } else {
    options.fetch = (url, options2) => {
      return fetch(url, { ...options2 });
    };
  }
}
var HttpsProxyAgent, ErrorCodeMessage, timeoutMs, disableDebug, apiModel, model, api;
var init_chatgpt = __esm({
  "src/chatgpt/index.ts"() {
    init_esm_shims();
    init_utils();
    init_is();
    ({ HttpsProxyAgent } = httpsProxyAgent);
    ErrorCodeMessage = {
      401: "[OpenAI] \u63D0\u4F9B\u9519\u8BEF\u7684API\u5BC6\u94A5 | Incorrect API key provided",
      403: "[OpenAI] \u670D\u52A1\u5668\u62D2\u7EDD\u8BBF\u95EE\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5 | Server refused to access, please try again later",
      502: "[OpenAI] \u9519\u8BEF\u7684\u7F51\u5173 |  Bad Gateway",
      503: "[OpenAI] \u670D\u52A1\u5668\u7E41\u5FD9\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5 | Server is busy, please try again later",
      504: "[OpenAI] \u7F51\u5173\u8D85\u65F6 | Gateway Time-out",
      500: "[OpenAI] \u670D\u52A1\u5668\u7E41\u5FD9\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5 | Internal Server Error"
    };
    timeoutMs = !isNaN(+process.env.TIMEOUT_MS) ? +process.env.TIMEOUT_MS : 100 * 1e3;
    disableDebug = process.env.OPENAI_API_DISABLE_DEBUG === "true";
    model = isNotEmptyString(process.env.OPENAI_API_MODEL) ? process.env.OPENAI_API_MODEL : "gpt-3.5-turbo";
    if (!isNotEmptyString(process.env.OPENAI_API_KEY) && !isNotEmptyString(process.env.OPENAI_ACCESS_TOKEN))
      throw new Error("Missing OPENAI_API_KEY or OPENAI_ACCESS_TOKEN environment variable");
    (async () => {
      if (isNotEmptyString(process.env.OPENAI_API_KEY)) {
        const OPENAI_API_BASE_URL = process.env.OPENAI_API_BASE_URL;
        const options = {
          apiKey: process.env.OPENAI_API_KEY,
          completionParams: { model },
          debug: !disableDebug
        };
        if (model.toLowerCase().includes("gpt-4")) {
          if (model.toLowerCase().includes("32k")) {
            options.maxModelTokens = 32768;
            options.maxResponseTokens = 8192;
          } else {
            options.maxModelTokens = 8192;
            options.maxResponseTokens = 2048;
          }
        } else if (model.toLowerCase().includes("gpt-3.5")) {
          if (model.toLowerCase().includes("16k")) {
            options.maxModelTokens = 16384;
            options.maxResponseTokens = 4096;
          }
        }
        if (isNotEmptyString(OPENAI_API_BASE_URL))
          options.apiBaseUrl = `${OPENAI_API_BASE_URL}/v1`;
        setupProxy(options);
        api = new ChatGPTAPI({ ...options });
        apiModel = "ChatGPTAPI";
      } else {
        const options = {
          accessToken: process.env.OPENAI_ACCESS_TOKEN,
          apiReverseProxyUrl: isNotEmptyString(process.env.API_REVERSE_PROXY) ? process.env.API_REVERSE_PROXY : "https://ai.fakeopen.com/api/conversation",
          model,
          debug: !disableDebug
        };
        setupProxy(options);
        api = new ChatGPTUnofficialProxyAPI({ ...options });
        apiModel = "ChatGPTUnofficialProxyAPI";
      }
    })();
  }
});

// src/cors.ts
var require_cors = __commonJS({
  "src/cors.ts"(exports, module) {
    init_esm_shims();
    module.exports = (req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "authorization,Content-Type");
      if (req.method === "OPTIONS") {
        res.status(200).end();
      } else {
        next();
      }
    };
  }
});

// src/chat-process.ts
var require_chat_process = __commonJS({
  "src/chat-process.ts"(exports, module) {
    init_esm_shims();
    init_chatgpt();
    var corsMiddleware = require_cors();
    module.exports = async (req, res) => {
      corsMiddleware(req, res, async () => {
        res.setHeader("Content-type", "application/octet-stream");
        try {
          const {
            prompt,
            options = {},
            systemMessage,
            temperature,
            top_p
          } = req.body;
          let firstChunk = true;
          await chatReplyProcess({
            message: prompt,
            lastContext: options,
            process: (chat) => {
              res.write(
                firstChunk ? JSON.stringify(chat) : `
${JSON.stringify(chat)}`
              );
              firstChunk = false;
            },
            systemMessage,
            temperature,
            top_p
          });
        } catch (error) {
          res.write(JSON.stringify(error));
        } finally {
          res.end();
        }
      });
    };
  }
});
export default require_chat_process();
