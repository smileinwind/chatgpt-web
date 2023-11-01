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

// src/verify.ts
var require_verify = __commonJS({
  "src/verify.ts"(exports, module) {
    init_esm_shims();
    var corsMiddleware = require_cors();
    module.exports = async (req, res) => {
      corsMiddleware(req, res, async () => {
        try {
          const { token } = req.body;
          if (!token)
            throw new Error("Secret key is empty");
          if (process.env.AUTH_SECRET_KEY !== token)
            throw new Error("\u5BC6\u94A5\u65E0\u6548 | Secret key is invalid");
          res.send({
            status: "Success",
            message: "Verify successfully",
            data: null
          });
        } catch (error) {
          res.send({ status: "Fail", message: error.message, data: null });
        }
      });
    };
  }
});
export default require_verify();
