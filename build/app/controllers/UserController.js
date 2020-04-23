"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var Yup = _interopRequireWildcard(require("yup"));

var _User = _interopRequireDefault(require("../models/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6)
    });
    console.log(req.body);

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails'
      });
    }

    const userExists = await _User.default.findOne({
      where: {
        email: req.body.email
      }
    });

    if (userExists) {
      return res.status(400).json({
        error: 'User already exists.'
      });
    }

    const {
      id,
      name,
      email,
      provider
    } = await _User.default.create(req.body);
    return res.json({
      id,
      name,
      email,
      provider
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string().min(6).when('oldPassword', (oldPassword, field) => oldPassword ? field.required() : field),
      confirmPassword: Yup.string().when('password', (password, field) => password ? field.required().oneOf([Yup.ref('password')]) : field)
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails'
      });
    }

    const {
      email,
      oldPassword
    } = req.body;
    const user = await _User.default.findByPk(req.userId);

    if (user.email !== email) {
      const userExists = await _User.default.findOne({
        where: {
          email
        }
      });

      if (userExists) {
        return res.status(400).json({
          error: 'User already exists.'
        });
      }
    } // só faço isso se ele informou a senha antiga, isto é, quer alterar a senha


    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({
        error: 'Password does not match.'
      });
    }

    const {
      id,
      name,
      provider
    } = await user.update(req.body);
    return res.json({
      id,
      name,
      email,
      provider
    });
  }

}

var _default = new UserController();

exports.default = _default;
//# sourceMappingURL=UserController.js.map