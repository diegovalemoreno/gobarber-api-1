"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var Yup = _interopRequireWildcard(require("yup"));

var _dateFns = require("date-fns");

var _pt = _interopRequireDefault(require("date-fns/locale/pt"));

var _Appointment = _interopRequireDefault(require("../models/Appointment"));

var _User = _interopRequireDefault(require("../models/User"));

var _File = _interopRequireDefault(require("../models/File"));

var _Notification = _interopRequireDefault(require("../schemas/Notification"));

var _CancellationMail = _interopRequireDefault(require("../jobs/CancellationMail"));

var _Queue = _interopRequireDefault(require("../../lib/Queue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class AppointmentController {
  async index(req, res) {
    const {
      page = 1
    } = req.query;
    const appointments = await _Appointment.default.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null
      },
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'date', 'past', 'cancelable'],
      include: [{
        model: _User.default,
        as: 'provider',
        attributes: ['id', 'name'],
        include: [{
          model: _File.default,
          as: 'avatar',
          attributes: ['id', 'path', 'url']
        }]
      }]
    });
    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Valiation fails'
      });
    }

    const {
      provider_id,
      date
    } = req.body;
    /**
     * Provider can't create appointment for itself
     */

    if (provider_id === req.userId) {
      return res.status(401).json({
        error: 'You can not create appointments for yourself'
      });
    }
    /**
     * Check if provider_id is a provider
     */


    const checkIsProvider = await _User.default.findOne({
      where: {
        id: provider_id,
        provider: true
      }
    });

    if (!checkIsProvider) {
      return res.status(401).json({
        error: 'You can only create appointments with providers'
      });
    }

    const hourStart = (0, _dateFns.startOfHour)((0, _dateFns.parseISO)(date));
    /**
     * Check for past dates
     */

    if ((0, _dateFns.isBefore)(hourStart, new Date())) {
      return res.status(400).json({
        error: 'Past date are not permitted'
      });
    }
    /**
     * Check date availabity
     */


    const checkAvailabitity = await _Appointment.default.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart
      }
    });

    if (checkAvailabitity) {
      return res.status(400).json({
        error: 'Appointment date is not available'
      });
    }

    const appointment = await _Appointment.default.create({
      user_id: req.userId,
      provider_id,
      date
    });
    /**
     * Notify appointment provider
     */

    const user = await _User.default.findByPk(req.userId);
    const formattedDate = (0, _dateFns.format)(hourStart, "'dia' dd 'de' MMMM', às' H:mm'h'", {
      locale: _pt.default
    });
    await _Notification.default.create({
      content: `Novo agendamento de ${user.name} para o ${formattedDate}`,
      user: provider_id
    });
    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await _Appointment.default.findByPk(req.params.id, {
      include: [{
        model: _User.default,
        as: 'provider',
        attributes: ['name', 'email']
      }, {
        model: _User.default,
        as: 'user',
        attributes: ['name']
      }]
    });

    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't have permission to cancel this appointment."
      });
    } // removo duas horas da data agendada


    const dateWithSub = (0, _dateFns.subHours)(appointment.date, 2);
    const NOW = new Date();

    if ((0, _dateFns.isBefore)(dateWithSub, NOW)) {
      return res.status(401).json({
        error: 'You can only cancel appointment 2 hours in advance.'
      });
    }

    appointment.canceled_at = NOW;
    await appointment.save();
    await _Queue.default.add(_CancellationMail.default.key, {
      appointment
    });
    return res.json(appointment);
  }

}

var _default = new AppointmentController();

exports.default = _default;
//# sourceMappingURL=AppointmentController.js.map