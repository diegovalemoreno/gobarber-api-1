"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _User = _interopRequireDefault(require("../models/User"));

var _File = _interopRequireDefault(require("../models/File"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ProviderController {
  async index(req, res) {
    const providers = await _User.default.findAll({
      where: {
        provider: true
      },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [{
        model: _File.default,
        as: 'avatar',
        attributes: ['name', 'path', 'url']
      }]
    });
    return res.json(providers);
  }

}

var _default = new ProviderController();

exports.default = _default;
//# sourceMappingURL=ProviderController.js.map