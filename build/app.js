"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("dotenv/config");

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var Sentry = _interopRequireWildcard(require("@sentry/node"));

var _youch = _interopRequireDefault(require("youch"));

require("express-async-errors");

var _routes = _interopRequireDefault(require("./routes"));

var _sentry = _interopRequireDefault(require("./config/sentry"));

require("./database");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class App {
  constructor() {
    this.server = (0, _express.default)();
    Sentry.init(_sentry.default);
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(_express.default.json());
    this.server.use('/files', _express.default.static(_path.default.resolve(__dirname, '..', 'tmp', 'uploads')));
  }

  routes() {
    this.server.use(_routes.default);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new _youch.default(err, req).toJSON();
        return res.status(500).json(errors);
      }

      return res.status(500).json({
        error: 'Internal Server Error, the administrador was notified!'
      });
    });
  }

}

var _default = new App().server;
exports.default = _default;
//# sourceMappingURL=app.js.map