"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNoteFromMidiNumber = exports.chord2midi = exports.generate = exports.numberOfBarres = exports.unique = exports.processString = exports.strChord2array = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var strChord2array = function strChord2array(str) {
  return str.split('').map(function (_char) {
    return _char.toLowerCase() === 'x' ? -1 : parseInt(_char, 16);
  });
};

exports.strChord2array = strChord2array;

var processString = function processString(strings) {
  return Array.isArray(strings) ? strings : strChord2array(strings);
};

exports.processString = processString;

var processbaseFret = function processbaseFret(frets) {
  return Math.max.apply(Math, _toConsumableArray(frets)) > 4 ? Math.min.apply(Math, _toConsumableArray(frets.filter(function (f) {
    return f > 0;
  }))) : 1;
};

var processBarres = function processBarres(barres, baseFret) {
  return barres ? (Array.isArray(barres) ? barres : [barres]).map(function (barre) {
    return baseFret > 1 ? barre - baseFret + 1 : barre;
  }) : [];
};

var processFrets = function processFrets(frets, baseFret) {
  return frets.map(function (fret) {
    return baseFret > 1 ? fret > 0 ? fret - baseFret + 1 : fret : fret;
  });
};

var processFingers = function processFingers(fingers) {
  return fingers ? processString(fingers) : [];
};

var processPosition = function processPosition(position, tuning) {
  var frets = processString(position.frets);
  var baseFret = processbaseFret(frets);
  Object.assign(position, {
    baseFret: processbaseFret(frets),
    barres: processBarres(position.barres, baseFret),
    fingers: processFingers(position.fingers),
    frets: processFrets(frets, baseFret),
    midi: chord2midi(frets, tuning)
  });
};

var unique = function unique(arr) {
  return arr.filter(function (elem, pos, a) {
    return a.indexOf(elem) === pos;
  });
};

exports.unique = unique;

var numberOfBarres = function numberOfBarres(str) {
  return unique(str.split('')).map(function (chr) {
    return str.match(new RegExp(chr, 'gi')) && parseInt(chr, 10) > 0 && str.match(new RegExp(chr, 'gi')).length > 1 ? 1 : 0;
  }).reduce(function (last, actual) {
    return actual + last;
  }, 0);
};

exports.numberOfBarres = numberOfBarres;

var processPositions = function processPositions(positions, tuning) {
  return positions.map(function (position) {
    return processPosition(position, tuning);
  });
};

var processChord = function processChord(suffixes, tuning) {
  return suffixes.map(function (suffix) {
    return Object.assign(suffix, processPositions(suffix.positions, tuning));
  });
};

var processChords = function processChords(chords, tuning) {
  return Object.assign.apply(Object, _toConsumableArray(Object.keys(chords).map(function (chord) {
    return Object.assign({}, _defineProperty({}, chord, processChord(chords[chord], tuning)));
  })));
};

var generate = function generate(instrument) {
  var tuning = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'standard';
  return Object.assign(instrument, {
    chords: processChords(instrument.chords, instrument.tunings[tuning])
  });
};

exports.generate = generate;
var midiNumbers = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

var midiNote = function midiNote(note) {
  return (parseInt(note[1], 10) + 1) * 12 + midiNumbers.indexOf(note[0]);
};

var string2midi = function string2midi(fret, string, tuning) {
  return fret >= 0 ? midiNote(tuning[string]) + fret : -1;
};

var chord2midi = function chord2midi(frets, tuning) {
  return frets.map(function (fret, string) {
    return string2midi(fret, string, tuning);
  }).filter(function (note) {
    return note > 0;
  });
};

exports.chord2midi = chord2midi;

var getNoteFromMidiNumber = function getNoteFromMidiNumber(number) {
  return midiNumbers[number % 12];
};

exports.getNoteFromMidiNumber = getNoteFromMidiNumber;