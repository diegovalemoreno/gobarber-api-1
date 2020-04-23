"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _User = _interopRequireDefault(require("../app/models/User"));

var _File = _interopRequireDefault(require("../app/models/File"));

var _Appointment = _interopRequireDefault(require("../app/models/Appointment"));

var _database = _interopRequireDefault(require("../config/database"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const models = [_User.default, _File.default, _Appointment.default];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new _sequelize.default(_database.default);
    models.map(model => model.init(this.connection)).map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = _mongoose.default.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
  }

}

var _default = new Database();

exports.default = _default;
//# sourceMappingURL=index.js.map