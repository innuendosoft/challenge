"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("@babel/polyfill");

var _express = require("express");

var _server = _interopRequireDefault(require("../server"));

var _database = require("../database");

var _mongodb = require("mongodb");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var router = (0, _express.Router)();

var multer = require('multer');

var csv = require('fast-csv');

var fs = require('fs'); // Define temporary folder for upload CSV files


var upload = multer({
  dest: 'tmp/csv/'
}); // Process the POST request, including the file field containing the CSV data

router.post('/', upload.single('file'), /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    var fileRows, providerName;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            //Initiate variable that will contain the rows
            fileRows = []; // Store provider id

            providerName = req.body.provider; // Process the CSV file and load each line as an array

            csv.parseFile(req.file.path).on("data", function (data) {
              fileRows.push(data);
            }).on("end", function () {
              //Delete the file after processing
              fs.unlinkSync(req.file.path); //Iterate through the parsed rows 

              fileRows.forEach( /*#__PURE__*/function () {
                var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(dataRow, rowIndex) {
                  var db, result, jsonIns, resultIns;
                  return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          _context2.next = 2;
                          return (0, _database.connect)();

                        case 2:
                          db = _context2.sent;
                          _context2.next = 5;
                          return db.collection('providers_layout').findOne({
                            provider: providerName
                          });

                        case 5:
                          result = _context2.sent;
                          //Initiate the json variable that will contain the data to be insterted 
                          jsonIns = {}; //Loop though each field of the csv line
                          //Associate it to a provider specific column name, if defined

                          dataRow.forEach( /*#__PURE__*/function () {
                            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dataField, index, arr) {
                              return regeneratorRuntime.wrap(function _callee$(_context) {
                                while (1) {
                                  switch (_context.prev = _context.next) {
                                    case 0:
                                      if (typeof result[index] !== 'undefined') {
                                        jsonIns[result[index]] = arr[index];
                                      }

                                    case 1:
                                    case "end":
                                      return _context.stop();
                                  }
                                }
                              }, _callee);
                            }));

                            return function (_x5, _x6, _x7) {
                              return _ref3.apply(this, arguments);
                            };
                          }()); //Do the db insert and automatically add an ID

                          _context2.prev = 8;
                          _context2.next = 11;
                          return db.collection('providers_data').insertOne(jsonIns);

                        case 11:
                          resultIns = _context2.sent;
                          _context2.next = 17;
                          break;

                        case 14:
                          _context2.prev = 14;
                          _context2.t0 = _context2["catch"](8);
                          res.json('Fail');

                        case 17:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2, null, [[8, 14]]);
                }));

                return function (_x3, _x4) {
                  return _ref2.apply(this, arguments);
                };
              }());
              res.json('Success');
            });

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
var _default = router;
exports["default"] = _default;