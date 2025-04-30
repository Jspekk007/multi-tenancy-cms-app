/*!
 * jQuery JavaScript Library v1.9.0
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2012 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-01-15
 */

// Minimal content just to have something in the file for testing Retire.js detection.
// This does NOT represent functional jQuery code.
function $() {
  console.warn(
    'This is a minimal test file for Retire.js, not functional jQuery 1.9.0'
  )
  return { jquery: '1.9.0' } // Add version property which some scanners might check
}
$.fn = { jquery: '1.9.0' } // Mimic how jQuery exposes version

console.log('Minimal jQuery 1.9.0 test file loaded.')
