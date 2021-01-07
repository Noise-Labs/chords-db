"use strict";

var _guitar = _interopRequireDefault(require("./guitar"));

var _tools = require("../tools");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

describe('Guitar Chords', function () {
  describe('Strings', function () {
    it('Should have 6 strings', function () {
      return expect(_guitar["default"].main.strings).toEqual(6);
    });
  });
  describe('Types', function () {
    _guitar["default"].suffixes.map(function (suffix) {
      return it("Type suffix ".concat(suffix, " should have a description"), function () {
        return expect(suffix).toBeDefined();
      });
    });
  });
  describe("Test Cmajor midi notes", function () {
    it("Should match [ 48, 52, 55, 60, 64 ]", function () {
      var Cmajor = _guitar["default"].chords.C.find(function (chord) {
        return chord.suffix === 'major';
      });

      var midiNotes = (0, _tools.chord2midi)((0, _tools.processString)(Cmajor.positions[0].frets), _guitar["default"].tunings['standard']);
      var CmajorNotes = [48, 52, 55, 60, 64];
      expect(JSON.stringify(midiNotes)).toEqual(JSON.stringify(CmajorNotes));
    });
  });
  Object.keys(_guitar["default"].chords).map(function (key) {
    return describe("Key ".concat(key.replace('sharp', '#')), function () {
      var chords = _guitar["default"].chords[key];
      it("Should not have duplicated suffixes", function () {
        var seen = new Set();
        var duplicates = chords.some(function (chord) {
          return seen.size === seen.add(chord.suffix).size;
        });
        expect(duplicates).toBe(false);
      });
      chords.map(function (chord) {
        return describe("Suffix ".concat(chord.key).concat(chord.suffix), function () {
          describe('General properties', function () {
            it("The chord ".concat(key).concat(chord.suffix, " should have a defined key property"), function () {
              return expect(chord.key).toEqual(key.replace('sharp', '#'));
            });
            it("The chord ".concat(key).concat(chord.suffix, " should have a defined suffix property"), function () {
              return expect(chord.suffix).toBeDefined();
            });
            it("The chord ".concat(key).concat(chord.suffix, " should have a list of positions"), function () {
              return expect(chord.positions).toBeInstanceOf(Array);
            });
          });
          describe("Positions", function () {
            chord.positions.map(function (position, index) {
              var frets = Array.isArray(position.frets) ? position.frets : (0, _tools.strChord2array)(position.frets);
              var effectiveFrets = frets.filter(function (f) {
                return f > 0;
              });
              describe("Frets", function () {
                it("The ".concat(index + 1, " position frets array should have 6 values"), function () {
                  return expect(frets.length).toEqual(6);
                });
                it("The ".concat(index + 1, " position frets array should have values lower than 16"), function () {
                  return expect(Math.max.apply(Math, _toConsumableArray(frets))).toBeLessThan(16);
                });
                it("The ".concat(index + 1, " position frets array should have at most 4 fingers of distance"), function () {
                  return expect(Math.max.apply(Math, _toConsumableArray(effectiveFrets)) - Math.min.apply(Math, _toConsumableArray(effectiveFrets))).toBeLessThanOrEqual(_guitar["default"].main.fretsOnChord);
                });
              });

              if (position.fingers) {
                describe("Fingers", function () {
                  var fingers = Array.isArray(position.fingers) ? position.fingers : (0, _tools.strChord2array)(position.fingers);
                  it("The ".concat(index + 1, " position fingers array should have 6 values"), function () {
                    return expect(fingers.length).toEqual(6);
                  });
                  it("The ".concat(index + 1, " position fingers array should have values lower than 5"), function () {
                    return expect(Math.max.apply(Math, _toConsumableArray(fingers))).toBeLessThan(5);
                  });
                  it("The ".concat(index + 1, " position fingers array should have values higher or equal to 0"), function () {
                    return expect(Math.min.apply(Math, _toConsumableArray(fingers))).toBeGreaterThanOrEqual(0);
                  });
                });
              }

              if (position.barres) {
                describe("Barres", function () {
                  var barres = Array.isArray(position.barres) ? position.barres : [position.barres];
                  barres.map(function (barre) {
                    it("The position ".concat(index + 1, ", barre ").concat(barre, " should have frets"), function () {
                      return expect(frets.indexOf(barre)).not.toEqual(-1);
                    });
                    it("The position ".concat(index + 1, ", barre ").concat(barre, " should have two strings at least"), function () {
                      return expect(frets.indexOf(barre)).not.toEqual(frets.lastIndexOf(barre));
                    });
                  });
                });
              }
            });
          });
        });
      });
    });
  });
});