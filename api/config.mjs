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
async function fetchUsage() {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const OPENAI_API_BASE_URL = process.env.OPENAI_API_BASE_URL;
  if (!isNotEmptyString(OPENAI_API_KEY))
    return Promise.resolve("-");
  const API_BASE_URL = isNotEmptyString(OPENAI_API_BASE_URL) ? OPENAI_API_BASE_URL : "https://api.openai.com";
  const [startDate, endDate] = formatDate();
  const urlUsage = `${API_BASE_URL}/v1/dashboard/billing/usage?start_date=${startDate}&end_date=${endDate}`;
  const headers = {
    "Authorization": `Bearer ${OPENAI_API_KEY}`,
    "Content-Type": "application/json"
  };
  const options = {};
  setupProxy(options);
  try {
    const useResponse = await options.fetch(urlUsage, { headers });
    if (!useResponse.ok)
      throw new Error("\u83B7\u53D6\u4F7F\u7528\u91CF\u5931\u8D25");
    const usageData = await useResponse.json();
    const usage = Math.round(usageData.total_usage) / 100;
    return Promise.resolve(usage ? `$${usage}` : "-");
  } catch (error) {
    global.console.log(error);
    return Promise.resolve("-");
  }
}
function formatDate() {
  const today = /* @__PURE__ */ new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const lastDay = new Date(year, month, 0);
  const formattedFirstDay = `${year}-${month.toString().padStart(2, "0")}-01`;
  const formattedLastDay = `${year}-${month.toString().padStart(2, "0")}-${lastDay.getDate().toString().padStart(2, "0")}`;
  return [formattedFirstDay, formattedLastDay];
}
async function chatConfig() {
  const usage = await fetchUsage();
  const reverseProxy = process.env.API_REVERSE_PROXY ?? "-";
  const httpsProxy = (process.env.HTTPS_PROXY || process.env.ALL_PROXY) ?? "-";
  const socksProxy = process.env.SOCKS_PROXY_HOST && process.env.SOCKS_PROXY_PORT ? `${process.env.SOCKS_PROXY_HOST}:${process.env.SOCKS_PROXY_PORT}` : "-";
  return sendResponse({
    type: "Success",
    data: { apiModel, reverseProxy, timeoutMs, socksProxy, httpsProxy, usage }
  });
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
var HttpsProxyAgent, timeoutMs, disableDebug, apiModel, model, api;
var init_chatgpt = __esm({
  "src/chatgpt/index.ts"() {
    init_esm_shims();
    init_utils();
    init_is();
    ({ HttpsProxyAgent } = httpsProxyAgent);
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

// src/config.ts
var require_config = __commonJS({
  "src/config.ts"(exports, module) {
    init_esm_shims();
    init_chatgpt();
    var corsMiddleware = require_cors();
    module.exports = async (req, res) => {
      corsMiddleware(req, res, async () => {
        try {
          const response = await chatConfig();
          res.send(response);
        } catch (error) {
          res.send(error);
        }
      });
    };
  }
});
export default require_config();
