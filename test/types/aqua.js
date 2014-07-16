/**
 * Type definition for AQUA.
 *
 * @externs
 * @author Daniel Lamb <dlamb.open.source@gmail.com>
 */



/**
 * AQUA: Automated QUality Analysis public API
 * @constructor
 * @nosideeffects
 */
var AQUA = function() { };


/**
 * Available AQUA tasks
 * @type {Object}
 */
AQUA.prototype.tasks = null;


/**
 * AQUA configuration
 * @type {AquaConfig}
 */
AQUA.prototype.cfg = null;


/**
 * Handle errors in a consistent way.
 * @param {...*} var_args
 */
AQUA.prototype.error = function(var_args) { };


/**
 * Configure AQUA
 * @param {AquaConfig} cfg - configure AQUA
 */
AQUA.prototype.config = function(cfg) { };


/**
 * Take the project config files and generate gulp tasks for them
 * @param {Array.<Object>} cfgs - Array of AQUA project configurations
 */
AQUA.prototype.init = function(cfgs) { };


/**
 * Log information to the console.
 * @param {*} data
 * @param {...*} var_args
 */
AQUA.prototype.log = function(data, var_args) { };


/**
 * Logger instance
 * @type {Object}
 */
AQUA.prototype.logger = null;


/**
 * Util instance
 * @type {Object}
 */
AQUA.prototype.util = null;


/**
 * Validate a AQUA configuration file.
 * @param {AquaConfig} cfg
 */
AQUA.prototype.validate = function(cfg) { };


/**
 * Log information to the console as a yellow warning.
 * @param {*} data
 * @param {...*} var_args
 */
AQUA.prototype.warn = function(data, var_args) { };


/**
 * Console Colors (NPM module)
 * @type {Colors} */
AQUA.prototype.colors = null;


/**
 * Dynamic list of available AQUA projects
 * @type {Object}
 */
AQUA.prototype.projects = null;
