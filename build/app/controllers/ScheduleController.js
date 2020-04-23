"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dateFns = require("date-fns");

var _sequelize = require("sequelize");

var _Appointment = _interopRequireDefault(require("../models/Appointment"));

var _User = _interopRequireDefault(require("../models/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ScheduleController {
  async index(req, res) {
    const checkUserProvider = await _User.default.findOne({
      where: {
        id: req.userId,
        provider: true
      }
    });

    if (!checkUserProvider) {
      return res.status(401).json({
        error: 'User is not a provider'
      });
    }

    const {
      date
    } = req.query;
    const parsedDate = (0, _dateFns.parseISO)(date);
    const appointments = await _Appointment.default.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [_sequelize.Op.between]: [(0, _dateFns.startOfDay)(parsedDate), (0, _dateFns.endOfDay)(parsedDate)]
        }
      },
      order: ['date']
    });
    return res.json(appointments);
  }

}

var _default = new ScheduleController();

exports.default = _default;
//# sourceMappingURL=ScheduleController.js.map