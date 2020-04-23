"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _File = _interopRequireDefault(require("../models/File"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FileController {
  async store(req, res) {
    const {
      originalname: name,
      filename: path
    } = req.file;
    const file = await _File.default.create({
      name,
      path
    });
    return res.json(file);
  }

}

var _default = new FileController();

exports.default = _default;
//# sourceMappingURL=FileController.js.map