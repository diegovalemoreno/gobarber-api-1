"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _multer = _interopRequireDefault(require("multer"));

var _UserController = _interopRequireDefault(require("./app/controllers/UserController"));

var _SessionController = _interopRequireDefault(require("./app/controllers/SessionController"));

var _FileController = _interopRequireDefault(require("./app/controllers/FileController"));

var _ProviderController = _interopRequireDefault(require("./app/controllers/ProviderController"));

var _AppointmentController = _interopRequireDefault(require("./app/controllers/AppointmentController"));

var _AvailableController = _interopRequireDefault(require("./app/controllers/AvailableController"));

var _ScheduleController = _interopRequireDefault(require("./app/controllers/ScheduleController"));

var _NotificationController = _interopRequireDefault(require("./app/controllers/NotificationController"));

var _auth = _interopRequireDefault(require("./app/middlewares/auth"));

var _multer2 = _interopRequireDefault(require("./config/multer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import swaggerUi from 'swagger-ui-express';
// import swaggerDocument from './swagger.json';
const routes = new _express.Router();
const upload = (0, _multer.default)(_multer2.default); // routes.use('/api-docs', swaggerUi.serve);
// routes.get('/api-docs', swaggerUi.setup(swaggerDocument));

routes.post('/users', _UserController.default.store);
routes.post('/sessions', _SessionController.default.store); // Todas as rotas que forem chamadas a partir daqui tem que ser autenticada

routes.use(_auth.default);
routes.put('/users', _UserController.default.update);
routes.get('/providers', _ProviderController.default.index);
routes.get('/providers/:providerId/available', _AvailableController.default.index);
routes.post('/appointments', _AppointmentController.default.store);
routes.get('/appointments', _AppointmentController.default.index);
routes.delete('/appointments/:id', _AppointmentController.default.delete);
routes.get('/schedule', _ScheduleController.default.index);
routes.get('/notifications', _NotificationController.default.index);
routes.put('/notifications/:id', _NotificationController.default.update);
routes.post('/files', upload.single('file'), _FileController.default.store);
var _default = routes;
exports.default = _default;
//# sourceMappingURL=routes.js.map