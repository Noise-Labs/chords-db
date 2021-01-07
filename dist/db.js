"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _guitar = _interopRequireDefault(require("./db/guitar"));

var _ukulele = _interopRequireDefault(require("./db/ukulele"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  guitar: _guitar["default"],
  ukulele: _ukulele["default"]
};
exports["default"] = _default;