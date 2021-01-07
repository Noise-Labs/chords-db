"use strict";

var _tools = require("./tools");

var _db = _interopRequireDefault(require("./db"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var createDirIfNeeded = function createDirIfNeeded() {
  return _fs["default"].existsSync(_path["default"].join(__dirname, '..', 'lib')) || _fs["default"].mkdirSync(_path["default"].join(__dirname, '..', 'lib'));
};

var generateJSON = function generateJSON(instrument) {
  return _fs["default"].writeFileSync(_path["default"].join(__dirname, '..', 'lib', "".concat(instrument, ".json")), JSON.stringify((0, _tools.generate)(_db["default"][instrument])));
};

var prettyObjectToJSON = function prettyObjectToJSON(obj) {
  return JSON.stringify(obj, null, 4);
};

var getInstrumentsDB = function getInstrumentsDB() {
  return Object.assign.apply(Object, _toConsumableArray(Object.keys(_db["default"]).map(function (instrument) {
    return _defineProperty({}, instrument, (0, _tools.generate)(_db["default"][instrument]));
  })));
};

var getNumberOfPositions = function getNumberOfPositions(suffixes) {
  return suffixes.reduce(function (sum, suffix) {
    return sum + suffix.positions.length;
  }, 0);
};

var getNumberOfChords = function getNumberOfChords(chords) {
  return Object.keys(chords).reduce(function (sum, key) {
    return sum + getNumberOfPositions(chords[key]);
  }, 0);
};

var generateIndex = function generateIndex(db) {
  _fs["default"].writeFileSync(_path["default"].join(__dirname, '..', 'lib', "instruments.json"), JSON.stringify(Object.assign.apply(Object, _toConsumableArray(Object.keys(db).map(function (instrument) {
    return _defineProperty({}, instrument, Object.assign(db[instrument].main, {
      numberOfChords: getNumberOfChords(db[instrument].chords)
    }));
  })))));

  return true;
};

var processCommand = function processCommand(json) {
  return json ? createDirIfNeeded() && generateIndex(_db["default"]) && Object.keys(_db["default"]).map(function (instrument) {
    return generateJSON(instrument);
  }) : console.log(prettyObjectToJSON(getInstrumentsDB()));
};

var json = process.argv.length > 2 && process.argv[2] === 'json';
processCommand(json);