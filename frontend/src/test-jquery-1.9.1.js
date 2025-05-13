/*! jQuery v1.9.1 | (c) 2005, 2012 jQuery Foundation, Inc. | jquery.org/license */

// This is a minimal test file to simulate the presence of jQuery 1.9.1
// for RetireJS scanning. RetireJS typically looks for the version banner
// above and/or specific code patterns.

// Defining a jQuery-like object and the version property that RetireJS might scan for.
(function(window) {
    // Simulate the global jQuery object or a similar structure
    // that might be checked by version scanners.
    var $ = window.jQuery = window.$ || {};

    // Explicitly set the version string that RetireJS looks for.
    if ($.fn) {
        $.fn.jquery = '1.9.1';
    } else {
        $.fn = { jquery: '1.9.1' };
    }

    // A simple log to show this script has "run" if you were to include it in an HTML page.
    if (typeof console !== 'undefined') {
        console.log('RetireJS test script for jQuery 1.9.1 loaded. Version set to: ' + $.fn.jquery);
    }

})(typeof window !== 'undefined' ? window : this);

// RetireJS should identify this file as containing markers for jQuery 1.9.1,
// which is a version known to have vulnerabilities such as:
// - CVE-2020-11022 (XSS)
// - CVE-2020-11023 (XSS)
// - CVE-2019-11358 (Prototype Pollution)
// - CVE-2015-9251 (XSS)