'use strict';

var response = exports; exports.constructor = function response(){};

var _ = require('lodash');
var TextResponse = require('./text').TextResponse;

var badDeveloper = 'CommandKindResponse not exposed';

/**
 * Take the provided result and determine if a customer object
 * type exists, return that object otherwise a TextResponse
 *
 * @param {object} result
 */
response.identifyAndExtend = function(result) {
  var commandKind = result.CommandKind;

  // Try and load custom response type
  var ResponseType;
  try {

    var cmd = commandKind.replace(/Command$/, '');
    var lowerCmd = cmd.toLowerCase();
    ResponseType = require('./' + lowerCmd)[cmd + 'Response'];

    // Developer error, module exists but function not exposed
    if (_.isUndefined(ResponseType)) {
      throw new Error(badDeveloper);
    }

  // Default to TextResponse when CommandKind is not found
  } catch(err) {
    if (err.message === badDeveloper) {
      throw err;
    }

    ResponseType = TextResponse;
  }

  return new ResponseType({
    raw: result
  });
};
