"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dateFns = require("date-fns");

var _sequelize = require("sequelize");

var _Appointment = _interopRequireDefault(require("../models/Appointment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AvailableController {
  async index(req, res) {
    const {
      date
    } = req.query;

    if (!date) {
      return res.status(400).json({
        error: 'Invalid date'
      });
    }

    const searchDate = Number(date); // 2019-09-18 10:49:44

    const appointments = await _Appointment.default.findAll({
      where: {
        provider_id: req.params.providerId,
        canceled_at: null,
        date: {
          [_sequelize.Op.between]: [(0, _dateFns.startOfDay)(searchDate), (0, _dateFns.endOfDay)(searchDate)]
        }
      }
    });
    const schedule = ['08:00', // 2019-09-18 08:00:00
    '09:00', // 2019-09-18 09:00:00
    '10:00', // 2019-09-18 10:00:00
    '11:00', // ...
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
    const available = schedule.map(time => {
      const [hour, minute] = time.split(':');
      const value = (0, _dateFns.setSeconds)((0, _dateFns.setMinutes)((0, _dateFns.setHours)(searchDate, hour), minute), 0);
      return {
        time,
        // format to: 2019-09-18T15:40:44-04:00
        value: (0, _dateFns.format)(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available: (0, _dateFns.isAfter)(value, new Date()) && !appointments.find(a => (0, _dateFns.format)(a.date, 'HH:mm') === time)
      };
    });
    return res.json(available);
  }

}

var _default = new AvailableController();

exports.default = _default;
//# sourceMappingURL=AvailableController.js.map