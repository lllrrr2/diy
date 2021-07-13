// SPDX-License-Identifier: GPL-3.0-or-later

// 不编辑：此文件是从src中的源文件自动生成的/

// ----------------------------------------------------------------------------
// 可以在加载此脚本之前设置以下变量:

// '严格使用';

/*global netdataNoDygraphs           *//* boolean,  disable dygraph charts
 *                                                  (default: false) */
/*global netdataNoSparklines         *//* boolean,  disable sparkline charts
 *                                                  (default: false) */
/*global netdataNoPeitys             *//* boolean,  disable peity charts
 *                                                  (default: false) */
/*global netdataNoGoogleCharts       *//* boolean,  disable google charts
 *                                                  (default: false) */
/*global netdataNoMorris             *//* boolean,  disable morris charts
 *                                                  (default: false) */
/*global netdataNoEasyPieChart       *//* boolean,  disable easypiechart charts
 *                                                  (default: false) */
/*global netdataNoGauge              *//* boolean,  disable gauge.js charts
 *                                                  (default: false) */
/*global netdataNoD3                 *//* boolean,  disable d3 charts
 *                                                  (default: false) */
/*global netdataNoC3                 *//* boolean,  disable c3 charts
 *                                                  (default: false) */
/*global netdataNoD3pie              *//* boolean,  disable d3pie charts
 *                                                  (default: false) */
/*global netdataNoBootstrap          *//* boolean,  disable bootstrap - disables help too
 *                                                  (default: false) */
/*global netdataNoFontAwesome        *//* boolean,  disable fontawesome (do not load it)
 *                                                  (default: false) */
/*global netdataIcons                *//* object,   overwrite netdata fontawesome icons
 *                                                  (default: null) */
/*global netdataDontStart            *//* boolean,  do not start the thread to process the charts
 *                                                  (default: false) */
/*global netdataErrorCallback        *//* function, callback to be called when the dashboard encounters an error
 *                                                  (default: null) */
/*global netdataRegistry:true        *//* boolean,  use the netdata registry
 *                                                  (default: false) */
/*global netdataNoRegistry           *//* boolean,  included only for compatibility with existing custom dashboard
 *                                                  (obsolete - do not use this any more) */
/*global netdataRegistryCallback     *//* function, callback that will be invoked with one param: the URLs from the registry
 *                                                  (default: null) */
/*global netdataShowHelp:true        *//* boolean,  disable charts help
 *                                                  (default: true) */
/*global netdataShowAlarms:true      *//* boolean,  enable alarms checks and notifications
 *                                                  (default: false) */
/*global netdataRegistryAfterMs:true *//* ms,       delay registry use at started
 *                                                  (default: 1500) */
/*global netdataCallback             *//* function, callback to be called when netdata is ready to start
 *                                                  (default: null)
 *                                                  netdata will be running while this is called
 *                                                  (call NETDATA.pause to stop it) */
/*global netdataPrepCallback         *//* function, callback to be called before netdata does anything else
 *                                                  (default: null) */
/*global netdataServer               *//* string,   the URL of the netdata server to use
 *                                                  (default: the URL the page is hosted at) */
/*global netdataServerStatic         *//* string,   the URL of the netdata server to use for static files
 *                                                  (default: netdataServer) */
/*global netdataSnapshotData         *//* object,   a netdata snapshot loaded
 *                                                  (default: null) */
/*global netdataAlarmsRecipients     *//* array,    an array of alarm recipients to show notifications for
 *                                                  (default: null) */
/*global netdataAlarmsRemember       *//* boolen,   keep our position in the alarm log at browser local storage
 *                                                  (default: true) */
/*global netdataAlarmsActiveCallback *//* function, a hook for the alarm logs
 *                                                  (default: undefined) */
/*global netdataAlarmsNotifCallback  *//* function, a hook for alarm notifications
 *                                                  (default: undefined) */
/*global netdataIntersectionObserver *//* boolean,  enable or disable the use of intersection observer
 *                                                  (default: true) */
/*global netdataCheckXSS             *//* boolean,  enable or disable checking for XSS issues
 *                                                  (default: false) */

// ----------------------------------------------------------------------------
// 全局名字空间

// Should stay var!
var NETDATA = window.NETDATA || {};

(function(window, document, $, undefined) {

// *** src/dashboard.js/utils.js

NETDATA.name2id = function (s) {
    return s
        .replace(/ /g, '_')
        .replace(/:/g, '_')
        .replace(/\(/g, '_')
        .replace(/\)/g, '_')
        .replace(/\./g, '_')
        .replace(/\//g, '_');
};

NETDATA.encodeURIComponent = function (s) {
    if (typeof(s) === 'string') {
        return encodeURIComponent(s);
    }

    return s;
};

/// A heuristic for detecting slow devices.
let isSlowDeviceResult = undefined;
const isSlowDevice = function () {
    if (!isSlowDeviceResult) {
        return isSlowDeviceResult;
    }

    try {
        let ua = navigator.userAgent.toLowerCase();

        let iOS = /ipad|iphone|ipod/.test(ua) && !window.MSStream;
        let android = /android/.test(ua) && !window.MSStream;
        isSlowDeviceResult = (iOS || android);
    } catch (e) {
        isSlowDeviceResult = false;
    }

    return isSlowDeviceResult;
};

NETDATA.guid = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

NETDATA.zeropad = function (x) {
    if (x > -10 && x < 10) {
        return '0' + x.toString();
    } else {
        return x.toString();
    }
};

NETDATA.seconds4human = function (seconds, options) {
    let defaultOptions = {
        now: '现在',
        space: ' ',
        negative_suffix: '前',
        day: '日',
        days: '日',
        hour: '小时',
        hours: '小时',
        minute: '分钟',
        minutes: '分钟',
        second: '秒',
        seconds: '秒',
        and: '及'
    };

    if (typeof options !== 'object') {
        options = defaultOptions;
    } else {
        for (var x in defaultOptions) {
            if (typeof options[x] !== 'string') {
                options[x] = defaultOptions[x];
            }
        }
    }

    if (typeof seconds === 'string') {
        seconds = parseInt(seconds, 10);
    }

    if (seconds === 0) {
        return options.now;
    }

    let suffix = '';
    if (seconds < 0) {
        seconds = -seconds;
        if (options.negative_suffix !== '') {
            suffix = options.space + options.negative_suffix;
        }
    }

    let days = Math.floor(seconds / 86400);
    seconds -= (days * 86400);

    let hours = Math.floor(seconds / 3600);
    seconds -= (hours * 3600);

    let minutes = Math.floor(seconds / 60);
    seconds -= (minutes * 60);

    let strings = [];

    if (days > 1) {
        strings.push(days.toString() + options.space + options.days);
    } else if (days === 1) {
        strings.push(days.toString() + options.space + options.day);
    }

    if (hours > 1) {
        strings.push(hours.toString() + options.space + options.hours);
    } else if (hours === 1) {
        strings.push(hours.toString() + options.space + options.hour);
    }

    if (minutes > 1) {
        strings.push(minutes.toString() + options.space + options.minutes);
    } else if (minutes === 1) {
        strings.push(minutes.toString() + options.space + options.minute);
    }

    if (seconds > 1) {
        strings.push(Math.floor(seconds).toString() + options.space + options.seconds);
    } else if (seconds === 1) {
        strings.push(Math.floor(seconds).toString() + options.space + options.second);
    }

    if (strings.length === 1) {
        return strings.pop() + suffix;
    }

    let last = strings.pop();
    return strings.join(", ") + " " + options.and + " " + last + suffix;
};

// ----------------------------------------------------------------------------------------------------------------
// element data attributes

NETDATA.dataAttribute = function (element, attribute, def) {
    let key = 'data-' + attribute.toString();
    if (element.hasAttribute(key)) {
        let data = element.getAttribute(key);

        if (data === 'true') {
            return true;
        }
        if (data === 'false') {
            return false;
        }
        if (data === 'null') {
            return null;
        }

        // Only convert to a number if it doesn't change the string
        if (data === +data + '') {
            return +data;
        }

        if (/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/.test(data)) {
            return JSON.parse(data);
        }

        return data;
    } else {
        return def;
    }
};

NETDATA.dataAttributeBoolean = function (element, attribute, def) {
    let value = NETDATA.dataAttribute(element, attribute, def);

    if (value === true || value === false) // gmosx: Love this :)
    {
        return value;
    }

    if (typeof(value) === 'string') {
        if (value === 'yes' || value === 'on') {
            return true;
        }

        if (value === '' || value === 'no' || value === 'off' || value === 'null') {
            return false;
        }

        return def;
    }

    if (typeof(value) === 'number') {
        return value !== 0;
    }

    return def;
};

// ----------------------------------------------------------------------------------------------------------------
// fast numbers formatting

NETDATA.fastNumberFormat = {
    formattersFixed: [],
    formattersZeroBased: [],

    // this is the fastest and the preferred
    getIntlNumberFormat: function (min, max) {
        let key = max;
        if (min === max) {
            if (typeof this.formattersFixed[key] === 'undefined') {
                this.formattersFixed[key] = new Intl.NumberFormat(undefined, {
                    // style: 'decimal',
                    // minimumIntegerDigits: 1,
                    // minimumSignificantDigits: 1,
                    // maximumSignificantDigits: 1,
                    useGrouping: true,
                    minimumFractionDigits: min,
                    maximumFractionDigits: max
                });
            }

            return this.formattersFixed[key];
        } else if (min === 0) {
            if (typeof this.formattersZeroBased[key] === 'undefined') {
                this.formattersZeroBased[key] = new Intl.NumberFormat(undefined, {
                    // style: 'decimal',
                    // minimumIntegerDigits: 1,
                    // minimumSignificantDigits: 1,
                    // maximumSignificantDigits: 1,
                    useGrouping: true,
                    minimumFractionDigits: min,
                    maximumFractionDigits: max
                });
            }

            return this.formattersZeroBased[key];
        } else {
            // this is never used
            // it is added just for completeness
            return new Intl.NumberFormat(undefined, {
                // style: 'decimal',
                // minimumIntegerDigits: 1,
                // minimumSignificantDigits: 1,
                // maximumSignificantDigits: 1,
                useGrouping: true,
                minimumFractionDigits: min,
                maximumFractionDigits: max
            });
        }
    },

    // this respects locale
    getLocaleString: function (min, max) {
        let key = max;
        if (min === max) {
            if (typeof this.formattersFixed[key] === 'undefined') {
                this.formattersFixed[key] = {
                    format: function (value) {
                        return value.toLocaleString(undefined, {
                            // style: 'decimal',
                            // minimumIntegerDigits: 1,
                            // minimumSignificantDigits: 1,
                            // maximumSignificantDigits: 1,
                            useGrouping: true,
                            minimumFractionDigits: min,
                            maximumFractionDigits: max
                        });
                    }
                };
            }

            return this.formattersFixed[key];
        } else if (min === 0) {
            if (typeof this.formattersZeroBased[key] === 'undefined') {
                this.formattersZeroBased[key] = {
                    format: function (value) {
                        return value.toLocaleString(undefined, {
                            // style: 'decimal',
                            // minimumIntegerDigits: 1,
                            // minimumSignificantDigits: 1,
                            // maximumSignificantDigits: 1,
                            useGrouping: true,
                            minimumFractionDigits: min,
                            maximumFractionDigits: max
                        });
                    }
                };
            }

            return this.formattersZeroBased[key];
        } else {
            return {
                format: function (value) {
                    return value.toLocaleString(undefined, {
                        // style: 'decimal',
                        // minimumIntegerDigits: 1,
                        // minimumSignificantDigits: 1,
                        // maximumSignificantDigits: 1,
                        useGrouping: true,
                        minimumFractionDigits: min,
                        maximumFractionDigits: max
                    });
                }
            };
        }
    },

    // the fallback
    getFixed: function (min, max) {
        let key = max;
        if (min === max) {
            if (typeof this.formattersFixed[key] === 'undefined') {
                this.formattersFixed[key] = {
                    format: function (value) {
                        if (value === 0) {
                            return "0";
                        }
                        return value.toFixed(max);
                    }
                };
            }

            return this.formattersFixed[key];
        } else if (min === 0) {
            if (typeof this.formattersZeroBased[key] === 'undefined') {
                this.formattersZeroBased[key] = {
                    format: function (value) {
                        if (value === 0) {
                            return "0";
                        }
                        return value.toFixed(max);
                    }
                };
            }

            return this.formattersZeroBased[key];
        } else {
            return {
                format: function (value) {
                    if (value === 0) {
                        return "0";
                    }
                    return value.toFixed(max);
                }
            };
        }
    },

    testIntlNumberFormat: function () {
        let value = 1.12345;
        let e1 = "1.12", e2 = "1,12";
        let s = "";

        try {
            let x = new Intl.NumberFormat(undefined, {
                useGrouping: true,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            s = x.format(value);
        } catch (e) {
            s = "";
        }

        // console.log('NumberFormat: ', s);
        return (s === e1 || s === e2);
    },

    testLocaleString: function () {
        let value = 1.12345;
        let e1 = "1.12", e2 = "1,12";
        let s = "";

        try {
            s = value.toLocaleString(undefined, {
                useGrouping: true,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        } catch (e) {
            s = "";
        }

        // console.log('localeString: ', s);
        return (s === e1 || s === e2);
    },

    // on first run we decide which formatter to use
    get: function (min, max) {
        if (this.testIntlNumberFormat()) {
            // console.log('numberformat');
            this.get = this.getIntlNumberFormat;
        } else if (this.testLocaleString()) {
            // console.log('localestring');
            this.get = this.getLocaleString;
        } else {
            // console.log('fixed');
            this.get = this.getFixed;
        }
        return this.get(min, max);
    }
};

// ----------------------------------------------------------------------------------------------------------------
// Detect the netdata server

// http://stackoverflow.com/questions/984510/what-is-my-script-src-url
// http://stackoverflow.com/questions/6941533/get-protocol-domain-and-port-from-url
NETDATA._scriptSource = function () {
    let script = null;

    if (typeof document.currentScript !== 'undefined') {
        script = document.currentScript;
    } else {
        const all_scripts = document.getElementsByTagName('script');
        script = all_scripts[all_scripts.length - 1];
    }

    if (typeof script.getAttribute.length !== 'undefined') {
        script = script.src;
    } else {
        script = script.getAttribute('src', -1);
    }

    return script;
};

// *** src/dashboard.js/server-detection.js

if (typeof netdataServer !== 'undefined') {
    NETDATA.serverDefault = netdataServer;
} else {
    let s = NETDATA._scriptSource();
    if (s) {
        NETDATA.serverDefault = s.replace(/\/dashboard.js(\?.*)?$/g, "");
    } else {
        console.log('警告：无法检测到netdata服务器的URL。');
        NETDATA.serverDefault = null;
    }
}

if (NETDATA.serverDefault === null) {
    NETDATA.serverDefault = '';
} else if (NETDATA.serverDefault.slice(-1) !== '/') {
    NETDATA.serverDefault += '/';
}

if (typeof netdataServerStatic !== 'undefined' && netdataServerStatic !== null && netdataServerStatic !== '') {
    NETDATA.serverStatic = netdataServerStatic;
    if (NETDATA.serverStatic.slice(-1) !== '/') {
        NETDATA.serverStatic += '/';
    }
} else {
    NETDATA.serverStatic = NETDATA.serverDefault;
}

// *** src/dashboard.js/dependencies.js

// default URLs for all the external files we need
// make them RELATIVE so that the whole thing can also be
// installed under a web server
NETDATA.jQuery = NETDATA.serverStatic + 'lib/jquery-2.2.4.min.js';
NETDATA.peity_js = NETDATA.serverStatic + 'lib/jquery.peity-3.2.0.min.js';
NETDATA.sparkline_js = NETDATA.serverStatic + 'lib/jquery.sparkline-2.1.2.min.js';
NETDATA.easypiechart_js = NETDATA.serverStatic + 'lib/jquery.easypiechart-97b5824.min.js';
NETDATA.gauge_js = NETDATA.serverStatic + 'lib/gauge-1.3.2.min.js';
NETDATA.dygraph_js = NETDATA.serverStatic + 'lib/dygraph-c91c859.min.js';
NETDATA.dygraph_smooth_js = NETDATA.serverStatic + 'lib/dygraph-smooth-plotter-c91c859.js';
// NETDATA.raphael_js          = NETDATA.serverStatic + 'lib/raphael-2.2.4-min.js';
// NETDATA.c3_js               = NETDATA.serverStatic + 'lib/c3-0.4.18.min.js';
// NETDATA.c3_css              = NETDATA.serverStatic + 'css/c3-0.4.18.min.css';
NETDATA.d3pie_js = NETDATA.serverStatic + 'lib/d3pie-0.2.1-netdata-3.js';
NETDATA.d3_js = NETDATA.serverStatic + 'lib/d3-4.12.2.min.js';
// NETDATA.morris_js           = NETDATA.serverStatic + 'lib/morris-0.5.1.min.js';
// NETDATA.morris_css          = NETDATA.serverStatic + 'css/morris-0.5.1.css';
NETDATA.google_js = 'https://www.google.com/jsapi';
// Error Handling

NETDATA.errorCodes = {
    100: {message: "无法加载图表库", alert: true},
    101: {message: "无法加载jQuery", alert: true},
    402: {message: "未找到图表库", alert: false},
    403: {message: "图表库未启用/失败", alert: false},
    404: {message: "未找到图表", alert: false},
    405: {message: "无法从服务器下载图表索引", alert: true},
    406: {message: "从服务器下载了无效的图表索引", alert: true},
    407: {message: "Cannot HELLO netdata server", alert: false},
    408: {message: "Netdata服务器向HELLO发送了无效响应", alert: false},
    409: {message: "无法访问netdata注册表", alert: false},
    410: {message: "Netdata注册表访问失败", alert: false},
    411: {message: "Netdata注册表服务器向DELETE发送无效响应", alert: false},
    412: {message: "Netdata注册表删除失败", alert: false},
    413: {message: "Netdata注册表服务器向SWITCH发送无效响应 ", alert: false},
    414: {message: "Netdata注册表切换失败", alert: false},
    415: {message: " Netdata警报下载失败", alert: false},
    416: {message: "Netdata警报日志下载失败", alert: false},
    417: {message: "Netdata注册表服务器向SEARCH发送无效响应 ", alert: false},
    418: {message: "Netdata注册表搜索失败", alert: false}
};

NETDATA.errorLast = {
    code: 0,
    message: "",
    datetime: 0
};

NETDATA.error = function (code, msg) {
    NETDATA.errorLast.code = code;
    NETDATA.errorLast.message = msg;
    NETDATA.errorLast.datetime = Date.now();

    console.log("错误 " + code + ": " + NETDATA.errorCodes[code].message + ": " + msg);

    let ret = true;
    if (typeof netdataErrorCallback === 'function') {
        ret = netdataErrorCallback('system', code, msg);
    }

    if (ret && NETDATA.errorCodes[code].alert) {
        alert("错误 " + code + ": " + NETDATA.errorCodes[code].message + ": " + msg);
    }
};

NETDATA.errorReset = function () {
    NETDATA.errorLast.code = 0;
    NETDATA.errorLast.message = "You are doing fine!";
    NETDATA.errorLast.datetime = 0;
};
// *** src/dashboard.js/compatibility.js

// Compatibility fixes.

// fix IE issue with console
if (!window.console) {
    window.console = {
        log: function () {
        }
    };
}

// if string.endsWith is not defined, define it
if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function (s) {
        if (s.length > this.length) {
            return false;
        }
        return this.slice(-s.length) === s;
    };
}

// if string.startsWith is not defined, define it
if (typeof String.prototype.startsWith !== 'function') {
    String.prototype.startsWith = function (s) {
        if (s.length > this.length) {
            return false;
        }
        return this.slice(s.length) === s;
    };
}
// ----------------------------------------------------------------------------------------------------------------
// XSS checks

NETDATA.xss = {
    enabled: (typeof netdataCheckXSS === 'undefined') ? false : netdataCheckXSS,
    enabled_for_data: (typeof netdataCheckXSS === 'undefined') ? false : netdataCheckXSS,

    string: function (s) {
        return s.toString()
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },

    object: function (name, obj, ignore_regex) {
        if (typeof ignore_regex !== 'undefined' && ignore_regex.test(name)) {
            // console.log('XSS: ignoring "' + name + '"');
            return obj;
        }

        switch (typeof(obj)) {
            case 'string':
                const ret = this.string(obj);
                if (ret !== obj) {
                    console.log('XSS保护已更改字符串 ' + name + ' from "' + obj + '" to "' + ret + '"');
                }
                return ret;

            case 'object':
                if (obj === null) {
                    return obj;
                }

                if (Array.isArray(obj)) {
                    // console.log('checking array "' + name + '"');

                    let len = obj.length;
                    while (len--) {
                        obj[len] = this.object(name + '[' + len + ']', obj[len], ignore_regex);
                    }
                } else {
                    // console.log('checking object "' + name + '"');

                    for (var i in obj) {
                        if (obj.hasOwnProperty(i) === false) {
                            continue;
                        }
                        if (this.string(i) !== i) {
                            console.log('XSS protection removed invalid object member "' + name + '.' + i + '"');
                            delete obj[i];
                        } else {
                            obj[i] = this.object(name + '.' + i, obj[i], ignore_regex);
                        }
                    }
                }
                return obj;

            default:
                return obj;
        }
    },

    checkOptional: function (name, obj, ignore_regex) {
        if (this.enabled) {
            //console.log('XSS: checking optional "' + name + '"...');
            return this.object(name, obj, ignore_regex);
        }
        return obj;
    },

    checkAlways: function (name, obj, ignore_regex) {
        //console.log('XSS: checking always "' + name + '"...');
        return this.object(name, obj, ignore_regex);
    },

    checkData: function (name, obj, ignore_regex) {
        if (this.enabled_for_data) {
            //console.log('XSS: checking data "' + name + '"...');
            return this.object(name, obj, ignore_regex);
        }
        return obj;
    }
};
NETDATA.colorHex2Rgb = function (hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

NETDATA.colorLuminance = function (hex, lum) {
    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    lum = lum || 0;

    // convert to decimal and change luminosity
    let rgb = "#";
    for (let i = 0; i < 3; i++) {
        let c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }

    return rgb;
};
NETDATA.unitsConversion = {
    keys: {},       // keys for data-common-units
    latest: {},     // latest selected units for data-common-units

    globalReset: function () {
        this.keys = {};
        this.latest = {};
    },

    scalableUnits: {
        'packets/s': {
            'pps': 1,
            'Kpps': 1000,
            'Mpps': 1000000
        },
        'pps': {
            'pps': 1,
            'Kpps': 1000,
            'Mpps': 1000000
        },
        'kilobits/s': {
            'bits/s': 1 / 1000,
            'kilobits/s': 1,
            'megabits/s': 1000,
            'gigabits/s': 1000000,
            'terabits/s': 1000000000
        },
        'kilobytes/s': {
            'bytes/s': 1 / 1024,
            'kilobytes/s': 1,
            'megabytes/s': 1024,
            'gigabytes/s': 1024 * 1024,
            'terabytes/s': 1024 * 1024 * 1024
        },
        'KB/s': {
            'B/s': 1 / 1024,
            'KB/s': 1,
            'MB/s': 1024,
            'GB/s': 1024 * 1024,
            'TB/s': 1024 * 1024 * 1024
        },
        'KiB/s': {
            'B/s': 1 / 1024,
            'KiB/s': 1,
            'MiB/s': 1024,
            'GiB/s': 1024 * 1024,
            'TiB/s': 1024 * 1024 * 1024
        },
        'B': {
            'B': 1,
            'KiB': 1024,
            'MiB': 1024 * 1024,
            'GiB': 1024 * 1024 * 1024,
            'TiB': 1024 * 1024 * 1024 * 1024,
            'PiB': 1024 * 1024 * 1024 * 1024 * 1024
        },
        'KB': {
            'B': 1 / 1024,
            'KB': 1,
            'MB': 1024,
            'GB': 1024 * 1024,
            'TB': 1024 * 1024 * 1024
        },
        'KiB': {
            'B': 1 / 1024,
            'KiB': 1,
            'MiB': 1024,
            'GiB': 1024 * 1024,
            'TiB': 1024 * 1024 * 1024
        },
        'MB': {
            'B': 1 / (1024 * 1024),
            'KB': 1 / 1024,
            'MB': 1,
            'GB': 1024,
            'TB': 1024 * 1024,
            'PB': 1024 * 1024 * 1024
        },
        'MiB': {
            'B': 1 / (1024 * 1024),
            'KiB': 1 / 1024,
            'MiB': 1,
            'GiB': 1024,
            'TiB': 1024 * 1024,
            'PiB': 1024 * 1024 * 1024
        },
        'GB': {
            'B': 1 / (1024 * 1024 * 1024),
            'KB': 1 / (1024 * 1024),
            'MB': 1 / 1024,
            'GB': 1,
            'TB': 1024,
            'PB': 1024 * 1024,
            'EB': 1024 * 1024 * 1024
        },
        'GiB': {
            'B': 1 / (1024 * 1024 * 1024),
            'KiB': 1 / (1024 * 1024),
            'MiB': 1 / 1024,
            'GiB': 1,
            'TiB': 1024,
            'PiB': 1024 * 1024,
            'EiB': 1024 * 1024 * 1024
        },
        'num': {
            'num': 1,
            'num (K)': 1000,
            'num (M)': 1000000,
            'num (G)': 1000000000,
            'num (T)': 1000000000000
        }
        /*
        'milliseconds': {
            'seconds': 1000
        },
        'seconds': {
            'milliseconds': 0.001,
            'seconds': 1,
            'minutes': 60,
            'hours': 3600,
            'days': 86400
        }
        */
    },

    convertibleUnits: {
        'Celsius': {
            'Fahrenheit': {
                check: function (max) {
                    void(max);
                    return NETDATA.options.current.temperature === 'fahrenheit';
                },
                convert: function (value) {
                    return value * 9 / 5 + 32;
                }
            }
        },
        'celsius': {
            'fahrenheit': {
                check: function (max) {
                    void(max);
                    return NETDATA.options.current.temperature === 'fahrenheit';
                },
                convert: function (value) {
                    return value * 9 / 5 + 32;
                }
            }
        },
        'seconds': {
            'time': {
                check: function (max) {
                    void(max);
                    return NETDATA.options.current.seconds_as_time;
                },
                convert: function (seconds) {
                    return NETDATA.unitsConversion.seconds2time(seconds);
                }
            }
        },
        'milliseconds': {
            'milliseconds': {
                check: function (max) {
                    return NETDATA.options.current.seconds_as_time && max < 1000;
                },
                convert: function (milliseconds) {
                    let tms = Math.round(milliseconds * 10);
                    milliseconds = Math.floor(tms / 10);

                    tms -= milliseconds * 10;

                    return (milliseconds).toString() + '.' + tms.toString();
                }
            },
            'seconds': {
                check: function (max) {
                    return NETDATA.options.current.seconds_as_time && max >= 1000 && max < 60000;
                },
                convert: function (milliseconds) {
                    milliseconds = Math.round(milliseconds);

                    let seconds = Math.floor(milliseconds / 1000);
                    milliseconds -= seconds * 1000;

                    milliseconds = Math.round(milliseconds / 10);

                    return seconds.toString() + '.'
                        + NETDATA.zeropad(milliseconds);
                }
            },
            'M:SS.ms': {
                check: function (max) {
                    return NETDATA.options.current.seconds_as_time && max >= 60000;
                },
                convert: function (milliseconds) {
                    milliseconds = Math.round(milliseconds);

                    let minutes = Math.floor(milliseconds / 60000);
                    milliseconds -= minutes * 60000;

                    let seconds = Math.floor(milliseconds / 1000);
                    milliseconds -= seconds * 1000;

                    milliseconds = Math.round(milliseconds / 10);

                    return minutes.toString() + ':'
                        + NETDATA.zeropad(seconds) + '.'
                        + NETDATA.zeropad(milliseconds);
                }
            }
        },
        'nanoseconds': {
            'nanoseconds': {
                check: function (max) {
                    return NETDATA.options.current.seconds_as_time && max < 1000;
                },
                convert: function (nanoseconds) {
                    let tms = Math.round(nanoseconds * 10);
                    nanoseconds = Math.floor(tms / 10);

                    tms -= nanoseconds * 10;

                    return (nanoseconds).toString() + '.' + tms.toString();
                }
            },
            'microseconds': {
                check: function (max) {
                    return NETDATA.options.current.seconds_as_time
                           && max >= 1000 && max < 1000 * 1000;
                },
                convert: function (nanoseconds) {
                    nanoseconds = Math.round(nanoseconds);

                    let microseconds = Math.floor(nanoseconds / 1000);
                    nanoseconds -= microseconds * 1000;

                    nanoseconds = Math.round(nanoseconds / 10 );

                    return microseconds.toString() + '.'
                        + NETDATA.zeropad(nanoseconds);
                }
            },
            'milliseconds': {
                check: function (max) {
                    return NETDATA.options.current.seconds_as_time
                           && max >= 1000 * 1000 && max < 1000 * 1000 * 1000;
                },
                convert: function (nanoseconds) {
                    nanoseconds = Math.round(nanoseconds);

                    let milliseconds = Math.floor(nanoseconds / 1000 / 1000);
                    nanoseconds -= milliseconds * 1000 * 1000;

                    nanoseconds = Math.round(nanoseconds / 1000 / 10);

                    return milliseconds.toString() + '.'
                        + NETDATA.zeropad(nanoseconds);
                }
            },
            'seconds': {
                check: function (max) {
                    return NETDATA.options.current.seconds_as_time
                           && max >= 1000 * 1000 * 1000;
                },
                convert: function (nanoseconds) {
                    nanoseconds = Math.round(nanoseconds);

                    let seconds = Math.floor(nanoseconds / 1000 / 1000 / 1000);
                    nanoseconds -= seconds * 1000 * 1000 * 1000;

                    nanoseconds = Math.round(nanoseconds / 1000 / 1000 / 10);

                    return seconds.toString() + '.'
                        + NETDATA.zeropad(nanoseconds);
                }
            },
        }
    },

    seconds2time: function (seconds) {
        seconds = Math.abs(seconds);

        let days = Math.floor(seconds / 86400);
        seconds -= days * 86400;

        let hours = Math.floor(seconds / 3600);
        seconds -= hours * 3600;

        let minutes = Math.floor(seconds / 60);
        seconds -= minutes * 60;

        seconds = Math.round(seconds);

        let ms_txt = '';
        /*
        let ms = seconds - Math.floor(seconds);
        seconds -= ms;
        ms = Math.round(ms * 1000);

        if (ms > 1) {
            if (ms < 10)
                ms_txt = '.00' + ms.toString();
            else if (ms < 100)
                ms_txt = '.0' + ms.toString();
            else
                ms_txt = '.' + ms.toString();
        }
        */

        return ((days > 0) ? days.toString() + 'd:' : '').toString()
            + NETDATA.zeropad(hours) + ':'
            + NETDATA.zeropad(minutes) + ':'
            + NETDATA.zeropad(seconds)
            + ms_txt;
    },

    // get a function that converts the units
    // + every time units are switched call the callback
    get: function (uuid, min, max, units, desired_units, common_units_name, switch_units_callback) {
        // validate the parameters
        if (typeof units === 'undefined') {
            units = 'undefined';
        }

        // check if we support units conversion
        if (typeof this.scalableUnits[units] === 'undefined' && typeof this.convertibleUnits[units] === 'undefined') {
            // we can't convert these units
            //console.log('DEBUG: ' + uuid.toString() + ' can\'t convert units: ' + units.toString());
            return function (value) {
                return value;
            };
        }

        // check if the caller wants the original units
        if (typeof desired_units === 'undefined' || desired_units === null || desired_units === 'original' || desired_units === units) {
            //console.log('DEBUG: ' + uuid.toString() + ' original units wanted');
            switch_units_callback(units);
            return function (value) {
                return value;
            };
        }

        // now we know we can convert the units
        // and the caller wants some kind of conversion

        let tunits = null;
        let tdivider = 0;

        if (typeof this.scalableUnits[units] !== 'undefined') {
            // units that can be scaled
            // we decide a divider

            // console.log('NETDATA.unitsConversion.get(' + units.toString() + ', ' + desired_units.toString() + ', function()) decide divider with min = ' + min.toString() + ', max = ' + max.toString());

            if (desired_units === 'auto') {
                // the caller wants to auto-scale the units

                // find the absolute maximum value that is rendered on the chart
                // based on this we decide the scale
                min = Math.abs(min);
                max = Math.abs(max);
                if (min > max) {
                    max = min;
                }

                // find the smallest scale that provides integers
                // for (x in this.scalableUnits[units]) {
                //     if (this.scalableUnits[units].hasOwnProperty(x)) {
                //         let m = this.scalableUnits[units][x];
                //         if (m <= max && m > tdivider) {
                //             tunits = x;
                //             tdivider = m;
                //         }
                //     }
                // }
                const sunit = this.scalableUnits[units];
                for (var x of Object.keys(sunit)) {
                    let m = sunit[x];
                    if (m <= max && m > tdivider) {
                        tunits = x;
                        tdivider = m;
                    }
                }

                if (tunits === null || tdivider <= 0) {
                    // we couldn't find one
                    //console.log('DEBUG: ' + uuid.toString() + ' cannot find an auto-scaling candidate for units: ' + units.toString() + ' (max: ' + max.toString() + ')');
                    switch_units_callback(units);
                    return function (value) {
                        return value;
                    };
                }

                if (typeof common_units_name === 'string' && typeof uuid === 'string') {
                    // the caller wants several charts to have the same units
                    // data-common-units

                    let common_units_key = common_units_name + '-' + units;

                    // add our divider into the list of keys
                    let t = this.keys[common_units_key];
                    if (typeof t === 'undefined') {
                        this.keys[common_units_key] = {};
                        t = this.keys[common_units_key];
                    }
                    t[uuid] = {
                        units: tunits,
                        divider: tdivider
                    };

                    // find the max divider of all charts
                    let common_units = t[uuid];
                    for (var x in t) {
                        if (t.hasOwnProperty(x) && t[x].divider > common_units.divider) {
                            common_units = t[x];
                        }
                    }

                    // save our common_max to the latest keys
                    let latest = this.latest[common_units_key];
                    if (typeof latest === 'undefined') {
                        this.latest[common_units_key] = {};
                        latest = this.latest[common_units_key];
                    }
                    latest.units = common_units.units;
                    latest.divider = common_units.divider;

                    tunits = latest.units;
                    tdivider = latest.divider;

                    //console.log('DEBUG: ' + uuid.toString() + ' converted units: ' + units.toString() + ' to units: ' + tunits.toString() + ' with divider ' + tdivider.toString() + ', common-units=' + common_units_name.toString() + ((t[uuid].divider !== tdivider)?' USED COMMON, mine was ' + t[uuid].units:' set common').toString());

                    // apply it to this chart
                    switch_units_callback(tunits);
                    return function (value) {
                        if (tdivider !== latest.divider) {
                            // another chart switched our common units
                            // we should switch them too
                            //console.log('DEBUG: ' + uuid + ' switching units due to a common-units change, from ' + tunits.toString() + ' to ' + latest.units.toString());
                            tunits = latest.units;
                            tdivider = latest.divider;
                            switch_units_callback(tunits);
                        }

                        return value / tdivider;
                    };
                } else {
                    // the caller did not give data-common-units
                    // this chart auto-scales independently of all others
                    //console.log('DEBUG: ' + uuid.toString() + ' converted units: ' + units.toString() + ' to units: ' + tunits.toString() + ' with divider ' + tdivider.toString() + ', autonomously');

                    switch_units_callback(tunits);
                    return function (value) {
                        return value / tdivider;
                    };
                }
            } else {
                // the caller wants specific units

                if (typeof this.scalableUnits[units][desired_units] !== 'undefined') {
                    // all good, set the new units
                    tdivider = this.scalableUnits[units][desired_units];
                    // console.log('DEBUG: ' + uuid.toString() + ' converted units: ' + units.toString() + ' to units: ' + desired_units.toString() + ' with divider ' + tdivider.toString() + ', by reference');
                    switch_units_callback(desired_units);
                    return function (value) {
                        return value / tdivider;
                    };
                } else {
                    // oops! switch back to original units
                    console.log('Units conversion from ' + units.toString() + ' to ' + desired_units.toString() + ' is not supported.');
                    switch_units_callback(units);
                    return function (value) {
                        return value;
                    };
                }
            }
        } else if (typeof this.convertibleUnits[units] !== 'undefined') {
            // units that can be converted
            if (desired_units === 'auto') {
                for (var x in this.convertibleUnits[units]) {
                    if (this.convertibleUnits[units].hasOwnProperty(x)) {
                        if (this.convertibleUnits[units][x].check(max)) {
                            //console.log('DEBUG: ' + uuid.toString() + ' converting ' + units.toString() + ' to: ' + x.toString());
                            switch_units_callback(x);
                            return this.convertibleUnits[units][x].convert;
                        }
                    }
                }

                // none checked ok
                //console.log('DEBUG: ' + uuid.toString() + ' no conversion available for ' + units.toString() + ' to: ' + desired_units.toString());
                switch_units_callback(units);
                return function (value) {
                    return value;
                };
            } else if (typeof this.convertibleUnits[units][desired_units] !== 'undefined') {
                switch_units_callback(desired_units);
                return this.convertibleUnits[units][desired_units].convert;
            } else {
                console.log('单位转换自 ' + units.toString() + ' to ' + desired_units.toString() + ' 不支持。');
                switch_units_callback(units);
                return function (value) {
                    return value;
                };
            }
        } else {
            // hm... did we forget to implement the new type?
            console.log(`Unmatched unit conversion method for units ${units.toString()}`);
            switch_units_callback(units);
            return function (value) {
                return value;
            };
        }
    }
};

NETDATA.icons = {
    left: '<i class="fas fa-backward"></i>',
    reset: '<i class="fas fa-play"></i>',
    right: '<i class="fas fa-forward"></i>',
    zoomIn: '<i class="fas fa-plus"></i>',
    zoomOut: '<i class="fas fa-minus"></i>',
    resize: '<i class="fas fa-sort"></i>',
    lineChart: '<i class="fas fa-chart-line"></i>',
    areaChart: '<i class="fas fa-chart-area"></i>',
    noChart: '<i class="fas fa-chart-area"></i>',
    loading: '<i class="fas fa-sync-alt"></i>',
    noData: '<i class="fas fa-exclamation-triangle"></i>'
};

if (typeof netdataIcons === 'object') {
    // for (let icon in NETDATA.icons) {
    //     if (NETDATA.icons.hasOwnProperty(icon) && typeof(netdataIcons[icon]) === 'string')
    //         NETDATA.icons[icon] = netdataIcons[icon];
    // }
    for (var icon of Object.keys(NETDATA.icons)) {
        if (typeof(netdataIcons[icon]) === 'string') {
            NETDATA.icons[icon] = netdataIcons[icon]
        }
    }
}

if (typeof netdataSnapshotData === 'undefined') {
    netdataSnapshotData = null;
}

if (typeof netdataShowHelp === 'undefined') {
    netdataShowHelp = true;
}

if (typeof netdataShowAlarms === 'undefined') {
    netdataShowAlarms = false;
}

if (typeof netdataRegistryAfterMs !== 'number' || netdataRegistryAfterMs < 0) {
    netdataRegistryAfterMs = 0; // 1500;
}

if (typeof netdataRegistry === 'undefined') {
    // backward compatibility
    netdataRegistry = (typeof netdataNoRegistry !== 'undefined' && netdataNoRegistry === false);
}

if (netdataRegistry === false && typeof netdataRegistryCallback === 'function') {
    netdataRegistry = true;
}

// ----------------------------------------------------------------------------------------------------------------
// the defaults for all charts

// if the user does not specify any of these, the following will be used

NETDATA.chartDefaults = {
    width: '100%',                  // the chart width - can be null
    height: '100%',                 // the chart height - can be null
    min_width: null,                // the chart minimum width - can be null
    library: 'dygraph',             // the graphing library to use
    method: 'average',              // the grouping method
    before: 0,                      // panning
    after: -600,                    // panning
    pixels_per_point: 1,            // the detail of the chart
    fill_luminance: 0.8             // luminance of colors in solid areas
};

// ----------------------------------------------------------------------------------------------------------------
// global options

NETDATA.options = {
    pauseCallback: null,            // a callback when we are really paused

    pause: false,                   // when enabled we don't auto-refresh the charts

    targets: [],                    // an array of all the state objects that are
                                    // currently active (independently of their
                                    // viewport visibility)

    updated_dom: true,              // when true, the DOM has been updated with
                                    // new elements we have to check.

    auto_refresher_fast_weight: 0,  // this is the current time in ms, spent
                                    // rendering charts continuously.
                                    // used with .current.fast_render_timeframe

    page_is_visible: true,          // when true, this page is visible

    auto_refresher_stop_until: 0,   // timestamp in ms - used internally, to stop the
                                    // auto-refresher for some time (when a chart is
                                    // performing pan or zoom, we need to stop refreshing
                                    // all other charts, to have the maximum speed for
                                    // rendering the chart that is panned or zoomed).
                                    // Used with .current.global_pan_sync_time

    on_scroll_refresher_stop_until: 0, // timestamp in ms - used to stop evaluating
    // charts for some time, after a page scroll

    last_page_resize: Date.now(),   // the timestamp of the last resize request

    last_page_scroll: 0,            // the timestamp the last time the page was scrolled

    browser_timezone: 'unknown',    // timezone detected by javascript
    server_timezone: 'unknown',     // timezone reported by the server

    force_data_points: 0,           // force the number of points to be returned for charts
    fake_chart_rendering: false,    // when set to true, the dashboard will download data but will not render the charts

    passive_events: null,           // true if the browser supports passive events

    // the current profile
    // we may have many...
    current: {
        units: 'auto',              // can be 'auto' or 'original'
        temperature: 'celsius',     // can be 'celsius' or 'fahrenheit'
        seconds_as_time: true,      // show seconds as DDd:HH:MM:SS ?
        timezone: 'default',        // the timezone to use, or 'default'
        user_set_server_timezone: 'default', // as set by the user on the dashboard

        legend_toolbox: true,       // show the legend toolbox on charts
        resize_charts: true,        // show the resize handler on charts

        pixels_per_point: isSlowDevice() ? 5 : 1, // the minimum pixels per point for all charts
        // increase this to speed javascript up
        // each chart library has its own limit too
        // the max of this and the chart library is used
        // the final is calculated every time, so a change
        // here will have immediate effect on the next chart
        // update

        idle_between_charts: 100,   // ms - how much time to wait between chart updates

        fast_render_timeframe: 200, // ms - render continuously until this time of continuous
                                    // rendering has been reached
                                    // this setting is used to make it render e.g. 10
                                    // charts at once, sleep idle_between_charts time
                                    // and continue for another 10 charts.

        idle_between_loops: 500,    // ms - if all charts have been updated, wait this
                                    // time before starting again.

        idle_parallel_loops: 100,   // ms - the time between parallel refresher updates

        idle_lost_focus: 500,       // ms - when the window does not have focus, check
                                    // if focus has been regained, every this time

        global_pan_sync_time: 300,  // ms - when you pan or zoom a chart, the background
                                    // auto-refreshing of charts is paused for this amount
                                    // of time

        sync_selection_delay: 400,  // ms - when you pan or zoom a chart, wait this amount
                                    // of time before setting up synchronized selections
                                    // on hover.

        sync_selection: true,       // enable or disable selection sync

        pan_and_zoom_delay: 50,     // when panning or zooming, how ofter to update the chart

        sync_pan_and_zoom: true,    // enable or disable pan and zoom sync

        pan_and_zoom_data_padding: true, // fetch more data for the master chart when panning or zooming

        update_only_visible: true,  // enable or disable visibility management / used for printing

        parallel_refresher: !isSlowDevice(), // enable parallel refresh of charts

        concurrent_refreshes: true, // when parallel_refresher is enabled, sync also the charts

        destroy_on_hide: isSlowDevice(), // destroy charts when they are not visible

        show_help: netdataShowHelp, // when enabled the charts will show some help
        show_help_delay_show_ms: 500,
        show_help_delay_hide_ms: 0,

        eliminate_zero_dimensions: true, // do not show dimensions with just zeros

        stop_updates_when_focus_is_lost: true, // boolean - shall we stop auto-refreshes when document does not have user focus
        stop_updates_while_resizing: 1000,  // ms - time to stop auto-refreshes while resizing the charts

        double_click_speed: 500,    // ms - time between clicks / taps to detect double click/tap

        smooth_plot: !isSlowDevice(), // enable smooth plot, where possible

        color_fill_opacity_line: 1.0,
        color_fill_opacity_area: 0.2,
        color_fill_opacity_stacked: 0.8,

        pan_and_zoom_factor: 0.25,      // the increment when panning and zooming with the toolbox
        pan_and_zoom_factor_multiplier_control: 2.0,
        pan_and_zoom_factor_multiplier_shift: 3.0,
        pan_and_zoom_factor_multiplier_alt: 4.0,

        abort_ajax_on_scroll: false,            // kill pending ajax page scroll
        async_on_scroll: false,                 // sync/async onscroll handler
        onscroll_worker_duration_threshold: 30, // time in ms, for async scroll handler

        retries_on_data_failures: 3, // how many retries to make if we can't fetch chart data from the server

        setOptionCallback: function () {
        }
    },

    debug: {
        show_boxes: false,
        main_loop: false,
        focus: false,
        visibility: false,
        chart_data_url: false,
        chart_errors: true, // remember to set it to false before merging
        chart_timing: false,
        chart_calls: false,
        libraries: false,
        dygraph: false,
        globalSelectionSync: false,
        globalPanAndZoom: false
    }
};

NETDATA.statistics = {
    refreshes_total: 0,
    refreshes_active: 0,
    refreshes_active_max: 0
};

// local storage options

NETDATA.localStorage = {
    default: {},
    current: {},
    callback: {} // only used for resetting back to defaults
};

NETDATA.localStorageTested = -1;
NETDATA.localStorageTest = function () {
    if (NETDATA.localStorageTested !== -1) {
        return NETDATA.localStorageTested;
    }

    if (typeof Storage !== "undefined" && typeof localStorage === 'object') {
        let test = 'test';
        try {
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            NETDATA.localStorageTested = true;
        } catch (e) {
            NETDATA.localStorageTested = false;
        }
    } else {
        NETDATA.localStorageTested = false;
    }

    return NETDATA.localStorageTested;
};

NETDATA.localStorageGet = function (key, def, callback) {
    let ret = def;

    if (typeof NETDATA.localStorage.default[key.toString()] === 'undefined') {
        NETDATA.localStorage.default[key.toString()] = def;
        NETDATA.localStorage.callback[key.toString()] = callback;
    }

    if (NETDATA.localStorageTest()) {
        try {
            // console.log('localStorage: loading "' + key.toString() + '"');
            ret = localStorage.getItem(key.toString());
            // console.log('netdata loaded: ' + key.toString() + ' = ' + ret.toString());
            if (ret === null || ret === 'undefined') {
                // console.log('localStorage: cannot load it, saving "' + key.toString() + '" with value "' + JSON.stringify(def) + '"');
                localStorage.setItem(key.toString(), JSON.stringify(def));
                ret = def;
            } else {
                // console.log('localStorage: got "' + key.toString() + '" with value "' + ret + '"');
                ret = JSON.parse(ret);
                // console.log('localStorage: loaded "' + key.toString() + '" as value ' + ret + ' of type ' + typeof(ret));
            }
        } catch (error) {
            console.log('localStorage: failed to read "' + key.toString() + '", using default: "' + def.toString() + '"');
            ret = def;
        }
    }

    if (typeof ret === 'undefined' || ret === 'undefined') {
        console.log('localStorage: LOADED UNDEFINED "' + key.toString() + '" as value ' + ret + ' of type ' + typeof(ret));
        ret = def;
    }

    NETDATA.localStorage.current[key.toString()] = ret;
    return ret;
};

NETDATA.localStorageSet = function (key, value, callback) {
    if (typeof value === 'undefined' || value === 'undefined') {
        console.log('localStorage: ATTEMPT TO SET UNDEFINED "' + key.toString() + '" as value ' + value + ' of type ' + typeof(value));
    }

    if (typeof NETDATA.localStorage.default[key.toString()] === 'undefined') {
        NETDATA.localStorage.default[key.toString()] = value;
        NETDATA.localStorage.current[key.toString()] = value;
        NETDATA.localStorage.callback[key.toString()] = callback;
    }

    if (NETDATA.localStorageTest()) {
        // console.log('localStorage: saving "' + key.toString() + '" with value "' + JSON.stringify(value) + '"');
        try {
            localStorage.setItem(key.toString(), JSON.stringify(value));
        } catch (e) {
            console.log('localStorage: failed to save "' + key.toString() + '" with value: "' + value.toString() + '"');
        }
    }

    NETDATA.localStorage.current[key.toString()] = value;
    return value;
};

NETDATA.localStorageGetRecursive = function (obj, prefix, callback) {
    let keys = Object.keys(obj);
    let len = keys.length;
    while (len--) {
        let i = keys[len];

        if (typeof obj[i] === 'object') {
            //console.log('object ' + prefix + '.' + i.toString());
            NETDATA.localStorageGetRecursive(obj[i], prefix + '.' + i.toString(), callback);
            continue;
        }

        obj[i] = NETDATA.localStorageGet(prefix + '.' + i.toString(), obj[i], callback);
    }
};

NETDATA.setOption = function (key, value) {
    if (key.toString() === 'setOptionCallback') {
        if (typeof NETDATA.options.current.setOptionCallback === 'function') {
            NETDATA.options.current[key.toString()] = value;
            NETDATA.options.current.setOptionCallback();
        }
    } else if (NETDATA.options.current[key.toString()] !== value) {
        let name = 'options.' + key.toString();

        if (typeof NETDATA.localStorage.default[name.toString()] === 'undefined') {
            console.log('localStorage: setOption() on unsaved option: "' + name.toString() + '", value: ' + value);
        }

        //console.log(NETDATA.localStorage);
        //console.log('setOption: setting "' + key.toString() + '" to "' + value + '" of type ' + typeof(value) + ' original type ' + typeof(NETDATA.options.current[key.toString()]));
        //console.log(NETDATA.options);
        NETDATA.options.current[key.toString()] = NETDATA.localStorageSet(name.toString(), value, null);

        if (typeof NETDATA.options.current.setOptionCallback === 'function') {
            NETDATA.options.current.setOptionCallback();
        }
    }

    return true;
};

NETDATA.getOption = function (key) {
    return NETDATA.options.current[key.toString()];
};

// read settings from local storage
NETDATA.localStorageGetRecursive(NETDATA.options.current, 'options', null);

// always start with this option enabled.
NETDATA.setOption('stop_updates_when_focus_is_lost', true);

NETDATA.resetOptions = function () {
    let keys = Object.keys(NETDATA.localStorage.default);
    let len = keys.length;

    while (len--) {
        let i = keys[len];
        let a = i.split('.');

        if (a[0] === 'options') {
            if (a[1] === 'setOptionCallback') {
                continue;
            }
            if (typeof NETDATA.localStorage.default[i] === 'undefined') {
                continue;
            }
            if (NETDATA.options.current[i] === NETDATA.localStorage.default[i]) {
                continue;
            }

            NETDATA.setOption(a[1], NETDATA.localStorage.default[i]);
        } else if (a[0] === 'chart_heights') {
            if (typeof NETDATA.localStorage.callback[i] === 'function' && typeof NETDATA.localStorage.default[i] !== 'undefined') {
                NETDATA.localStorage.callback[i](NETDATA.localStorage.default[i]);
            }
        }
    }

    NETDATA.dateTime.init(NETDATA.options.current.timezone);
};

// *** src/dashboard.js/timeout.js

// TODO: Better name needed

NETDATA.timeout = {
    // by default, these are just wrappers to setTimeout() / clearTimeout()

    step: function (callback) {
        return window.setTimeout(callback, 1000 / 60);
    },

    set: function (callback, delay) {
        return window.setTimeout(callback, delay);
    },

    clear: function (id) {
        return window.clearTimeout(id);
    },

    init: function () {
        let custom = true;

        if (window.requestAnimationFrame) {
            this.step = function (callback) {
                return window.requestAnimationFrame(callback);
            };

            this.clear = function (handle) {
                return window.cancelAnimationFrame(handle.value);
            };
        // } else if (window.webkitRequestAnimationFrame) {
        //     this.step = function (callback) {
        //         return window.webkitRequestAnimationFrame(callback);
        //     };

        //     if (window.webkitCancelAnimationFrame) {
        //         this.clear = function (handle) {
        //             return window.webkitCancelAnimationFrame(handle.value);
        //         };
        //     } else if (window.webkitCancelRequestAnimationFrame) {
        //         this.clear = function (handle) {
        //             return window.webkitCancelRequestAnimationFrame(handle.value);
        //         };
        //     }
        // } else if (window.mozRequestAnimationFrame) {
        //     this.step = function (callback) {
        //         return window.mozRequestAnimationFrame(callback);
        //     };

        //     this.clear = function (handle) {
        //         return window.mozCancelRequestAnimationFrame(handle.value);
        //     };
        // } else if (window.oRequestAnimationFrame) {
        //     this.step = function (callback) {
        //         return window.oRequestAnimationFrame(callback);
        //     };

        //     this.clear = function (handle) {
        //         return window.oCancelRequestAnimationFrame(handle.value);
        //     };
        // } else if (window.msRequestAnimationFrame) {
        //     this.step = function (callback) {
        //         return window.msRequestAnimationFrame(callback);
        //     };

        //     this.clear = function (handle) {
        //         return window.msCancelRequestAnimationFrame(handle.value);
        //     };
        } else {
            custom = false;
        }

        if (custom) {
            // we have installed custom .step() / .clear() functions
            // overwrite the .set() too

            this.set = function (callback, delay) {
                let start = Date.now(),
                    handle = new Object();

                const loop = () => {
                    let current = Date.now(),
                        delta = current - start;

                    if (delta >= delay) {
                        callback.call();
                    } else {
                        handle.value = this.step(loop);
                    }
                }

                handle.value = this.step(loop);
                return handle;
            };
        }
    }
};

NETDATA.timeout.init();
// Codacy declarations
/* global netdataTheme */

NETDATA.themes = {
    white: {
        bootstrap_css: NETDATA.serverStatic + 'css/bootstrap-3.3.7.css',
        dashboard_css: NETDATA.serverStatic + 'dashboard.css?v20190902-0',
        background: '#FFFFFF',
        foreground: '#000000',
        grid: '#F0F0F0',
        axis: '#F0F0F0',
        highlight: '#F5F5F5',
        colors: ['#3366CC', '#DC3912', '#109618', '#FF9900', '#990099', '#DD4477',
            '#3B3EAC', '#66AA00', '#0099C6', '#B82E2E', '#AAAA11', '#5574A6',
            '#994499', '#22AA99', '#6633CC', '#E67300', '#316395', '#8B0707',
            '#329262', '#3B3EAC'],
        easypiechart_track: '#f0f0f0',
        easypiechart_scale: '#dfe0e0',
        gauge_pointer: '#C0C0C0',
        gauge_stroke: '#F0F0F0',
        gauge_gradient: false,
        d3pie: {
            title: '#333333',
            subtitle: '#666666',
            footer: '#888888',
            other: '#aaaaaa',
            mainlabel: '#333333',
            percentage: '#dddddd',
            value: '#aaaa22',
            tooltip_bg: '#000000',
            tooltip_fg: '#efefef',
            segment_stroke: "#ffffff",
            gradient_color: '#000000'
        }
    },
    slate: {
        bootstrap_css: NETDATA.serverStatic + 'css/bootstrap-slate-flat-3.3.7.css?v20161229-1',
        dashboard_css: NETDATA.serverStatic + 'dashboard.slate.css?v20190902-0',
        background: '#272b30',
        foreground: '#C8C8C8',
        grid: '#283236',
        axis: '#283236',
        highlight: '#383838',
        /*          colors: [   '#55bb33', '#ff2222',   '#0099C6', '#faa11b',   '#adbce0', '#DDDD00',
                            '#4178ba', '#f58122',   '#a5cc39', '#f58667',   '#f5ef89', '#cf93c0',
                            '#a5d18a', '#b8539d',   '#3954a3', '#c8a9cf',   '#c7de8a', '#fad20a',
                            '#a6a479', '#a66da8' ],
        */
        colors: ['#66AA00', '#FE3912', '#3366CC', '#D66300', '#0099C6', '#DDDD00',
            '#5054e6', '#EE9911', '#BB44CC', '#e45757', '#ef0aef', '#CC7700',
            '#22AA99', '#109618', '#905bfd', '#f54882', '#4381bf', '#ff3737',
            '#329262', '#3B3EFF'],
        easypiechart_track: '#373b40',
        easypiechart_scale: '#373b40',
        gauge_pointer: '#474b50',
        gauge_stroke: '#373b40',
        gauge_gradient: false,
        d3pie: {
            title: '#C8C8C8',
            subtitle: '#283236',
            footer: '#283236',
            other: '#283236',
            mainlabel: '#C8C8C8',
            percentage: '#dddddd',
            value: '#cccc44',
            tooltip_bg: '#272b30',
            tooltip_fg: '#C8C8C8',
            segment_stroke: "#283236",
            gradient_color: '#000000'
        }
    }
};

if (typeof netdataTheme !== 'undefined' && typeof NETDATA.themes[netdataTheme] !== 'undefined') {
    NETDATA.themes.current = NETDATA.themes[netdataTheme];
} else {
    NETDATA.themes.current = NETDATA.themes.white;
}

NETDATA.colors = NETDATA.themes.current.colors;

// these are the colors Google Charts are using
// we have them here to attempt emulate their look and feel on the other chart libraries
// http://there4.io/2012/05/02/google-chart-color-list/
//NETDATA.colors        = [ '#3366CC', '#DC3912', '#FF9900', '#109618', '#990099', '#3B3EAC', '#0099C6',
//                      '#DD4477', '#66AA00', '#B82E2E', '#316395', '#994499', '#22AA99', '#AAAA11',
//                      '#6633CC', '#E67300', '#8B0707', '#329262', '#5574A6', '#3B3EAC' ];

// an alternative set
// http://www.mulinblog.com/a-color-palette-optimized-for-data-visualization/
//                         (blue)     (red)      (orange)   (green)    (pink)     (brown)    (purple)   (yellow)   (gray)
//NETDATA.colors        = [ '#5DA5DA', '#F15854', '#FAA43A', '#60BD68', '#F17CB0', '#B2912F', '#B276B2', '#DECF3F', '#4D4D4D' ];
// dygraph

// Codacy declarations
/* global smoothPlotter */
/* global Dygraph */

NETDATA.dygraph = {
    smooth: false
};

NETDATA.dygraphToolboxPanAndZoom = function (state, after, before) {
    if (after < state.netdata_first) {
        after = state.netdata_first;
    }

    if (before > state.netdata_last) {
        before = state.netdata_last;
    }

    state.setMode('zoom');
    NETDATA.globalSelectionSync.stop();
    NETDATA.globalSelectionSync.delay();
    state.tmp.dygraph_user_action = true;
    state.tmp.dygraph_force_zoom = true;
    // state.log('toolboxPanAndZoom');
    state.updateChartPanOrZoom(after, before);
    NETDATA.globalPanAndZoom.setMaster(state, after, before);
};

NETDATA.dygraphSetSelection = function (state, t) {
    if (typeof state.tmp.dygraph_instance !== 'undefined') {
        let r = state.calculateRowForTime(t);
        if (r !== -1) {
            state.tmp.dygraph_instance.setSelection(r);
            return true;
        } else {
            state.tmp.dygraph_instance.clearSelection();
            state.legendShowUndefined();
        }
    }

    return false;
};

NETDATA.dygraphClearSelection = function (state) {
    if (typeof state.tmp.dygraph_instance !== 'undefined') {
        state.tmp.dygraph_instance.clearSelection();
    }
    return true;
};

NETDATA.dygraphSmoothInitialize = function (callback) {
    $.ajax({
        url: NETDATA.dygraph_smooth_js,
        cache: true,
        dataType: "script",
        xhrFields: {withCredentials: true} // required for the cookie
    })
        .done(function () {
            NETDATA.dygraph.smooth = true;
            smoothPlotter.smoothing = 0.3;
        })
        .fail(function () {
            NETDATA.dygraph.smooth = false;
        })
        .always(function () {
            if (typeof callback === "function") {
                return callback();
            }
        });
};

NETDATA.dygraphInitialize = function (callback) {
    if (typeof netdataNoDygraphs === 'undefined' || !netdataNoDygraphs) {
        $.ajax({
            url: NETDATA.dygraph_js,
            cache: true,
            dataType: "script",
            xhrFields: {withCredentials: true} // required for the cookie
        })
            .done(function () {
                NETDATA.registerChartLibrary('dygraph', NETDATA.dygraph_js);
            })
            .fail(function () {
                NETDATA.chartLibraries.dygraph.enabled = false;
                NETDATA.error(100, NETDATA.dygraph_js);
            })
            .always(function () {
                if (NETDATA.chartLibraries.dygraph.enabled && NETDATA.options.current.smooth_plot) {
                    NETDATA.dygraphSmoothInitialize(callback);
                } else if (typeof callback === "function") {
                    return callback();
                }
            });
    } else {
        NETDATA.chartLibraries.dygraph.enabled = false;
        if (typeof callback === "function") {
            return callback();
        }
    }
};

NETDATA.dygraphChartUpdate = function (state, data) {
    let dygraph = state.tmp.dygraph_instance;

    if (typeof dygraph === 'undefined') {
        return NETDATA.dygraphChartCreate(state, data);
    }

    // when the chart is not visible, and hidden
    // if there is a window resize, dygraph detects
    // its element size as 0x0.
    // this will make it re-appear properly

    if (state.tm.last_unhidden > state.tmp.dygraph_last_rendered) {
        dygraph.resize();
    }

    let options = {
        file: data.result.data,
        colors: state.chartColors(),
        labels: data.result.labels,
        //labelsDivWidth: state.chartWidth() - 70,
        includeZero: state.tmp.dygraph_include_zero,
        visibility: state.dimensions_visibility.selected2BooleanArray(state.data.dimension_names)
    };

    if (state.tmp.dygraph_chart_type === 'stacked') {
        if (options.includeZero && state.dimensions_visibility.countSelected() < options.visibility.length) {
            options.includeZero = 0;
        }
    }

    if (!NETDATA.chartLibraries.dygraph.isSparkline(state)) {
        options.ylabel = state.units_current; // (state.units_desired === 'auto')?"":state.units_current;
    }

    if (state.tmp.dygraph_force_zoom) {
        if (NETDATA.options.debug.dygraph || state.debug) {
            state.log('dygraphChartUpdate() forced zoom update');
        }

        options.dateWindow = (state.requested_padding !== null) ? [state.view_after, state.view_before] : null;
        //options.isZoomedIgnoreProgrammaticZoom = true;
        state.tmp.dygraph_force_zoom = false;
    } else if (state.current.name !== 'auto') {
        if (NETDATA.options.debug.dygraph || state.debug) {
            state.log('dygraphChartUpdate() loose update');
        }
    } else {
        if (NETDATA.options.debug.dygraph || state.debug) {
            state.log('dygraphChartUpdate() strict update');
        }

        options.dateWindow = (state.requested_padding !== null) ? [state.view_after, state.view_before] : null;
        //options.isZoomedIgnoreProgrammaticZoom = true;
    }

    options.valueRange = state.tmp.dygraph_options.valueRange;

    let oldMax = null, oldMin = null;
    if (state.tmp.__commonMin !== null) {
        state.data.min = state.tmp.dygraph_instance.axes_[0].extremeRange[0];
        oldMin = options.valueRange[0] = NETDATA.commonMin.get(state);
    }
    if (state.tmp.__commonMax !== null) {
        state.data.max = state.tmp.dygraph_instance.axes_[0].extremeRange[1];
        oldMax = options.valueRange[1] = NETDATA.commonMax.get(state);
    }

    if (state.tmp.dygraph_smooth_eligible) {
        if ((NETDATA.options.current.smooth_plot && state.tmp.dygraph_options.plotter !== smoothPlotter)
            || (NETDATA.options.current.smooth_plot === false && state.tmp.dygraph_options.plotter === smoothPlotter)) {
            NETDATA.dygraphChartCreate(state, data);
            return;
        }
    }

    if (netdataSnapshotData !== null && NETDATA.globalPanAndZoom.isActive() && NETDATA.globalPanAndZoom.isMaster(state) === false) {
        // pan and zoom on snapshots
        options.dateWindow = [NETDATA.globalPanAndZoom.force_after_ms, NETDATA.globalPanAndZoom.force_before_ms];
        //options.isZoomedIgnoreProgrammaticZoom = true;
    }

    if (NETDATA.chartLibraries.dygraph.isLogScale(state)) {
        if (Array.isArray(options.valueRange) && options.valueRange[0] <= 0) {
            options.valueRange[0] = null;
        }
    }

    dygraph.updateOptions(options);

    let redraw = false;
    if (oldMin !== null && oldMin > state.tmp.dygraph_instance.axes_[0].extremeRange[0]) {
        state.data.min = state.tmp.dygraph_instance.axes_[0].extremeRange[0];
        options.valueRange[0] = NETDATA.commonMin.get(state);
        redraw = true;
    }
    if (oldMax !== null && oldMax < state.tmp.dygraph_instance.axes_[0].extremeRange[1]) {
        state.data.max = state.tmp.dygraph_instance.axes_[0].extremeRange[1];
        options.valueRange[1] = NETDATA.commonMax.get(state);
        redraw = true;
    }

    if (redraw) {
        // state.log('forcing redraw to adapt to common- min/max');
        dygraph.updateOptions(options);
    }

    state.tmp.dygraph_last_rendered = Date.now();
    return true;
};

NETDATA.dygraphChartCreate = function (state, data) {
    if (NETDATA.options.debug.dygraph || state.debug) {
        state.log('dygraphChartCreate()');
    }

    state.tmp.dygraph_chart_type = NETDATA.dataAttribute(state.element, 'dygraph-type', state.chart.chart_type);
    if (state.tmp.dygraph_chart_type === 'stacked' && data.dimensions === 1) {
        state.tmp.dygraph_chart_type = 'area';
    }
    if (state.tmp.dygraph_chart_type === 'stacked' && NETDATA.chartLibraries.dygraph.isLogScale(state)) {
        state.tmp.dygraph_chart_type = 'area';
    }

    let highlightCircleSize = NETDATA.chartLibraries.dygraph.isSparkline(state) ? 3 : 4;

    let smooth = NETDATA.dygraph.smooth
        ? (NETDATA.dataAttributeBoolean(state.element, 'dygraph-smooth', (state.tmp.dygraph_chart_type === 'line' && NETDATA.chartLibraries.dygraph.isSparkline(state) === false)))
        : false;

    state.tmp.dygraph_include_zero = NETDATA.dataAttribute(state.element, 'dygraph-includezero', (state.tmp.dygraph_chart_type === 'stacked'));
    let drawAxis = NETDATA.dataAttributeBoolean(state.element, 'dygraph-drawaxis', true);

    state.tmp.dygraph_options = {
        colors: NETDATA.dataAttribute(state.element, 'dygraph-colors', state.chartColors()),

        // leave a few pixels empty on the right of the chart
        rightGap: NETDATA.dataAttribute(state.element, 'dygraph-rightgap', 5),
        showRangeSelector: NETDATA.dataAttributeBoolean(state.element, 'dygraph-showrangeselector', false),
        showRoller: NETDATA.dataAttributeBoolean(state.element, 'dygraph-showroller', false),
        title: NETDATA.dataAttribute(state.element, 'dygraph-title', state.title),
        titleHeight: NETDATA.dataAttribute(state.element, 'dygraph-titleheight', 19),
        legend: NETDATA.dataAttribute(state.element, 'dygraph-legend', 'always'), // we need this to get selection events
        labels: data.result.labels,
        labelsDiv: NETDATA.dataAttribute(state.element, 'dygraph-labelsdiv', state.element_legend_childs.hidden),
        //labelsDivStyles:        NETDATA.dataAttribute(state.element, 'dygraph-labelsdivstyles', { 'fontSize':'1px' }),
        //labelsDivWidth:         NETDATA.dataAttribute(state.element, 'dygraph-labelsdivwidth', state.chartWidth() - 70),
        labelsSeparateLines: NETDATA.dataAttributeBoolean(state.element, 'dygraph-labelsseparatelines', true),
        labelsShowZeroValues: NETDATA.chartLibraries.dygraph.isLogScale(state) ? false : NETDATA.dataAttributeBoolean(state.element, 'dygraph-labelsshowzerovalues', true),
        labelsKMB: false,
        labelsKMG2: false,
        showLabelsOnHighlight: NETDATA.dataAttributeBoolean(state.element, 'dygraph-showlabelsonhighlight', true),
        hideOverlayOnMouseOut: NETDATA.dataAttributeBoolean(state.element, 'dygraph-hideoverlayonmouseout', true),
        includeZero: state.tmp.dygraph_include_zero,
        xRangePad: NETDATA.dataAttribute(state.element, 'dygraph-xrangepad', 0),
        yRangePad: NETDATA.dataAttribute(state.element, 'dygraph-yrangepad', 1),
        valueRange: NETDATA.dataAttribute(state.element, 'dygraph-valuerange', [null, null]),
        ylabel: state.units_current, // (state.units_desired === 'auto')?"":state.units_current,
        yLabelWidth: NETDATA.dataAttribute(state.element, 'dygraph-ylabelwidth', 12),

        // the function to plot the chart
        plotter: null,

        // The width of the lines connecting data points.
        // This can be used to increase the contrast or some graphs.
        strokeWidth: NETDATA.dataAttribute(state.element, 'dygraph-strokewidth', ((state.tmp.dygraph_chart_type === 'stacked') ? 0.1 : ((smooth === true) ? 1.5 : 0.7))),
        strokePattern: NETDATA.dataAttribute(state.element, 'dygraph-strokepattern', undefined),

        // The size of the dot to draw on each point in pixels (see drawPoints).
        // A dot is always drawn when a point is "isolated",
        // i.e. there is a missing point on either side of it.
        // This also controls the size of those dots.
        drawPoints: NETDATA.dataAttributeBoolean(state.element, 'dygraph-drawpoints', false),

        // Draw points at the edges of gaps in the data.
        // This improves visibility of small data segments or other data irregularities.
        drawGapEdgePoints: NETDATA.dataAttributeBoolean(state.element, 'dygraph-drawgapedgepoints', true),
        connectSeparatedPoints: NETDATA.chartLibraries.dygraph.isLogScale(state) ? false : NETDATA.dataAttributeBoolean(state.element, 'dygraph-connectseparatedpoints', false),
        pointSize: NETDATA.dataAttribute(state.element, 'dygraph-pointsize', 1),

        // enabling this makes the chart with little square lines
        stepPlot: NETDATA.dataAttributeBoolean(state.element, 'dygraph-stepplot', false),

        // Draw a border around graph lines to make crossing lines more easily
        // distinguishable. Useful for graphs with many lines.
        strokeBorderColor: NETDATA.dataAttribute(state.element, 'dygraph-strokebordercolor', NETDATA.themes.current.background),
        strokeBorderWidth: NETDATA.dataAttribute(state.element, 'dygraph-strokeborderwidth', (state.tmp.dygraph_chart_type === 'stacked') ? 0.0 : 0.0),
        fillGraph: NETDATA.dataAttribute(state.element, 'dygraph-fillgraph', (state.tmp.dygraph_chart_type === 'area' || state.tmp.dygraph_chart_type === 'stacked')),
        fillAlpha: NETDATA.dataAttribute(state.element, 'dygraph-fillalpha',
            ((state.tmp.dygraph_chart_type === 'stacked')
                ? NETDATA.options.current.color_fill_opacity_stacked
                : NETDATA.options.current.color_fill_opacity_area)
        ),
        stackedGraph: NETDATA.dataAttribute(state.element, 'dygraph-stackedgraph', (state.tmp.dygraph_chart_type === 'stacked')),
        stackedGraphNaNFill: NETDATA.dataAttribute(state.element, 'dygraph-stackedgraphnanfill', 'none'),
        drawAxis: drawAxis,
        axisLabelFontSize: NETDATA.dataAttribute(state.element, 'dygraph-axislabelfontsize', 10),
        axisLineColor: NETDATA.dataAttribute(state.element, 'dygraph-axislinecolor', NETDATA.themes.current.axis),
        axisLineWidth: NETDATA.dataAttribute(state.element, 'dygraph-axislinewidth', 1.0),
        drawGrid: NETDATA.dataAttributeBoolean(state.element, 'dygraph-drawgrid', true),
        gridLinePattern: NETDATA.dataAttribute(state.element, 'dygraph-gridlinepattern', null),
        gridLineWidth: NETDATA.dataAttribute(state.element, 'dygraph-gridlinewidth', 1.0),
        gridLineColor: NETDATA.dataAttribute(state.element, 'dygraph-gridlinecolor', NETDATA.themes.current.grid),
        maxNumberWidth: NETDATA.dataAttribute(state.element, 'dygraph-maxnumberwidth', 8),
        sigFigs: NETDATA.dataAttribute(state.element, 'dygraph-sigfigs', null),
        digitsAfterDecimal: NETDATA.dataAttribute(state.element, 'dygraph-digitsafterdecimal', 2),
        valueFormatter: NETDATA.dataAttribute(state.element, 'dygraph-valueformatter', undefined),
        highlightCircleSize: NETDATA.dataAttribute(state.element, 'dygraph-highlightcirclesize', highlightCircleSize),
        highlightSeriesOpts: NETDATA.dataAttribute(state.element, 'dygraph-highlightseriesopts', null), // TOO SLOW: { strokeWidth: 1.5 },
        highlightSeriesBackgroundAlpha: NETDATA.dataAttribute(state.element, 'dygraph-highlightseriesbackgroundalpha', null), // TOO SLOW: (state.tmp.dygraph_chart_type === 'stacked')?0.7:0.5,
        pointClickCallback: NETDATA.dataAttribute(state.element, 'dygraph-pointclickcallback', undefined),
        visibility: state.dimensions_visibility.selected2BooleanArray(state.data.dimension_names),
        logscale: NETDATA.chartLibraries.dygraph.isLogScale(state) ? 'y' : undefined,

        axes: {
            x: {
                pixelsPerLabel: NETDATA.dataAttribute(state.element, 'dygraph-xpixelsperlabel', 50),
                ticker: Dygraph.dateTicker,
                axisLabelWidth: NETDATA.dataAttribute(state.element, 'dygraph-xaxislabelwidth', 60),
                drawAxis: NETDATA.dataAttributeBoolean(state.element, 'dygraph-drawxaxis', drawAxis),
                axisLabelFormatter: function (d, gran) {
                    void(gran);
                    return NETDATA.dateTime.xAxisTimeString(d);
                }
            },
            y: {
                logscale: NETDATA.chartLibraries.dygraph.isLogScale(state) ? true : undefined,
                pixelsPerLabel: NETDATA.dataAttribute(state.element, 'dygraph-ypixelsperlabel', 15),
                axisLabelWidth: NETDATA.dataAttribute(state.element, 'dygraph-yaxislabelwidth', 50),
                drawAxis: NETDATA.dataAttributeBoolean(state.element, 'dygraph-drawyaxis', drawAxis),
                axisLabelFormatter: function (y) {

                    // unfortunately, we have to call this every single time
                    state.legendFormatValueDecimalsFromMinMax(
                        this.axes_[0].extremeRange[0],
                        this.axes_[0].extremeRange[1]
                    );

                    let old_units = this.user_attrs_.ylabel;
                    let v = state.legendFormatValue(y);
                    let new_units = state.units_current;

                    if (state.units_desired === 'auto' && typeof old_units !== 'undefined' && new_units !== old_units && !NETDATA.chartLibraries.dygraph.isSparkline(state)) {
                        // console.log(this);
                        // state.log('units discrepancy: old = ' + old_units + ', new = ' + new_units);
                        let len = this.plugins_.length;
                        while (len--) {
                            // console.log(this.plugins_[len]);
                            if (typeof this.plugins_[len].plugin.ylabel_div_ !== 'undefined'
                                && this.plugins_[len].plugin.ylabel_div_ !== null
                                && typeof this.plugins_[len].plugin.ylabel_div_.children !== 'undefined'
                                && this.plugins_[len].plugin.ylabel_div_.children !== null
                                && typeof this.plugins_[len].plugin.ylabel_div_.children[0].children !== 'undefined'
                                && this.plugins_[len].plugin.ylabel_div_.children[0].children !== null
                            ) {
                                this.plugins_[len].plugin.ylabel_div_.children[0].children[0].innerHTML = new_units;
                                this.user_attrs_.ylabel = new_units;
                                break;
                            }
                        }

                        if (len < 0) {
                            state.log('units discrepancy, but cannot find dygraphs div to change: old = ' + old_units + ', new = ' + new_units);
                        }
                    }

                    return v;
                }
            }
        },
        legendFormatter: function (data) {
            if (state.tmp.dygraph_mouse_down) {
                return;
            }

            let elements = state.element_legend_childs;

            // if the hidden div is not there
            // we are not managing the legend
            if (elements.hidden === null) {
                return;
            }

            if (typeof data.x !== 'undefined') {
                state.legendSetDate(data.x);
                let i = data.series.length;
                while (i--) {
                    let series = data.series[i];
                    if (series.isVisible) {
                        state.legendSetLabelValue(series.label, series.y);
                    } else {
                        state.legendSetLabelValue(series.label, null);
                    }
                }
            }

            return '';
        },
        drawCallback: function (dygraph, is_initial) {

            // the user has panned the chart and this is called to re-draw the chart
            // 1. refresh this chart by adding data to it
            // 2. notify all the other charts about the update they need

            // to prevent an infinite loop (feedback), we use
            //     state.tmp.dygraph_user_action
            // - when true, this is initiated by a user
            // - when false, this is feedback

            if (state.current.name !== 'auto' && state.tmp.dygraph_user_action) {
                state.tmp.dygraph_user_action = false;

                let x_range = dygraph.xAxisRange();
                let after = Math.round(x_range[0]);
                let before = Math.round(x_range[1]);

                if (NETDATA.options.debug.dygraph) {
                    state.log('dygraphDrawCallback(dygraph, ' + is_initial + '): mode ' + state.current.name + ' ' + (after / 1000).toString() + ' - ' + (before / 1000).toString());
                    //console.log(state);
                }

                if (before <= state.netdata_last && after >= state.netdata_first) {
                    // update only when we are within the data limits
                    state.updateChartPanOrZoom(after, before);
                }
            }
        },
        zoomCallback: function (minDate, maxDate, yRanges) {

            // the user has selected a range on the chart
            // 1. refresh this chart by adding data to it
            // 2. notify all the other charts about the update they need

            void(yRanges);

            if (NETDATA.options.debug.dygraph) {
                state.log('dygraphZoomCallback(): ' + state.current.name);
            }

            NETDATA.globalSelectionSync.stop();
            NETDATA.globalSelectionSync.delay();
            state.setMode('zoom');

            // refresh it to the greatest possible zoom level
            state.tmp.dygraph_user_action = true;
            state.tmp.dygraph_force_zoom = true;
            state.updateChartPanOrZoom(minDate, maxDate);
        },
        highlightCallback: function (event, x, points, row, seriesName) {
            void(seriesName);

            state.pauseChart();

            // there is a bug in dygraph when the chart is zoomed enough
            // the time it thinks is selected is wrong
            // here we calculate the time t based on the row number selected
            // which is ok
            // let t = state.data_after + row * state.data_update_every;
            // console.log('row = ' + row + ', x = ' + x + ', t = ' + t + ' ' + ((t === x)?'SAME':(Math.abs(x-t)<=state.data_update_every)?'SIMILAR':'DIFFERENT') + ', rows in db: ' + state.data_points + ' visible(x) = ' + state.timeIsVisible(x) + ' visible(t) = ' + state.timeIsVisible(t) + ' r(x) = ' + state.calculateRowForTime(x) + ' r(t) = ' + state.calculateRowForTime(t) + ' range: ' + state.data_after + ' - ' + state.data_before + ' real: ' + state.data.after + ' - ' + state.data.before + ' every: ' + state.data_update_every);

            if (state.tmp.dygraph_mouse_down !== true) {
                NETDATA.globalSelectionSync.sync(state, x);
            }

            // fix legend zIndex using the internal structures of dygraph legend module
            // this works, but it is a hack!
            // state.tmp.dygraph_instance.plugins_[0].plugin.legend_div_.style.zIndex = 10000;
        },
        unhighlightCallback: function (event) {
            void(event);

            if (state.tmp.dygraph_mouse_down) {
                return;
            }

            if (NETDATA.options.debug.dygraph || state.debug) {
                state.log('dygraphUnhighlightCallback()');
            }

            state.unpauseChart();
            NETDATA.globalSelectionSync.stop();
        },
        underlayCallback: function (canvas, area, g) {
            // the chart is about to be drawn

            // update history_tip_element
            if (state.tmp.dygraph_history_tip_element) {
                const xHookRightSide = g.toDomXCoord(state.netdata_first);
                if (xHookRightSide > area.x) {
                    state.tmp.dygraph_history_tip_element_displayed = true;
                    // group the styles for possible better performance
                    state.tmp.dygraph_history_tip_element.setAttribute(
                      'style',
                      `display: block; left: ${area.x}px; right: calc(100% - ${xHookRightSide}px);`
                    )
                } else {
                    if (state.tmp.dygraph_history_tip_element_displayed) {
                        // additional check just for performance
                        // don't update the DOM when it's not needed
                        state.tmp.dygraph_history_tip_element.style.display = 'none';
                        state.tmp.dygraph_history_tip_element_displayed = false;
                    }
                }
            }

            // this function renders global highlighted time-frame

            if (NETDATA.globalChartUnderlay.isActive()) {
                let after = NETDATA.globalChartUnderlay.after;
                let before = NETDATA.globalChartUnderlay.before;

                if (after < state.view_after) {
                    after = state.view_after;
                }

                if (before > state.view_before) {
                    before = state.view_before;
                }

                if (after < before) {
                    let bottom_left = g.toDomCoords(after, -20);
                    let top_right = g.toDomCoords(before, +20);

                    let left = bottom_left[0];
                    let right = top_right[0];

                    canvas.fillStyle = NETDATA.themes.current.highlight;
                    canvas.fillRect(left, area.y, right - left, area.h);
                }
            }
        },
        interactionModel: {
            mousedown: function (event, dygraph, context) {
                if (NETDATA.options.debug.dygraph || state.debug) {
                    state.log('interactionModel.mousedown()');
                }

                state.tmp.dygraph_user_action = true;

                if (NETDATA.options.debug.dygraph) {
                    state.log('dygraphMouseDown()');
                }

                // Right-click should not initiate anything.
                if (event.button && event.button === 2) {
                    return;
                }

                NETDATA.globalSelectionSync.stop();
                NETDATA.globalSelectionSync.delay();

                state.tmp.dygraph_mouse_down = true;
                context.initializeMouseDown(event, dygraph, context);

                //console.log(event);
                if (event.button && event.button === 1) {
                    if (event.shiftKey) {
                        //console.log('middle mouse button dragging (PAN)');

                        state.setMode('pan');
                        // NETDATA.globalSelectionSync.delay();
                        state.tmp.dygraph_highlight_after = null;
                        Dygraph.startPan(event, dygraph, context);
                    } else if (event.altKey || event.ctrlKey || event.metaKey) {
                        //console.log('middle mouse button highlight');

                        if (!(event.offsetX && event.offsetY)) {
                            event.offsetX = event.layerX - event.target.offsetLeft;
                            event.offsetY = event.layerY - event.target.offsetTop;
                        }
                        state.tmp.dygraph_highlight_after = dygraph.toDataXCoord(event.offsetX);
                        Dygraph.startZoom(event, dygraph, context);
                    } else {
                        //console.log('middle mouse button selection for zoom (ZOOM)');

                        state.setMode('zoom');
                        // NETDATA.globalSelectionSync.delay();
                        state.tmp.dygraph_highlight_after = null;
                        Dygraph.startZoom(event, dygraph, context);
                    }
                } else {
                    if (event.shiftKey) {
                        //console.log('left mouse button selection for zoom (ZOOM)');

                        state.setMode('zoom');
                        // NETDATA.globalSelectionSync.delay();
                        state.tmp.dygraph_highlight_after = null;
                        Dygraph.startZoom(event, dygraph, context);
                    } else if (event.altKey || event.ctrlKey || event.metaKey) {
                        //console.log('left mouse button highlight');

                        if (!(event.offsetX && event.offsetY)) {
                            event.offsetX = event.layerX - event.target.offsetLeft;
                            event.offsetY = event.layerY - event.target.offsetTop;
                        }
                        state.tmp.dygraph_highlight_after = dygraph.toDataXCoord(event.offsetX);
                        Dygraph.startZoom(event, dygraph, context);
                    } else {
                        //console.log('left mouse button dragging (PAN)');

                        state.setMode('pan');
                        // NETDATA.globalSelectionSync.delay();
                        state.tmp.dygraph_highlight_after = null;
                        Dygraph.startPan(event, dygraph, context);
                    }
                }
            },
            mousemove: function (event, dygraph, context) {
                if (NETDATA.options.debug.dygraph || state.debug) {
                    state.log('interactionModel.mousemove()');
                }

                if (state.tmp.dygraph_highlight_after !== null) {
                    //console.log('highlight selection...');

                    NETDATA.globalSelectionSync.stop();
                    NETDATA.globalSelectionSync.delay();

                    state.tmp.dygraph_user_action = true;
                    Dygraph.moveZoom(event, dygraph, context);
                    event.preventDefault();
                } else if (context.isPanning) {
                    //console.log('panning...');

                    NETDATA.globalSelectionSync.stop();
                    NETDATA.globalSelectionSync.delay();

                    state.tmp.dygraph_user_action = true;
                    //NETDATA.globalSelectionSync.stop();
                    //NETDATA.globalSelectionSync.delay();
                    state.setMode('pan');
                    context.is2DPan = false;
                    Dygraph.movePan(event, dygraph, context);
                } else if (context.isZooming) {
                    //console.log('zooming...');

                    NETDATA.globalSelectionSync.stop();
                    NETDATA.globalSelectionSync.delay();

                    state.tmp.dygraph_user_action = true;
                    //NETDATA.globalSelectionSync.stop();
                    //NETDATA.globalSelectionSync.delay();
                    state.setMode('zoom');
                    Dygraph.moveZoom(event, dygraph, context);
                }
            },
            mouseup: function (event, dygraph, context) {
                state.tmp.dygraph_mouse_down = false;

                if (NETDATA.options.debug.dygraph || state.debug) {
                    state.log('interactionModel.mouseup()');
                }

                if (state.tmp.dygraph_highlight_after !== null) {
                    //console.log('done highlight selection');

                    NETDATA.globalSelectionSync.stop();
                    NETDATA.globalSelectionSync.delay();

                    if (!(event.offsetX && event.offsetY)) {
                        event.offsetX = event.layerX - event.target.offsetLeft;
                        event.offsetY = event.layerY - event.target.offsetTop;
                    }

                    NETDATA.globalChartUnderlay.set(state
                        , state.tmp.dygraph_highlight_after
                        , dygraph.toDataXCoord(event.offsetX)
                        , state.view_after
                        , state.view_before
                    );

                    state.tmp.dygraph_highlight_after = null;

                    context.isZooming = false;
                    dygraph.clearZoomRect_();
                    dygraph.drawGraph_(false);

                    // refresh all the charts immediately
                    NETDATA.options.auto_refresher_stop_until = 0;
                } else if (context.isPanning) {
                    //console.log('done panning');

                    NETDATA.globalSelectionSync.stop();
                    NETDATA.globalSelectionSync.delay();

                    state.tmp.dygraph_user_action = true;
                    Dygraph.endPan(event, dygraph, context);

                    // refresh all the charts immediately
                    NETDATA.options.auto_refresher_stop_until = 0;
                } else if (context.isZooming) {
                    //console.log('done zomming');

                    NETDATA.globalSelectionSync.stop();
                    NETDATA.globalSelectionSync.delay();

                    state.tmp.dygraph_user_action = true;
                    Dygraph.endZoom(event, dygraph, context);

                    // refresh all the charts immediately
                    NETDATA.options.auto_refresher_stop_until = 0;
                }
            },
            click: function (event, dygraph, context) {
                void(dygraph);
                void(context);

                if (NETDATA.options.debug.dygraph || state.debug) {
                    state.log('interactionModel.click()');
                }

                event.preventDefault();
            },
            dblclick: function (event, dygraph, context) {
                void(event);
                void(dygraph);
                void(context);

                if (NETDATA.options.debug.dygraph || state.debug) {
                    state.log('interactionModel.dblclick()');
                }
                NETDATA.resetAllCharts(state);
            },
            wheel: function (event, dygraph, context) {
                void(context);

                if (NETDATA.options.debug.dygraph || state.debug) {
                    state.log('interactionModel.wheel()');
                }

                // Take the offset of a mouse event on the dygraph canvas and
                // convert it to a pair of percentages from the bottom left.
                // (Not top left, bottom is where the lower value is.)
                function offsetToPercentage(g, offsetX, offsetY) {
                    // This is calculating the pixel offset of the leftmost date.
                    let xOffset = g.toDomCoords(g.xAxisRange()[0], null)[0];
                    let yar0 = g.yAxisRange(0);

                    // This is calculating the pixel of the highest value. (Top pixel)
                    let yOffset = g.toDomCoords(null, yar0[1])[1];

                    // x y w and h are relative to the corner of the drawing area,
                    // so that the upper corner of the drawing area is (0, 0).
                    let x = offsetX - xOffset;
                    let y = offsetY - yOffset;

                    // This is computing the rightmost pixel, effectively defining the
                    // width.
                    let w = g.toDomCoords(g.xAxisRange()[1], null)[0] - xOffset;

                    // This is computing the lowest pixel, effectively defining the height.
                    let h = g.toDomCoords(null, yar0[0])[1] - yOffset;

                    // Percentage from the left.
                    let xPct = w === 0 ? 0 : (x / w);
                    // Percentage from the top.
                    let yPct = h === 0 ? 0 : (y / h);

                    // The (1-) part below changes it from "% distance down from the top"
                    // to "% distance up from the bottom".
                    return [xPct, (1 - yPct)];
                }

                // Adjusts [x, y] toward each other by zoomInPercentage%
                // Split it so the left/bottom axis gets xBias/yBias of that change and
                // tight/top gets (1-xBias)/(1-yBias) of that change.
                //
                // If a bias is missing it splits it down the middle.
                function zoomRange(g, zoomInPercentage, xBias, yBias) {
                    xBias = xBias || 0.5;
                    yBias = yBias || 0.5;

                    function adjustAxis(axis, zoomInPercentage, bias) {
                        let delta = axis[1] - axis[0];
                        let increment = delta * zoomInPercentage;
                        let foo = [increment * bias, increment * (1 - bias)];

                        return [axis[0] + foo[0], axis[1] - foo[1]];
                    }

                    let yAxes = g.yAxisRanges();
                    let newYAxes = [];
                    for (let i = 0; i < yAxes.length; i++) {
                        newYAxes[i] = adjustAxis(yAxes[i], zoomInPercentage, yBias);
                    }

                    return adjustAxis(g.xAxisRange(), zoomInPercentage, xBias);
                }

                if (event.altKey || event.shiftKey) {
                    state.tmp.dygraph_user_action = true;

                    NETDATA.globalSelectionSync.stop();
                    NETDATA.globalSelectionSync.delay();

                    // http://dygraphs.com/gallery/interaction-api.js
                    let normal_def;
                    if (typeof event.wheelDelta === 'number' && !isNaN(event.wheelDelta))
                    // chrome
                    {
                        normal_def = event.wheelDelta / 40;
                    } else
                    // firefox
                    {
                        normal_def = event.deltaY * -1.2;
                    }

                    let normal = (event.detail) ? event.detail * -1 : normal_def;
                    let percentage = normal / 50;

                    if (!(event.offsetX && event.offsetY)) {
                        event.offsetX = event.layerX - event.target.offsetLeft;
                        event.offsetY = event.layerY - event.target.offsetTop;
                    }

                    let percentages = offsetToPercentage(dygraph, event.offsetX, event.offsetY);
                    let xPct = percentages[0];
                    let yPct = percentages[1];

                    let new_x_range = zoomRange(dygraph, percentage, xPct, yPct);
                    let after = new_x_range[0];
                    let before = new_x_range[1];

                    let first = state.netdata_first + state.data_update_every;
                    let last = state.netdata_last + state.data_update_every;

                    if (before > last) {
                        after -= (before - last);
                        before = last;
                    }
                    if (after < first) {
                        after = first;
                    }

                    state.setMode('zoom');
                    state.updateChartPanOrZoom(after, before, function () {
                        dygraph.updateOptions({dateWindow: [after, before]});
                    });

                    event.preventDefault();
                }
            },
            touchstart: function (event, dygraph, context) {
                state.tmp.dygraph_mouse_down = true;

                if (NETDATA.options.debug.dygraph || state.debug) {
                    state.log('interactionModel.touchstart()');
                }

                state.tmp.dygraph_user_action = true;
                state.setMode('zoom');
                state.pauseChart();

                NETDATA.globalSelectionSync.stop();
                NETDATA.globalSelectionSync.delay();

                Dygraph.defaultInteractionModel.touchstart(event, dygraph, context);

                // we overwrite the touch directions at the end, to overwrite
                // the internal default of dygraph
                context.touchDirections = {x: true, y: false};

                state.dygraph_last_touch_start = Date.now();
                state.dygraph_last_touch_move = 0;

                if (typeof event.touches[0].pageX === 'number') {
                    state.dygraph_last_touch_page_x = event.touches[0].pageX;
                } else {
                    state.dygraph_last_touch_page_x = 0;
                }
            },
            touchmove: function (event, dygraph, context) {
                if (NETDATA.options.debug.dygraph || state.debug) {
                    state.log('interactionModel.touchmove()');
                }

                NETDATA.globalSelectionSync.stop();
                NETDATA.globalSelectionSync.delay();

                state.tmp.dygraph_user_action = true;
                Dygraph.defaultInteractionModel.touchmove(event, dygraph, context);

                state.dygraph_last_touch_move = Date.now();
            },
            touchend: function (event, dygraph, context) {
                state.tmp.dygraph_mouse_down = false;

                if (NETDATA.options.debug.dygraph || state.debug) {
                    state.log('interactionModel.touchend()');
                }

                NETDATA.globalSelectionSync.stop();
                NETDATA.globalSelectionSync.delay();

                state.tmp.dygraph_user_action = true;
                Dygraph.defaultInteractionModel.touchend(event, dygraph, context);

                // if it didn't move, it is a selection
                if (state.dygraph_last_touch_move === 0 && state.dygraph_last_touch_page_x !== 0) {
                    NETDATA.globalSelectionSync.dontSyncBefore = 0;
                    NETDATA.globalSelectionSync.setMaster(state);

                    // internal api of dygraph
                    let pct = (state.dygraph_last_touch_page_x - (dygraph.plotter_.area.x + state.element.getBoundingClientRect().left)) / dygraph.plotter_.area.w;
                    console.log('pct: ' + pct.toString());

                    let t = Math.round(state.view_after + (state.view_before - state.view_after) * pct);
                    if (NETDATA.dygraphSetSelection(state, t)) {
                        NETDATA.globalSelectionSync.sync(state, t);
                    }
                }

                // if it was double tap within double click time, reset the charts
                let now = Date.now();
                if (typeof state.dygraph_last_touch_end !== 'undefined') {
                    if (state.dygraph_last_touch_move === 0) {
                        let dt = now - state.dygraph_last_touch_end;
                        if (dt <= NETDATA.options.current.double_click_speed) {
                            NETDATA.resetAllCharts(state);
                        }
                    }
                }

                // remember the timestamp of the last touch end
                state.dygraph_last_touch_end = now;

                // refresh all the charts immediately
                NETDATA.options.auto_refresher_stop_until = 0;
            }
        }
    };

    if (NETDATA.chartLibraries.dygraph.isLogScale(state)) {
        if (Array.isArray(state.tmp.dygraph_options.valueRange) && state.tmp.dygraph_options.valueRange[0] <= 0) {
            state.tmp.dygraph_options.valueRange[0] = null;
        }
    }

    if (NETDATA.chartLibraries.dygraph.isSparkline(state)) {
        state.tmp.dygraph_options.drawGrid = false;
        state.tmp.dygraph_options.drawAxis = false;
        state.tmp.dygraph_options.title = undefined;
        state.tmp.dygraph_options.ylabel = undefined;
        state.tmp.dygraph_options.yLabelWidth = 0;
        //state.tmp.dygraph_options.labelsDivWidth = 120;
        //state.tmp.dygraph_options.labelsDivStyles.width = '120px';
        state.tmp.dygraph_options.labelsSeparateLines = true;
        state.tmp.dygraph_options.rightGap = 0;
        state.tmp.dygraph_options.yRangePad = 1;
        state.tmp.dygraph_options.axes.x.drawAxis = false;
        state.tmp.dygraph_options.axes.y.drawAxis = false;
    }

    if (smooth) {
        state.tmp.dygraph_smooth_eligible = true;

        if (NETDATA.options.current.smooth_plot) {
            state.tmp.dygraph_options.plotter = smoothPlotter;
        }
    }
    else {
        state.tmp.dygraph_smooth_eligible = false;
    }

    if (netdataSnapshotData !== null && NETDATA.globalPanAndZoom.isActive() && NETDATA.globalPanAndZoom.isMaster(state) === false) {
        // pan and zoom on snapshots
        state.tmp.dygraph_options.dateWindow = [NETDATA.globalPanAndZoom.force_after_ms, NETDATA.globalPanAndZoom.force_before_ms];
        //state.tmp.dygraph_options.isZoomedIgnoreProgrammaticZoom = true;
    }

    state.tmp.dygraph_instance = new Dygraph(state.element_chart,
        data.result.data, state.tmp.dygraph_options);


    state.tmp.dygraph_history_tip_element = document.createElement('div');
    state.tmp.dygraph_history_tip_element.innerHTML = `
        <span class="dygraph__history-tip-content">
          是否想扩展您的实时指标历史？
          <br />
           <a href="https://docs.netdata.cloud/docs/configuration-guide/#increase-the-metrics-retention-period" target=_blank>
             Configure Netdata's <b>history</b></a>
           or use the <a href="https://docs.netdata.cloud/database/engine/" target=_blank>DB engine</a>.
        </span>
    `;
    state.tmp.dygraph_history_tip_element.className = 'dygraph__history-tip';
    state.element_chart.appendChild(state.tmp.dygraph_history_tip_element);


    state.tmp.dygraph_force_zoom = false;
    state.tmp.dygraph_user_action = false;
    state.tmp.dygraph_last_rendered = Date.now();
    state.tmp.dygraph_highlight_after = null;

    if (state.tmp.dygraph_options.valueRange[0] === null && state.tmp.dygraph_options.valueRange[1] === null) {
        if (typeof state.tmp.dygraph_instance.axes_[0].extremeRange !== 'undefined') {
            state.tmp.__commonMin = NETDATA.dataAttribute(state.element, 'common-min', null);
            state.tmp.__commonMax = NETDATA.dataAttribute(state.element, 'common-max', null);
        } else {
            state.log('检测到不兼容的Dygraph版本');
            state.tmp.__commonMin = null;
            state.tmp.__commonMax = null;
        }
    } else {
        // if the user gave a valueRange, respect it
        state.tmp.__commonMin = null;
        state.tmp.__commonMax = null;
    }

    return true;
};
// ----------------------------------------------------------------------------------------------------------------
// sparkline

NETDATA.sparklineInitialize = function (callback) {
    if (typeof netdataNoSparklines === 'undefined' || !netdataNoSparklines) {
        $.ajax({
            url: NETDATA.sparkline_js,
            cache: true,
            dataType: "script",
            xhrFields: {withCredentials: true} // required for the cookie
        })
            .done(function () {
                NETDATA.registerChartLibrary('sparkline', NETDATA.sparkline_js);
            })
            .fail(function () {
                NETDATA.chartLibraries.sparkline.enabled = false;
                NETDATA.error(100, NETDATA.sparkline_js);
            })
            .always(function () {
                if (typeof callback === "function") {
                    return callback();
                }
            });
    } else {
        NETDATA.chartLibraries.sparkline.enabled = false;
        if (typeof callback === "function") {
            return callback();
        }
    }
};

NETDATA.sparklineChartUpdate = function (state, data) {
    state.sparkline_options.width = state.chartWidth();
    state.sparkline_options.height = state.chartHeight();

    $(state.element_chart).sparkline(data.result, state.sparkline_options);
    return true;
};

NETDATA.sparklineChartCreate = function (state, data) {
    let type = NETDATA.dataAttribute(state.element, 'sparkline-type', 'line');
    let lineColor = NETDATA.dataAttribute(state.element, 'sparkline-linecolor', state.chartCustomColors()[0]);
    let fillColor = NETDATA.dataAttribute(state.element, 'sparkline-fillcolor', ((state.chart.chart_type === 'line') ? NETDATA.themes.current.background : NETDATA.colorLuminance(lineColor, NETDATA.chartDefaults.fill_luminance)));
    let chartRangeMin = NETDATA.dataAttribute(state.element, 'sparkline-chartrangemin', undefined);
    let chartRangeMax = NETDATA.dataAttribute(state.element, 'sparkline-chartrangemax', undefined);
    let composite = NETDATA.dataAttribute(state.element, 'sparkline-composite', undefined);
    let enableTagOptions = NETDATA.dataAttribute(state.element, 'sparkline-enabletagoptions', undefined);
    let tagOptionPrefix = NETDATA.dataAttribute(state.element, 'sparkline-tagoptionprefix', undefined);
    let tagValuesAttribute = NETDATA.dataAttribute(state.element, 'sparkline-tagvaluesattribute', undefined);
    let disableHiddenCheck = NETDATA.dataAttribute(state.element, 'sparkline-disablehiddencheck', undefined);
    let defaultPixelsPerValue = NETDATA.dataAttribute(state.element, 'sparkline-defaultpixelspervalue', undefined);
    let spotColor = NETDATA.dataAttribute(state.element, 'sparkline-spotcolor', undefined);
    let minSpotColor = NETDATA.dataAttribute(state.element, 'sparkline-minspotcolor', undefined);
    let maxSpotColor = NETDATA.dataAttribute(state.element, 'sparkline-maxspotcolor', undefined);
    let spotRadius = NETDATA.dataAttribute(state.element, 'sparkline-spotradius', undefined);
    let valueSpots = NETDATA.dataAttribute(state.element, 'sparkline-valuespots', undefined);
    let highlightSpotColor = NETDATA.dataAttribute(state.element, 'sparkline-highlightspotcolor', undefined);
    let highlightLineColor = NETDATA.dataAttribute(state.element, 'sparkline-highlightlinecolor', undefined);
    let lineWidth = NETDATA.dataAttribute(state.element, 'sparkline-linewidth', undefined);
    let normalRangeMin = NETDATA.dataAttribute(state.element, 'sparkline-normalrangemin', undefined);
    let normalRangeMax = NETDATA.dataAttribute(state.element, 'sparkline-normalrangemax', undefined);
    let drawNormalOnTop = NETDATA.dataAttribute(state.element, 'sparkline-drawnormalontop', undefined);
    let xvalues = NETDATA.dataAttribute(state.element, 'sparkline-xvalues', undefined);
    let chartRangeClip = NETDATA.dataAttribute(state.element, 'sparkline-chartrangeclip', undefined);
    let chartRangeMinX = NETDATA.dataAttribute(state.element, 'sparkline-chartrangeminx', undefined);
    let chartRangeMaxX = NETDATA.dataAttribute(state.element, 'sparkline-chartrangemaxx', undefined);
    let disableInteraction = NETDATA.dataAttributeBoolean(state.element, 'sparkline-disableinteraction', false);
    let disableTooltips = NETDATA.dataAttributeBoolean(state.element, 'sparkline-disabletooltips', false);
    let disableHighlight = NETDATA.dataAttributeBoolean(state.element, 'sparkline-disablehighlight', false);
    let highlightLighten = NETDATA.dataAttribute(state.element, 'sparkline-highlightlighten', 1.4);
    let highlightColor = NETDATA.dataAttribute(state.element, 'sparkline-highlightcolor', undefined);
    let tooltipContainer = NETDATA.dataAttribute(state.element, 'sparkline-tooltipcontainer', undefined);
    let tooltipClassname = NETDATA.dataAttribute(state.element, 'sparkline-tooltipclassname', undefined);
    let tooltipFormat = NETDATA.dataAttribute(state.element, 'sparkline-tooltipformat', undefined);
    let tooltipPrefix = NETDATA.dataAttribute(state.element, 'sparkline-tooltipprefix', undefined);
    let tooltipSuffix = NETDATA.dataAttribute(state.element, 'sparkline-tooltipsuffix', ' ' + state.units_current);
    let tooltipSkipNull = NETDATA.dataAttributeBoolean(state.element, 'sparkline-tooltipskipnull', true);
    let tooltipValueLookups = NETDATA.dataAttribute(state.element, 'sparkline-tooltipvaluelookups', undefined);
    let tooltipFormatFieldlist = NETDATA.dataAttribute(state.element, 'sparkline-tooltipformatfieldlist', undefined);
    let tooltipFormatFieldlistKey = NETDATA.dataAttribute(state.element, 'sparkline-tooltipformatfieldlistkey', undefined);
    let numberFormatter = NETDATA.dataAttribute(state.element, 'sparkline-numberformatter', function (n) {
        return n.toFixed(2);
    });
    let numberDigitGroupSep = NETDATA.dataAttribute(state.element, 'sparkline-numberdigitgroupsep', undefined);
    let numberDecimalMark = NETDATA.dataAttribute(state.element, 'sparkline-numberdecimalmark', undefined);
    let numberDigitGroupCount = NETDATA.dataAttribute(state.element, 'sparkline-numberdigitgroupcount', undefined);
    let animatedZooms = NETDATA.dataAttributeBoolean(state.element, 'sparkline-animatedzooms', false);

    if (spotColor === 'disable') {
        spotColor = '';
    }
    if (minSpotColor === 'disable') {
        minSpotColor = '';
    }
    if (maxSpotColor === 'disable') {
        maxSpotColor = '';
    }

    // state.log('sparkline type ' + type + ', lineColor: ' + lineColor + ', fillColor: ' + fillColor);

    state.sparkline_options = {
        type: type,
        lineColor: lineColor,
        fillColor: fillColor,
        chartRangeMin: chartRangeMin,
        chartRangeMax: chartRangeMax,
        composite: composite,
        enableTagOptions: enableTagOptions,
        tagOptionPrefix: tagOptionPrefix,
        tagValuesAttribute: tagValuesAttribute,
        disableHiddenCheck: disableHiddenCheck,
        defaultPixelsPerValue: defaultPixelsPerValue,
        spotColor: spotColor,
        minSpotColor: minSpotColor,
        maxSpotColor: maxSpotColor,
        spotRadius: spotRadius,
        valueSpots: valueSpots,
        highlightSpotColor: highlightSpotColor,
        highlightLineColor: highlightLineColor,
        lineWidth: lineWidth,
        normalRangeMin: normalRangeMin,
        normalRangeMax: normalRangeMax,
        drawNormalOnTop: drawNormalOnTop,
        xvalues: xvalues,
        chartRangeClip: chartRangeClip,
        chartRangeMinX: chartRangeMinX,
        chartRangeMaxX: chartRangeMaxX,
        disableInteraction: disableInteraction,
        disableTooltips: disableTooltips,
        disableHighlight: disableHighlight,
        highlightLighten: highlightLighten,
        highlightColor: highlightColor,
        tooltipContainer: tooltipContainer,
        tooltipClassname: tooltipClassname,
        tooltipChartTitle: state.title,
        tooltipFormat: tooltipFormat,
        tooltipPrefix: tooltipPrefix,
        tooltipSuffix: tooltipSuffix,
        tooltipSkipNull: tooltipSkipNull,
        tooltipValueLookups: tooltipValueLookups,
        tooltipFormatFieldlist: tooltipFormatFieldlist,
        tooltipFormatFieldlistKey: tooltipFormatFieldlistKey,
        numberFormatter: numberFormatter,
        numberDigitGroupSep: numberDigitGroupSep,
        numberDecimalMark: numberDecimalMark,
        numberDigitGroupCount: numberDigitGroupCount,
        animatedZooms: animatedZooms,
        width: state.chartWidth(),
        height: state.chartHeight()
    };

    $(state.element_chart).sparkline(data.result, state.sparkline_options);

    return true;
};
// google charts

// Codacy declarations
/* global google */

NETDATA.googleInitialize = function (callback) {
    if (typeof netdataNoGoogleCharts === 'undefined' || !netdataNoGoogleCharts) {
        $.ajax({
            url: NETDATA.google_js,
            cache: true,
            dataType: "script",
            xhrFields: {withCredentials: true} // required for the cookie
        })
            .done(function () {
                NETDATA.registerChartLibrary('google', NETDATA.google_js);
                google.load('visualization', '1.1', {
                    'packages': ['corechart', 'controls'],
                    'callback': callback
                });
            })
            .fail(function () {
                NETDATA.chartLibraries.google.enabled = false;
                NETDATA.error(100, NETDATA.google_js);
                if (typeof callback === "function") {
                    return callback();
                }
            });
    } else {
        NETDATA.chartLibraries.google.enabled = false;
        if (typeof callback === "function") {
            return callback();
        }
    }
};

NETDATA.googleChartUpdate = function (state, data) {
    let datatable = new google.visualization.DataTable(data.result);
    state.google_instance.draw(datatable, state.google_options);
    return true;
};

NETDATA.googleChartCreate = function (state, data) {
    let datatable = new google.visualization.DataTable(data.result);

    state.google_options = {
        colors: state.chartColors(),

        // do not set width, height - the chart resizes itself
        //width: state.chartWidth(),
        //height: state.chartHeight(),
        lineWidth: 1,
        title: state.title,
        fontSize: 11,
        hAxis: {
            //  title: "Time of Day",
            //  format:'HH:mm:ss',
            viewWindowMode: 'maximized',
            slantedText: false,
            format: 'HH:mm:ss',
            textStyle: {
                fontSize: 9
            },
            gridlines: {
                color: '#EEE'
            }
        },
        vAxis: {
            title: state.units_current,
            viewWindowMode: 'pretty',
            minValue: -0.1,
            maxValue: 0.1,
            direction: 1,
            textStyle: {
                fontSize: 9
            },
            gridlines: {
                color: '#EEE'
            }
        },
        chartArea: {
            width: '65%',
            height: '80%'
        },
        focusTarget: 'category',
        annotation: {
            '1': {
                style: 'line'
            }
        },
        pointsVisible: 0,
        titlePosition: 'out',
        titleTextStyle: {
            fontSize: 11
        },
        tooltip: {
            isHtml: false,
            ignoreBounds: true,
            textStyle: {
                fontSize: 9
            }
        },
        curveType: 'function',
        areaOpacity: 0.3,
        isStacked: false
    };

    switch (state.chart.chart_type) {
        case "area":
            state.google_options.vAxis.viewWindowMode = 'maximized';
            state.google_options.areaOpacity = NETDATA.options.current.color_fill_opacity_area;
            state.google_instance = new google.visualization.AreaChart(state.element_chart);
            break;

        case "stacked":
            state.google_options.isStacked = true;
            state.google_options.areaOpacity = NETDATA.options.current.color_fill_opacity_stacked;
            state.google_options.vAxis.viewWindowMode = 'maximized';
            state.google_options.vAxis.minValue = null;
            state.google_options.vAxis.maxValue = null;
            state.google_instance = new google.visualization.AreaChart(state.element_chart);
            break;

        default:
        case "line":
            state.google_options.lineWidth = 2;
            state.google_instance = new google.visualization.LineChart(state.element_chart);
            break;
    }

    state.google_instance.draw(datatable, state.google_options);
    return true;
};
// gauge.js

NETDATA.gaugeInitialize = function (callback) {
    if (typeof netdataNoGauge === 'undefined' || !netdataNoGauge) {
        $.ajax({
            url: NETDATA.gauge_js,
            cache: true,
            dataType: "script",
            xhrFields: {withCredentials: true} // required for the cookie
        })
            .done(function () {
                NETDATA.registerChartLibrary('gauge', NETDATA.gauge_js);
            })
            .fail(function () {
                NETDATA.chartLibraries.gauge.enabled = false;
                NETDATA.error(100, NETDATA.gauge_js);
            })
            .always(function () {
                if (typeof callback === "function") {
                    return callback();
                }
            })
    }
    else {
        NETDATA.chartLibraries.gauge.enabled = false;
        if (typeof callback === "function") {
            return callback();
        }
    }
};

NETDATA.gaugeAnimation = function (state, status) {
    let speed = 32;

    if (typeof status === 'boolean' && status === false) {
        speed = 1000000000;
    } else if (typeof status === 'number') {
        speed = status;
    }

    // console.log('gauge speed ' + speed);
    state.tmp.gauge_instance.animationSpeed = speed;
    state.tmp.___gaugeOld__.speed = speed;
};

NETDATA.gaugeSet = function (state, value, min, max) {
    if (typeof value !== 'number') {
        value = 0;
    }
    if (typeof min !== 'number') {
        min = 0;
    }
    if (typeof max !== 'number') {
        max = 0;
    }
    if (value > max) {
        max = value;
    }
    if (value < min) {
        min = value;
    }
    if (min > max) {
        let t = min;
        min = max;
        max = t;
    }
    else if (min === max) {
        max = min + 1;
    }

    state.legendFormatValueDecimalsFromMinMax(min, max);

    // gauge.js has an issue if the needle
    // is smaller than min or larger than max
    // when we set the new values
    // the needle will go crazy

    // to prevent it, we always feed it
    // with a percentage, so that the needle
    // is always between min and max
    let pcent = (value - min) * 100 / (max - min);

    // bug fix for gauge.js 1.3.1
    // if the value is the absolute min or max, the chart is broken
    if (pcent < 0.001) {
        pcent = 0.001;
    }
    if (pcent > 99.999) {
        pcent = 99.999;
    }

    state.tmp.gauge_instance.set(pcent);
    // console.log('gauge set ' + pcent + ', value ' + value + ', min ' + min + ', max ' + max);

    state.tmp.___gaugeOld__.value = value;
    state.tmp.___gaugeOld__.min = min;
    state.tmp.___gaugeOld__.max = max;
};

NETDATA.gaugeSetLabels = function (state, value, min, max) {
    if (state.tmp.___gaugeOld__.valueLabel !== value) {
        state.tmp.___gaugeOld__.valueLabel = value;
        state.tmp.gaugeChartLabel.innerText = state.legendFormatValue(value);
    }
    if (state.tmp.___gaugeOld__.minLabel !== min) {
        state.tmp.___gaugeOld__.minLabel = min;
        state.tmp.gaugeChartMin.innerText = state.legendFormatValue(min);
    }
    if (state.tmp.___gaugeOld__.maxLabel !== max) {
        state.tmp.___gaugeOld__.maxLabel = max;
        state.tmp.gaugeChartMax.innerText = state.legendFormatValue(max);
    }
};

NETDATA.gaugeClearSelection = function (state, force) {
    if (typeof state.tmp.gaugeEvent !== 'undefined' && typeof state.tmp.gaugeEvent.timer !== 'undefined') {
        NETDATA.timeout.clear(state.tmp.gaugeEvent.timer);
        state.tmp.gaugeEvent.timer = undefined;
    }

    if (state.isAutoRefreshable() && state.data !== null && force !== true) {
        NETDATA.gaugeChartUpdate(state, state.data);
    } else {
        NETDATA.gaugeAnimation(state, false);
        NETDATA.gaugeSetLabels(state, null, null, null);
        NETDATA.gaugeSet(state, null, null, null);
    }

    NETDATA.gaugeAnimation(state, true);
    return true;
};

NETDATA.gaugeSetSelection = function (state, t) {
    if (state.timeIsVisible(t) !== true) {
        return NETDATA.gaugeClearSelection(state, true);
    }

    let slot = state.calculateRowForTime(t);
    if (slot < 0 || slot >= state.data.result.length) {
        return NETDATA.gaugeClearSelection(state, true);
    }

    if (typeof state.tmp.gaugeEvent === 'undefined') {
        state.tmp.gaugeEvent = {
            timer: undefined,
            value: 0,
            min: 0,
            max: 0
        };
    }

    let value = state.data.result[state.data.result.length - 1 - slot];
    let min = (state.tmp.gaugeMin === null) ? NETDATA.commonMin.get(state) : state.tmp.gaugeMin;
    let max = (state.tmp.gaugeMax === null) ? NETDATA.commonMax.get(state) : state.tmp.gaugeMax;

    // make sure it is zero based
    // but only if it has not been set by the user
    if (state.tmp.gaugeMin === null && min > 0) {
        min = 0;
    }
    if (state.tmp.gaugeMax === null && max < 0) {
        max = 0;
    }

    state.tmp.gaugeEvent.value = value;
    state.tmp.gaugeEvent.min = min;
    state.tmp.gaugeEvent.max = max;
    NETDATA.gaugeSetLabels(state, value, min, max);

    if (state.tmp.gaugeEvent.timer === undefined) {
        NETDATA.gaugeAnimation(state, false);

        state.tmp.gaugeEvent.timer = NETDATA.timeout.set(function () {
            state.tmp.gaugeEvent.timer = undefined;
            NETDATA.gaugeSet(state, state.tmp.gaugeEvent.value, state.tmp.gaugeEvent.min, state.tmp.gaugeEvent.max);
        }, 0);
    }

    return true;
};

NETDATA.gaugeChartUpdate = function (state, data) {
    let value, min, max;

    if (NETDATA.globalPanAndZoom.isActive() || state.isAutoRefreshable() === false) {
        NETDATA.gaugeSetLabels(state, null, null, null);
        state.tmp.gauge_instance.set(0);
    } else {
        value = data.result[0];
        min = (state.tmp.gaugeMin === null) ? NETDATA.commonMin.get(state) : state.tmp.gaugeMin;
        max = (state.tmp.gaugeMax === null) ? NETDATA.commonMax.get(state) : state.tmp.gaugeMax;
        if (value < min) {
            min = value;
        }
        if (value > max) {
            max = value;
        }

        // make sure it is zero based
        // but only if it has not been set by the user
        if (state.tmp.gaugeMin === null && min > 0) {
            min = 0;
        }
        if (state.tmp.gaugeMax === null && max < 0) {
            max = 0;
        }

        NETDATA.gaugeSet(state, value, min, max);
        NETDATA.gaugeSetLabels(state, value, min, max);
    }

    return true;
};

NETDATA.gaugeChartCreate = function (state, data) {
    // let chart = $(state.element_chart);

    let value = data.result[0];
    let min = NETDATA.dataAttribute(state.element, 'gauge-min-value', null);
    let max = NETDATA.dataAttribute(state.element, 'gauge-max-value', null);
    // let adjust = NETDATA.dataAttribute(state.element, 'gauge-adjust', null);
    let pointerColor = NETDATA.dataAttribute(state.element, 'gauge-pointer-color', NETDATA.themes.current.gauge_pointer);
    let strokeColor = NETDATA.dataAttribute(state.element, 'gauge-stroke-color', NETDATA.themes.current.gauge_stroke);
    let startColor = NETDATA.dataAttribute(state.element, 'gauge-start-color', state.chartCustomColors()[0]);
    let stopColor = NETDATA.dataAttribute(state.element, 'gauge-stop-color', void 0);
    let generateGradient = NETDATA.dataAttribute(state.element, 'gauge-generate-gradient', false);

    if (min === null) {
        min = NETDATA.commonMin.get(state);
        state.tmp.gaugeMin = null;
    } else {
        state.tmp.gaugeMin = min;
    }

    if (max === null) {
        max = NETDATA.commonMax.get(state);
        state.tmp.gaugeMax = null;
    } else {
        state.tmp.gaugeMax = max;
    }

    // make sure it is zero based
    // but only if it has not been set by the user
    if (state.tmp.gaugeMin === null && min > 0) {
        min = 0;
    }
    if (state.tmp.gaugeMax === null && max < 0) {
        max = 0;
    }

    let width = state.chartWidth(), height = state.chartHeight(); //, ratio = 1.5;
    // console.log('gauge width: ' + width.toString() + ', height: ' + height.toString());
    //switch(adjust) {
    //  case 'width': width = height * ratio; break;
    //  case 'height':
    //  default: height = width / ratio; break;
    //}
    //state.element.style.width = width.toString() + 'px';
    //state.element.style.height = height.toString() + 'px';

    let lum_d = 0.05;

    let options = {
        lines: 12,                  // The number of lines to draw
        angle: 0.14,                // The span of the gauge arc
        lineWidth: 0.57,            // The line thickness
        radiusScale: 1.0,           // Relative radius
        pointer: {
            length: 0.85,           // 0.9 The radius of the inner circle
            strokeWidth: 0.045,     // The rotation offset
            color: pointerColor     // Fill color
        },
        limitMax: true,             // If false, the max value of the gauge will be updated if value surpass max
        limitMin: true,             // If true, the min value of the gauge will be fixed unless you set it manually
        colorStart: startColor,     // Colors
        colorStop: stopColor,       // just experiment with them
        strokeColor: strokeColor,   // to see which ones work best for you
        generateGradient: (generateGradient === true), // gmosx: 
        gradientType: 0,
        highDpiSupport: true        // High resolution support
    };

    if (generateGradient.constructor === Array) {
        // example options:
        // data-gauge-generate-gradient="[0, 50, 100]"
        // data-gauge-gradient-percent-color-0="#FFFFFF"
        // data-gauge-gradient-percent-color-50="#999900"
        // data-gauge-gradient-percent-color-100="#000000"

        options.percentColors = [];
        let len = generateGradient.length;
        while (len--) {
            let pcent = generateGradient[len];
            let color = NETDATA.dataAttribute(state.element, 'gauge-gradient-percent-color-' + pcent.toString(), false);
            if (color !== false) {
                let a = [];
                a[0] = pcent / 100;
                a[1] = color;
                options.percentColors.unshift(a);
            }
        }
        if (options.percentColors.length === 0) {
            delete options.percentColors;
        }
    } else if (generateGradient === false && NETDATA.themes.current.gauge_gradient) {
        //noinspection PointlessArithmeticExpressionJS
        options.percentColors = [
            [0.0, NETDATA.colorLuminance(startColor, (lum_d * 10) - (lum_d * 0))],
            [0.1, NETDATA.colorLuminance(startColor, (lum_d * 10) - (lum_d * 1))],
            [0.2, NETDATA.colorLuminance(startColor, (lum_d * 10) - (lum_d * 2))],
            [0.3, NETDATA.colorLuminance(startColor, (lum_d * 10) - (lum_d * 3))],
            [0.4, NETDATA.colorLuminance(startColor, (lum_d * 10) - (lum_d * 4))],
            [0.5, NETDATA.colorLuminance(startColor, (lum_d * 10) - (lum_d * 5))],
            [0.6, NETDATA.colorLuminance(startColor, (lum_d * 10) - (lum_d * 6))],
            [0.7, NETDATA.colorLuminance(startColor, (lum_d * 10) - (lum_d * 7))],
            [0.8, NETDATA.colorLuminance(startColor, (lum_d * 10) - (lum_d * 8))],
            [0.9, NETDATA.colorLuminance(startColor, (lum_d * 10) - (lum_d * 9))],
            [1.0, NETDATA.colorLuminance(startColor, 0.0)]];
    }

    state.tmp.gauge_canvas = document.createElement('canvas');
    state.tmp.gauge_canvas.id = 'gauge-' + state.uuid + '-canvas';
    state.tmp.gauge_canvas.className = 'gaugeChart';
    state.tmp.gauge_canvas.width = width;
    state.tmp.gauge_canvas.height = height;
    state.element_chart.appendChild(state.tmp.gauge_canvas);

    let valuefontsize = Math.floor(height / 5);
    let valuetop = Math.round((height - valuefontsize) / 3.2);
    state.tmp.gaugeChartLabel = document.createElement('span');
    state.tmp.gaugeChartLabel.className = 'gaugeChartLabel';
    state.tmp.gaugeChartLabel.style.fontSize = valuefontsize + 'px';
    state.tmp.gaugeChartLabel.style.top = valuetop.toString() + 'px';
    state.element_chart.appendChild(state.tmp.gaugeChartLabel);

    let titlefontsize = Math.round(valuefontsize / 2.1);
    let titletop = 0;
    state.tmp.gaugeChartTitle = document.createElement('span');
    state.tmp.gaugeChartTitle.className = 'gaugeChartTitle';
    state.tmp.gaugeChartTitle.innerText = state.title;
    state.tmp.gaugeChartTitle.style.fontSize = titlefontsize + 'px';
    state.tmp.gaugeChartTitle.style.lineHeight = titlefontsize + 'px';
    state.tmp.gaugeChartTitle.style.top = titletop.toString() + 'px';
    state.element_chart.appendChild(state.tmp.gaugeChartTitle);

    let unitfontsize = Math.round(titlefontsize * 0.9);
    state.tmp.gaugeChartUnits = document.createElement('span');
    state.tmp.gaugeChartUnits.className = 'gaugeChartUnits';
    state.tmp.gaugeChartUnits.innerText = state.units_current;
    state.tmp.gaugeChartUnits.style.fontSize = unitfontsize + 'px';
    state.element_chart.appendChild(state.tmp.gaugeChartUnits);

    state.tmp.gaugeChartMin = document.createElement('span');
    state.tmp.gaugeChartMin.className = 'gaugeChartMin';
    state.tmp.gaugeChartMin.style.fontSize = Math.round(valuefontsize * 0.75).toString() + 'px';
    state.element_chart.appendChild(state.tmp.gaugeChartMin);

    state.tmp.gaugeChartMax = document.createElement('span');
    state.tmp.gaugeChartMax.className = 'gaugeChartMax';
    state.tmp.gaugeChartMax.style.fontSize = Math.round(valuefontsize * 0.75).toString() + 'px';
    state.element_chart.appendChild(state.tmp.gaugeChartMax);

    // when we just re-create the chart
    // do not animate the first update
    let animate = true;
    if (typeof state.tmp.gauge_instance !== 'undefined') {
        animate = false;
    }

    state.tmp.gauge_instance = new Gauge(state.tmp.gauge_canvas).setOptions(options); // create sexy gauge!

    state.tmp.___gaugeOld__ = {
        value: value,
        min: min,
        max: max,
        valueLabel: null,
        minLabel: null,
        maxLabel: null
    };

    // we will always feed a percentage
    state.tmp.gauge_instance.minValue = 0;
    state.tmp.gauge_instance.maxValue = 100;

    NETDATA.gaugeAnimation(state, animate);
    NETDATA.gaugeSet(state, value, min, max);
    NETDATA.gaugeSetLabels(state, value, min, max);
    NETDATA.gaugeAnimation(state, true);

    state.legendSetUnitsString = function (units) {
        if (typeof state.tmp.gaugeChartUnits !== 'undefined' && state.tmp.units !== units) {
            state.tmp.gaugeChartUnits.innerText = units;
            state.tmp.___gaugeOld__.valueLabel = null;
            state.tmp.___gaugeOld__.minLabel = null;
            state.tmp.___gaugeOld__.maxLabel = null;
            state.tmp.units = units;
        }
    };
    state.legendShowUndefined = function () {
        if (typeof state.tmp.gauge_instance !== 'undefined') {
            NETDATA.gaugeClearSelection(state);
        }
    };

    return true;
};
// ----------------------------------------------------------------------------------------------------------------

NETDATA.easypiechartPercentFromValueMinMax = function (state, value, min, max) {
    if (typeof value !== 'number') {
        value = 0;
    }
    if (typeof min !== 'number') {
        min = 0;
    }
    if (typeof max !== 'number') {
        max = 0;
    }

    if (min > max) {
        let t = min;
        min = max;
        max = t;
    }

    if (min > value) {
        min = value;
    }
    if (max < value) {
        max = value;
    }

    state.legendFormatValueDecimalsFromMinMax(min, max);

    if (state.tmp.easyPieChartMin === null && min > 0) {
        min = 0;
    }
    if (state.tmp.easyPieChartMax === null && max < 0) {
        max = 0;
    }

    let pcent;

    if (min < 0 && max > 0) {
        // it is both positive and negative
        // zero at the top center of the chart
        max = (-min > max) ? -min : max;
        pcent = Math.round(value * 100 / max);
    } else if (value >= 0 && min >= 0 && max >= 0) {
        // clockwise
        pcent = Math.round((value - min) * 100 / (max - min));
        if (pcent === 0) {
            pcent = 0.1;
        }
    } else {
        // counter clockwise
        pcent = Math.round((value - max) * 100 / (max - min));
        if (pcent === 0) {
            pcent = -0.1;
        }
    }

    return pcent;
};

// ----------------------------------------------------------------------------------------------------------------
// easy-pie-chart

NETDATA.easypiechartInitialize = function (callback) {
    if (typeof netdataNoEasyPieChart === 'undefined' || !netdataNoEasyPieChart) {
        $.ajax({
            url: NETDATA.easypiechart_js,
            cache: true,
            dataType: "script",
            xhrFields: {withCredentials: true} // required for the cookie
        })
            .done(function () {
                NETDATA.registerChartLibrary('easypiechart', NETDATA.easypiechart_js);
            })
            .fail(function () {
                NETDATA.chartLibraries.easypiechart.enabled = false;
                NETDATA.error(100, NETDATA.easypiechart_js);
            })
            .always(function () {
                if (typeof callback === "function") {
                    return callback();
                }
            })
    } else {
        NETDATA.chartLibraries.easypiechart.enabled = false;
        if (typeof callback === "function") {
            return callback();
        }
    }
};

NETDATA.easypiechartClearSelection = function (state, force) {
    if (typeof state.tmp.easyPieChartEvent !== 'undefined' && typeof state.tmp.easyPieChartEvent.timer !== 'undefined') {
        NETDATA.timeout.clear(state.tmp.easyPieChartEvent.timer);
        state.tmp.easyPieChartEvent.timer = undefined;
    }

    if (state.isAutoRefreshable() && state.data !== null && force !== true) {
        NETDATA.easypiechartChartUpdate(state, state.data);
    }
    else {
        state.tmp.easyPieChartLabel.innerText = state.legendFormatValue(null);
        state.tmp.easyPieChart_instance.update(0);
    }
    state.tmp.easyPieChart_instance.enableAnimation();

    return true;
};

NETDATA.easypiechartSetSelection = function (state, t) {
    if (state.timeIsVisible(t) !== true) {
        return NETDATA.easypiechartClearSelection(state, true);
    }

    let slot = state.calculateRowForTime(t);
    if (slot < 0 || slot >= state.data.result.length) {
        return NETDATA.easypiechartClearSelection(state, true);
    }

    if (typeof state.tmp.easyPieChartEvent === 'undefined') {
        state.tmp.easyPieChartEvent = {
            timer: undefined,
            value: 0,
            pcent: 0
        };
    }

    let value = state.data.result[state.data.result.length - 1 - slot];
    let min = (state.tmp.easyPieChartMin === null) ? NETDATA.commonMin.get(state) : state.tmp.easyPieChartMin;
    let max = (state.tmp.easyPieChartMax === null) ? NETDATA.commonMax.get(state) : state.tmp.easyPieChartMax;
    let pcent = NETDATA.easypiechartPercentFromValueMinMax(state, value, min, max);

    state.tmp.easyPieChartEvent.value = value;
    state.tmp.easyPieChartEvent.pcent = pcent;
    state.tmp.easyPieChartLabel.innerText = state.legendFormatValue(value);

    if (state.tmp.easyPieChartEvent.timer === undefined) {
        state.tmp.easyPieChart_instance.disableAnimation();

        state.tmp.easyPieChartEvent.timer = NETDATA.timeout.set(function () {
            state.tmp.easyPieChartEvent.timer = undefined;
            state.tmp.easyPieChart_instance.update(state.tmp.easyPieChartEvent.pcent);
        }, 0);
    }

    return true;
};

NETDATA.easypiechartChartUpdate = function (state, data) {
    let value, min, max, pcent;

    if (NETDATA.globalPanAndZoom.isActive() || state.isAutoRefreshable() === false) {
        value = null;
        pcent = 0;
    }
    else {
        value = data.result[0];
        min = (state.tmp.easyPieChartMin === null) ? NETDATA.commonMin.get(state) : state.tmp.easyPieChartMin;
        max = (state.tmp.easyPieChartMax === null) ? NETDATA.commonMax.get(state) : state.tmp.easyPieChartMax;
        pcent = NETDATA.easypiechartPercentFromValueMinMax(state, value, min, max);
    }

    state.tmp.easyPieChartLabel.innerText = state.legendFormatValue(value);
    state.tmp.easyPieChart_instance.update(pcent);
    return true;
};

NETDATA.easypiechartChartCreate = function (state, data) {
    let chart = $(state.element_chart);

    let value = data.result[0];
    let min = NETDATA.dataAttribute(state.element, 'easypiechart-min-value', null);
    let max = NETDATA.dataAttribute(state.element, 'easypiechart-max-value', null);

    if (min === null) {
        min = NETDATA.commonMin.get(state);
        state.tmp.easyPieChartMin = null;
    }
    else {
        state.tmp.easyPieChartMin = min;
    }

    if (max === null) {
        max = NETDATA.commonMax.get(state);
        state.tmp.easyPieChartMax = null;
    }
    else {
        state.tmp.easyPieChartMax = max;
    }

    let size = state.chartWidth();
    let stroke = Math.floor(size / 22);
    if (stroke < 3) {
        stroke = 2;
    }

    let valuefontsize = Math.floor((size * 2 / 3) / 5);
    let valuetop = Math.round((size - valuefontsize - (size / 40)) / 2);
    state.tmp.easyPieChartLabel = document.createElement('span');
    state.tmp.easyPieChartLabel.className = 'easyPieChartLabel';
    state.tmp.easyPieChartLabel.innerText = state.legendFormatValue(value);
    state.tmp.easyPieChartLabel.style.fontSize = valuefontsize + 'px';
    state.tmp.easyPieChartLabel.style.top = valuetop.toString() + 'px';
    state.element_chart.appendChild(state.tmp.easyPieChartLabel);

    let titlefontsize = Math.round(valuefontsize * 1.6 / 3);
    let titletop = Math.round(valuetop - (titlefontsize * 2) - (size / 40));
    state.tmp.easyPieChartTitle = document.createElement('span');
    state.tmp.easyPieChartTitle.className = 'easyPieChartTitle';
    state.tmp.easyPieChartTitle.innerText = state.title;
    state.tmp.easyPieChartTitle.style.fontSize = titlefontsize + 'px';
    state.tmp.easyPieChartTitle.style.lineHeight = titlefontsize + 'px';
    state.tmp.easyPieChartTitle.style.top = titletop.toString() + 'px';
    state.element_chart.appendChild(state.tmp.easyPieChartTitle);

    let unitfontsize = Math.round(titlefontsize * 0.9);
    let unittop = Math.round(valuetop + (valuefontsize + unitfontsize) + (size / 40));
    state.tmp.easyPieChartUnits = document.createElement('span');
    state.tmp.easyPieChartUnits.className = 'easyPieChartUnits';
    state.tmp.easyPieChartUnits.innerText = state.units_current;
    state.tmp.easyPieChartUnits.style.fontSize = unitfontsize + 'px';
    state.tmp.easyPieChartUnits.style.top = unittop.toString() + 'px';
    state.element_chart.appendChild(state.tmp.easyPieChartUnits);

    let barColor = NETDATA.dataAttribute(state.element, 'easypiechart-barcolor', undefined);
    if (typeof barColor === 'undefined' || barColor === null) {
        barColor = state.chartCustomColors()[0];
    } else {
        // <div ... data-easypiechart-barcolor="(function(percent){return(percent < 50 ? '#5cb85c' : percent < 85 ? '#f0ad4e' : '#cb3935');})" ...></div>
        let tmp = eval(barColor);
        if (typeof tmp === 'function') {
            barColor = tmp;
        }
    }

    let pcent = NETDATA.easypiechartPercentFromValueMinMax(state, value, min, max);
    chart.data('data-percent', pcent);

    chart.easyPieChart({
        barColor: barColor,
        trackColor: NETDATA.dataAttribute(state.element, 'easypiechart-trackcolor', NETDATA.themes.current.easypiechart_track),
        scaleColor: NETDATA.dataAttribute(state.element, 'easypiechart-scalecolor', NETDATA.themes.current.easypiechart_scale),
        scaleLength: NETDATA.dataAttribute(state.element, 'easypiechart-scalelength', 5),
        lineCap: NETDATA.dataAttribute(state.element, 'easypiechart-linecap', 'round'),
        lineWidth: NETDATA.dataAttribute(state.element, 'easypiechart-linewidth', stroke),
        trackWidth: NETDATA.dataAttribute(state.element, 'easypiechart-trackwidth', undefined),
        size: NETDATA.dataAttribute(state.element, 'easypiechart-size', size),
        rotate: NETDATA.dataAttribute(state.element, 'easypiechart-rotate', 0),
        animate: NETDATA.dataAttribute(state.element, 'easypiechart-animate', {duration: 500, enabled: true}),
        easing: NETDATA.dataAttribute(state.element, 'easypiechart-easing', undefined)
    });

    // when we just re-create the chart
    // do not animate the first update
    let animate = true;
    if (typeof state.tmp.easyPieChart_instance !== 'undefined') {
        animate = false;
    }

    state.tmp.easyPieChart_instance = chart.data('easyPieChart');
    if (animate === false) {
        state.tmp.easyPieChart_instance.disableAnimation();
    }
    state.tmp.easyPieChart_instance.update(pcent);
    if (animate === false) {
        state.tmp.easyPieChart_instance.enableAnimation();
    }

    state.legendSetUnitsString = function (units) {
        if (typeof state.tmp.easyPieChartUnits !== 'undefined' && state.tmp.units !== units) {
            state.tmp.easyPieChartUnits.innerText = units;
            state.tmp.units = units;
        }
    };
    state.legendShowUndefined = function () {
        if (typeof state.tmp.easyPieChart_instance !== 'undefined') {
            NETDATA.easypiechartClearSelection(state);
        }
    };

    return true;
};

// d3pie

NETDATA.d3pieInitialize = function (callback) {
    if (typeof netdataNoD3pie === 'undefined' || !netdataNoD3pie) {

        // d3pie requires D3
        if (!NETDATA.chartLibraries.d3.initialized) {
            if (NETDATA.chartLibraries.d3.enabled) {
                NETDATA.d3Initialize(function () {
                    NETDATA.d3pieInitialize(callback);
                });
            } else {
                NETDATA.chartLibraries.d3pie.enabled = false;
                if (typeof callback === "function") {
                    return callback();
                }
            }
        } else {
            $.ajax({
                url: NETDATA.d3pie_js,
                cache: true,
                dataType: "script",
                xhrFields: {withCredentials: true} // required for the cookie
            })
                .done(function () {
                    NETDATA.registerChartLibrary('d3pie', NETDATA.d3pie_js);
                })
                .fail(function () {
                    NETDATA.chartLibraries.d3pie.enabled = false;
                    NETDATA.error(100, NETDATA.d3pie_js);
                })
                .always(function () {
                    if (typeof callback === "function") {
                        return callback();
                    }
                });
        }
    } else {
        NETDATA.chartLibraries.d3pie.enabled = false;
        if (typeof callback === "function") {
            return callback();
        }
    }
};

NETDATA.d3pieSetContent = function (state, data, index) {
    state.legendFormatValueDecimalsFromMinMax(
        data.min,
        data.max
    );

    let content = [];
    let colors = state.chartColors();
    let len = data.result.labels.length;
    for (let i = 1; i < len; i++) {
        let label = data.result.labels[i];
        let value = data.result.data[index][label];
        let color = colors[i - 1];

        if (value !== null && value > 0) {
            content.push({
                label: label,
                value: value,
                color: color
            });
        }
    }

    if (content.length === 0) {
        content.push({
            label: 'no data',
            value: 100,
            color: '#666666'
        });
    }

    state.tmp.d3pie_last_slot = index;
    return content;
};

NETDATA.d3pieDateRange = function (state, data, index) {
    let dt = Math.round((data.before - data.after + 1) / data.points);
    let dt_str = NETDATA.seconds4human(dt);

    let before = data.result.data[index].time;
    let after = before - (dt * 1000);

    let d1 = NETDATA.dateTime.localeDateString(after);
    let t1 = NETDATA.dateTime.localeTimeString(after);
    let d2 = NETDATA.dateTime.localeDateString(before);
    let t2 = NETDATA.dateTime.localeTimeString(before);

    if (d1 === d2) {
        return d1 + ' ' + t1 + ' to ' + t2 + ', ' + dt_str;
    }

    return d1 + ' ' + t1 + ' to ' + d2 + ' ' + t2 + ', ' + dt_str;
};

NETDATA.d3pieSetSelection = function (state, t) {
    if (state.timeIsVisible(t) !== true) {
        return NETDATA.d3pieClearSelection(state, true);
    }

    let slot = state.calculateRowForTime(t);
    slot = state.data.result.data.length - slot - 1;

    if (slot < 0 || slot >= state.data.result.length) {
        return NETDATA.d3pieClearSelection(state, true);
    }

    if (state.tmp.d3pie_last_slot === slot) {
        // we already show this slot, don't do anything
        return true;
    }

    if (state.tmp.d3pie_timer === undefined) {
        state.tmp.d3pie_timer = NETDATA.timeout.set(function () {
            state.tmp.d3pie_timer = undefined;
            NETDATA.d3pieChange(state, NETDATA.d3pieSetContent(state, state.data, slot), NETDATA.d3pieDateRange(state, state.data, slot));
        }, 0);
    }

    return true;
};

NETDATA.d3pieClearSelection = function (state, force) {
    if (typeof state.tmp.d3pie_timer !== 'undefined') {
        NETDATA.timeout.clear(state.tmp.d3pie_timer);
        state.tmp.d3pie_timer = undefined;
    }

    if (state.isAutoRefreshable() && state.data !== null && force !== true) {
        NETDATA.d3pieChartUpdate(state, state.data);
    } else {
        if (state.tmp.d3pie_last_slot !== -1) {
            state.tmp.d3pie_last_slot = -1;
            NETDATA.d3pieChange(state, [{label: 'no data', value: 1, color: '#666666'}], 'no data available');
        }
    }

    return true;
};

NETDATA.d3pieChange = function (state, content, footer) {
    if (state.d3pie_forced_subtitle === null) {
        //state.d3pie_instance.updateProp("header.subtitle.text", state.units_current);
        state.d3pie_instance.options.header.subtitle.text = state.units_current;
    }

    if (state.d3pie_forced_footer === null) {
        //state.d3pie_instance.updateProp("footer.text", footer);
        state.d3pie_instance.options.footer.text = footer;
    }

    //state.d3pie_instance.updateProp("data.content", content);
    state.d3pie_instance.options.data.content = content;
    state.d3pie_instance.destroy();
    state.d3pie_instance.recreate();
    return true;
};

NETDATA.d3pieChartUpdate = function (state, data) {
    return NETDATA.d3pieChange(state, NETDATA.d3pieSetContent(state, data, 0), NETDATA.d3pieDateRange(state, data, 0));
};

NETDATA.d3pieChartCreate = function (state, data) {

    state.element_chart.id = 'd3pie-' + state.uuid;
    // console.log('id = ' + state.element_chart.id);

    let content = NETDATA.d3pieSetContent(state, data, 0);

    state.d3pie_forced_title = NETDATA.dataAttribute(state.element, 'd3pie-title', null);
    state.d3pie_forced_subtitle = NETDATA.dataAttribute(state.element, 'd3pie-subtitle', null);
    state.d3pie_forced_footer = NETDATA.dataAttribute(state.element, 'd3pie-footer', null);

    state.d3pie_options = {
        header: {
            title: {
                text: (state.d3pie_forced_title !== null) ? state.d3pie_forced_title : state.title,
                color: NETDATA.dataAttribute(state.element, 'd3pie-title-color', NETDATA.themes.current.d3pie.title),
                fontSize: NETDATA.dataAttribute(state.element, 'd3pie-title-fontsize', 12),
                fontWeight: NETDATA.dataAttribute(state.element, 'd3pie-title-fontweight', "bold"),
                font: NETDATA.dataAttribute(state.element, 'd3pie-title-font', "arial")
            },
            subtitle: {
                text: (state.d3pie_forced_subtitle !== null) ? state.d3pie_forced_subtitle : state.units_current,
                color: NETDATA.dataAttribute(state.element, 'd3pie-subtitle-color', NETDATA.themes.current.d3pie.subtitle),
                fontSize: NETDATA.dataAttribute(state.element, 'd3pie-subtitle-fontsize', 10),
                fontWeight: NETDATA.dataAttribute(state.element, 'd3pie-subtitle-fontweight', "normal"),
                font: NETDATA.dataAttribute(state.element, 'd3pie-subtitle-font', "arial")
            },
            titleSubtitlePadding: 1
        },
        footer: {
            text: (state.d3pie_forced_footer !== null) ? state.d3pie_forced_footer : NETDATA.d3pieDateRange(state, data, 0),
            color: NETDATA.dataAttribute(state.element, 'd3pie-footer-color', NETDATA.themes.current.d3pie.footer),
            fontSize: NETDATA.dataAttribute(state.element, 'd3pie-footer-fontsize', 9),
            fontWeight: NETDATA.dataAttribute(state.element, 'd3pie-footer-fontweight', "bold"),
            font: NETDATA.dataAttribute(state.element, 'd3pie-footer-font', "arial"),
            location: NETDATA.dataAttribute(state.element, 'd3pie-footer-location', "bottom-center") // bottom-left, bottom-center, bottom-right
        },
        size: {
            canvasHeight: state.chartHeight(),
            canvasWidth: state.chartWidth(),
            pieInnerRadius: NETDATA.dataAttribute(state.element, 'd3pie-pieinnerradius', "45%"),
            pieOuterRadius: NETDATA.dataAttribute(state.element, 'd3pie-pieouterradius', "80%")
        },
        data: {
            // none, random, value-asc, value-desc, label-asc, label-desc
            sortOrder: NETDATA.dataAttribute(state.element, 'd3pie-sortorder', "value-desc"),
            smallSegmentGrouping: {
                enabled: NETDATA.dataAttributeBoolean(state.element, "d3pie-smallsegmentgrouping-enabled", false),
                value: NETDATA.dataAttribute(state.element, 'd3pie-smallsegmentgrouping-value', 1),
                // percentage, value
                valueType: NETDATA.dataAttribute(state.element, 'd3pie-smallsegmentgrouping-valuetype', "percentage"),
                label: NETDATA.dataAttribute(state.element, 'd3pie-smallsegmentgrouping-label', "other"),
                color: NETDATA.dataAttribute(state.element, 'd3pie-smallsegmentgrouping-color', NETDATA.themes.current.d3pie.other)
            },

            // REQUIRED! This is where you enter your pie data; it needs to be an array of objects
            // of this form: { label: "label", value: 1.5, color: "#000000" } - color is optional
            content: content
        },
        labels: {
            outer: {
                // label, value, percentage, label-value1, label-value2, label-percentage1, label-percentage2
                format: NETDATA.dataAttribute(state.element, 'd3pie-labels-outer-format', "label-value1"),
                hideWhenLessThanPercentage: NETDATA.dataAttribute(state.element, 'd3pie-labels-outer-hidewhenlessthanpercentage', null),
                pieDistance: NETDATA.dataAttribute(state.element, 'd3pie-labels-outer-piedistance', 15)
            },
            inner: {
                // label, value, percentage, label-value1, label-value2, label-percentage1, label-percentage2
                format: NETDATA.dataAttribute(state.element, 'd3pie-labels-inner-format', "percentage"),
                hideWhenLessThanPercentage: NETDATA.dataAttribute(state.element, 'd3pie-labels-inner-hidewhenlessthanpercentage', 2)
            },
            mainLabel: {
                color: NETDATA.dataAttribute(state.element, 'd3pie-labels-mainLabel-color', NETDATA.themes.current.d3pie.mainlabel), // or 'segment' for dynamic color
                font: NETDATA.dataAttribute(state.element, 'd3pie-labels-mainLabel-font', "arial"),
                fontSize: NETDATA.dataAttribute(state.element, 'd3pie-labels-mainLabel-fontsize', 10),
                fontWeight: NETDATA.dataAttribute(state.element, 'd3pie-labels-mainLabel-fontweight', "normal")
            },
            percentage: {
                color: NETDATA.dataAttribute(state.element, 'd3pie-labels-percentage-color', NETDATA.themes.current.d3pie.percentage),
                font: NETDATA.dataAttribute(state.element, 'd3pie-labels-percentage-font', "arial"),
                fontSize: NETDATA.dataAttribute(state.element, 'd3pie-labels-percentage-fontsize', 10),
                fontWeight: NETDATA.dataAttribute(state.element, 'd3pie-labels-percentage-fontweight', "bold"),
                decimalPlaces: 0
            },
            value: {
                color: NETDATA.dataAttribute(state.element, 'd3pie-labels-value-color', NETDATA.themes.current.d3pie.value),
                font: NETDATA.dataAttribute(state.element, 'd3pie-labels-value-font', "arial"),
                fontSize: NETDATA.dataAttribute(state.element, 'd3pie-labels-value-fontsize', 10),
                fontWeight: NETDATA.dataAttribute(state.element, 'd3pie-labels-value-fontweight', "bold")
            },
            lines: {
                enabled: NETDATA.dataAttributeBoolean(state.element, 'd3pie-labels-lines-enabled', true),
                style: NETDATA.dataAttribute(state.element, 'd3pie-labels-lines-style', "curved"),
                color: NETDATA.dataAttribute(state.element, 'd3pie-labels-lines-color', "segment") // "segment" or a hex color
            },
            truncation: {
                enabled: NETDATA.dataAttributeBoolean(state.element, 'd3pie-labels-truncation-enabled', false),
                truncateLength: NETDATA.dataAttribute(state.element, 'd3pie-labels-truncation-truncatelength', 30)
            },
            formatter: function (context) {
                // console.log(context);
                if (context.part === 'value') {
                    return state.legendFormatValue(context.value);
                }
                if (context.part === 'percentage') {
                    return context.label + '%';
                }

                return context.label;
            }
        },
        effects: {
            load: {
                effect: "none", // none / default
                speed: 0 // commented in the d3pie code to speed it up
            },
            pullOutSegmentOnClick: {
                effect: "bounce", // none / linear / bounce / elastic / back
                speed: 400,
                size: 5
            },
            highlightSegmentOnMouseover: true,
            highlightLuminosity: -0.2
        },
        tooltips: {
            enabled: false,
            type: "placeholder", // caption|placeholder
            string: "",
            placeholderParser: null, // function
            styles: {
                fadeInSpeed: 250,
                backgroundColor: NETDATA.themes.current.d3pie.tooltip_bg,
                backgroundOpacity: 0.5,
                color: NETDATA.themes.current.d3pie.tooltip_fg,
                borderRadius: 2,
                font: "arial",
                fontSize: 12,
                padding: 4
            }
        },
        misc: {
            colors: {
                background: 'transparent', // transparent or color #
                // segments: state.chartColors(),
                segmentStroke: NETDATA.dataAttribute(state.element, 'd3pie-misc-colors-segmentstroke', NETDATA.themes.current.d3pie.segment_stroke)
            },
            gradient: {
                enabled: NETDATA.dataAttributeBoolean(state.element, 'd3pie-misc-gradient-enabled', false),
                percentage: NETDATA.dataAttribute(state.element, 'd3pie-misc-colors-percentage', 95),
                color: NETDATA.dataAttribute(state.element, 'd3pie-misc-gradient-color', NETDATA.themes.current.d3pie.gradient_color)
            },
            canvasPadding: {
                top: 5,
                right: 5,
                bottom: 5,
                left: 5
            },
            pieCenterOffset: {
                x: 0,
                y: 0
            },
            cssPrefix: NETDATA.dataAttribute(state.element, 'd3pie-cssprefix', null)
        },
        callbacks: {
            onload: null,
            onMouseoverSegment: null,
            onMouseoutSegment: null,
            onClickSegment: null
        }
    };

    state.d3pie_instance = new d3pie(state.element_chart, state.d3pie_options);
    return true;
};

// ----------------------------------------------------------------------------------------------------------------
// D3

NETDATA.d3Initialize = function(callback) {
    if (typeof netdataStopD3 === 'undefined' || !netdataStopD3) {
        $.ajax({
            url: NETDATA.d3_js,
            cache: true,
            dataType: "script",
            xhrFields: { withCredentials: true } // required for the cookie
        })
        .done(function() {
            NETDATA.registerChartLibrary('d3', NETDATA.d3_js);
        })
        .fail(function() {
            NETDATA.chartLibraries.d3.enabled = false;
            NETDATA.error(100, NETDATA.d3_js);
        })
        .always(function() {
            if (typeof callback === "function")
                return callback();
        });
    } else {
        NETDATA.chartLibraries.d3.enabled = false;
        if (typeof callback === "function")
            return callback();
    }
};

NETDATA.d3ChartUpdate = function(state, data) {
    void(state);
    void(data);

    return false;
};

NETDATA.d3ChartCreate = function(state, data) {
    void(state);
    void(data);

    return false;
};

// peity

NETDATA.peityInitialize = function (callback) {
    if (typeof netdataNoPeitys === 'undefined' || !netdataNoPeitys) {
        $.ajax({
            url: NETDATA.peity_js,
            cache: true,
            dataType: "script",
            xhrFields: {withCredentials: true} // required for the cookie
        })
            .done(function () {
                NETDATA.registerChartLibrary('peity', NETDATA.peity_js);
            })
            .fail(function () {
                NETDATA.chartLibraries.peity.enabled = false;
                NETDATA.error(100, NETDATA.peity_js);
            })
            .always(function () {
                if (typeof callback === "function") {
                    return callback();
                }
            });
    } else {
        NETDATA.chartLibraries.peity.enabled = false;
        if (typeof callback === "function") {
            return callback();
        }
    }
};

NETDATA.peityChartUpdate = function (state, data) {
    state.peity_instance.innerHTML = data.result;

    if (state.peity_options.stroke !== state.chartCustomColors()[0]) {
        state.peity_options.stroke = state.chartCustomColors()[0];
        if (state.chart.chart_type === 'line') {
            state.peity_options.fill = NETDATA.themes.current.background;
        } else {
            state.peity_options.fill = NETDATA.colorLuminance(state.chartCustomColors()[0], NETDATA.chartDefaults.fill_luminance);
        }
    }

    $(state.peity_instance).peity('line', state.peity_options);
    return true;
};

NETDATA.peityChartCreate = function (state, data) {
    state.peity_instance = document.createElement('div');
    state.element_chart.appendChild(state.peity_instance);

    state.peity_options = {
        stroke: NETDATA.themes.current.foreground,
        strokeWidth: NETDATA.dataAttribute(state.element, 'peity-strokewidth', 1),
        width: state.chartWidth(),
        height: state.chartHeight(),
        fill: NETDATA.themes.current.foreground
    };

    NETDATA.peityChartUpdate(state, data);
    return true;
};

// ----------------------------------------------------------------------------------------------------------------
// "Text-only" chart - Just renders the raw value to the DOM

NETDATA.textOnlyCreate = function(state, data) {
    var decimalPlaces = NETDATA.dataAttribute(state.element, 'textonly-decimal-places', 1);
    var prefix = NETDATA.dataAttribute(state.element, 'textonly-prefix', '');
    var suffix = NETDATA.dataAttribute(state.element, 'textonly-suffix', '');

    // Round based on number of decimal places to show
    var precision = Math.pow(10, decimalPlaces);
    var value = Math.round(data.result[0] * precision) / precision;

    state.element.textContent = prefix + value + suffix;
    return true;
}

NETDATA.textOnlyUpdate = NETDATA.textOnlyCreate;
// Charts Libraries Registration

NETDATA.chartLibraries = {
    "dygraph": {
        initialize: NETDATA.dygraphInitialize,
        create: NETDATA.dygraphChartCreate,
        update: NETDATA.dygraphChartUpdate,
        resize: function (state) {
            if (typeof state.tmp.dygraph_instance !== 'undefined' && typeof state.tmp.dygraph_instance.resize === 'function') {
                state.tmp.dygraph_instance.resize();
            }
        },
        setSelection: NETDATA.dygraphSetSelection,
        clearSelection: NETDATA.dygraphClearSelection,
        toolboxPanAndZoom: NETDATA.dygraphToolboxPanAndZoom,
        initialized: false,
        enabled: true,
        xssRegexIgnore: new RegExp('^/api/v1/data\.result.data$'),
        format: function (state) {
            void(state);
            return 'json';
        },
        options: function (state) {
            return 'ms' + '%7C' + 'flip' + (this.isLogScale(state) ? ('%7C' + 'abs') : '').toString();
        },
        legend: function (state) {
            return (this.isSparkline(state) === false && NETDATA.dataAttributeBoolean(state.element, 'legend', true) === true) ? 'right-side' : null;
        },
        autoresize: function (state) {
            void(state);
            return true;
        },
        max_updates_to_recreate: function (state) {
            void(state);
            return 5000;
        },
        track_colors: function (state) {
            void(state);
            return true;
        },
        pixels_per_point: function (state) {
            return (this.isSparkline(state) === false) ? 3 : 2;
        },
        isSparkline: function (state) {
            if (typeof state.tmp.dygraph_sparkline === 'undefined') {
                state.tmp.dygraph_sparkline = (this.theme(state) === 'sparkline');
            }
            return state.tmp.dygraph_sparkline;
        },
        isLogScale: function (state) {
            if (typeof state.tmp.dygraph_logscale === 'undefined') {
                state.tmp.dygraph_logscale = (this.theme(state) === 'logscale');
            }
            return state.tmp.dygraph_logscale;
        },
        theme: function (state) {
            if (typeof state.tmp.dygraph_theme === 'undefined') {
                state.tmp.dygraph_theme = NETDATA.dataAttribute(state.element, 'dygraph-theme', 'default');
            }
            return state.tmp.dygraph_theme;
        },
        container_class: function (state) {
            if (this.legend(state) !== null) {
                return 'netdata-container-with-legend';
            }
            return 'netdata-container';
        }
    },
    "sparkline": {
        initialize: NETDATA.sparklineInitialize,
        create: NETDATA.sparklineChartCreate,
        update: NETDATA.sparklineChartUpdate,
        resize: null,
        setSelection: undefined, // function(state, t) { void(state); return true; },
        clearSelection: undefined, // function(state) { void(state); return true; },
        toolboxPanAndZoom: null,
        initialized: false,
        enabled: true,
        xssRegexIgnore: new RegExp('^/api/v1/data\.result$'),
        format: function (state) {
            void(state);
            return 'array';
        },
        options: function (state) {
            void(state);
            return 'flip' + '%7C' + 'abs';
        },
        legend: function (state) {
            void(state);
            return null;
        },
        autoresize: function (state) {
            void(state);
            return false;
        },
        max_updates_to_recreate: function (state) {
            void(state);
            return 5000;
        },
        track_colors: function (state) {
            void(state);
            return false;
        },
        pixels_per_point: function (state) {
            void(state);
            return 3;
        },
        container_class: function (state) {
            void(state);
            return 'netdata-container';
        }
    },
    "peity": {
        initialize: NETDATA.peityInitialize,
        create: NETDATA.peityChartCreate,
        update: NETDATA.peityChartUpdate,
        resize: null,
        setSelection: undefined, // function(state, t) { void(state); return true; },
        clearSelection: undefined, // function(state) { void(state); return true; },
        toolboxPanAndZoom: null,
        initialized: false,
        enabled: true,
        xssRegexIgnore: new RegExp('^/api/v1/data\.result$'),
        format: function (state) {
            void(state);
            return 'ssvcomma';
        },
        options: function (state) {
            void(state);
            return 'null2zero' + '%7C' + 'flip' + '%7C' + 'abs';
        },
        legend: function (state) {
            void(state);
            return null;
        },
        autoresize: function (state) {
            void(state);
            return false;
        },
        max_updates_to_recreate: function (state) {
            void(state);
            return 5000;
        },
        track_colors: function (state) {
            void(state);
            return false;
        },
        pixels_per_point: function (state) {
            void(state);
            return 3;
        },
        container_class: function (state) {
            void(state);
            return 'netdata-container';
        }
    },
    // "morris": {
    //     initialize: NETDATA.morrisInitialize,
    //     create: NETDATA.morrisChartCreate,
    //     update: NETDATA.morrisChartUpdate,
    //     resize: null,
    //     setSelection: undefined, // function(state, t) { void(state); return true; },
    //     clearSelection: undefined, // function(state) { void(state); return true; },
    //     toolboxPanAndZoom: null,
    //     initialized: false,
    //     enabled: true,
    //     xssRegexIgnore: new RegExp('^/api/v1/data\.result.data$'),
    //     format: function(state) { void(state); return 'json'; },
    //     options: function(state) { void(state); return 'objectrows' + '%7C' + 'ms'; },
    //     legend: function(state) { void(state); return null; },
    //     autoresize: function(state) { void(state); return false; },
    //     max_updates_to_recreate: function(state) { void(state); return 50; },
    //     track_colors: function(state) { void(state); return false; },
    //     pixels_per_point: function(state) { void(state); return 15; },
    //     container_class: function(state) { void(state); return 'netdata-container'; }
    // },
    "google": {
        initialize: NETDATA.googleInitialize,
        create: NETDATA.googleChartCreate,
        update: NETDATA.googleChartUpdate,
        resize: null,
        setSelection: undefined, //function(state, t) { void(state); return true; },
        clearSelection: undefined, //function(state) { void(state); return true; },
        toolboxPanAndZoom: null,
        initialized: false,
        enabled: true,
        xssRegexIgnore: new RegExp('^/api/v1/data\.result.rows$'),
        format: function (state) {
            void(state);
            return 'datatable';
        },
        options: function (state) {
            void(state);
            return '';
        },
        legend: function (state) {
            void(state);
            return null;
        },
        autoresize: function (state) {
            void(state);
            return false;
        },
        max_updates_to_recreate: function (state) {
            void(state);
            return 300;
        },
        track_colors: function (state) {
            void(state);
            return false;
        },
        pixels_per_point: function (state) {
            void(state);
            return 4;
        },
        container_class: function (state) {
            void(state);
            return 'netdata-container';
        }
    },
    // "raphael": {
    //     initialize: NETDATA.raphaelInitialize,
    //     create: NETDATA.raphaelChartCreate,
    //     update: NETDATA.raphaelChartUpdate,
    //     resize: null,
    //     setSelection: undefined, // function(state, t) { void(state); return true; },
    //     clearSelection: undefined, // function(state) { void(state); return true; },
    //     toolboxPanAndZoom: null,
    //     initialized: false,
    //     enabled: true,
    //     xssRegexIgnore: new RegExp('^/api/v1/data\.result.data$'),
    //     format: function(state) { void(state); return 'json'; },
    //     options: function(state) { void(state); return ''; },
    //     legend: function(state) { void(state); return null; },
    //     autoresize: function(state) { void(state); return false; },
    //     max_updates_to_recreate: function(state) { void(state); return 5000; },
    //     track_colors: function(state) { void(state); return false; },
    //     pixels_per_point: function(state) { void(state); return 3; },
    //     container_class: function(state) { void(state); return 'netdata-container'; }
    // },
    // "c3": {
    //     initialize: NETDATA.c3Initialize,
    //     create: NETDATA.c3ChartCreate,
    //     update: NETDATA.c3ChartUpdate,
    //     resize: null,
    //     setSelection: undefined, // function(state, t) { void(state); return true; },
    //     clearSelection: undefined, // function(state) { void(state); return true; },
    //     toolboxPanAndZoom: null,
    //     initialized: false,
    //     enabled: true,
    //     xssRegexIgnore: new RegExp('^/api/v1/data\.result$'),
    //     format: function(state) { void(state); return 'csvjsonarray'; },
    //     options: function(state) { void(state); return 'milliseconds'; },
    //     legend: function(state) { void(state); return null; },
    //     autoresize: function(state) { void(state); return false; },
    //     max_updates_to_recreate: function(state) { void(state); return 5000; },
    //     track_colors: function(state) { void(state); return false; },
    //     pixels_per_point: function(state) { void(state); return 15; },
    //     container_class: function(state) { void(state); return 'netdata-container'; }
    // },
    "d3pie": {
        initialize: NETDATA.d3pieInitialize,
        create: NETDATA.d3pieChartCreate,
        update: NETDATA.d3pieChartUpdate,
        resize: null,
        setSelection: NETDATA.d3pieSetSelection,
        clearSelection: NETDATA.d3pieClearSelection,
        toolboxPanAndZoom: null,
        initialized: false,
        enabled: true,
        xssRegexIgnore: new RegExp('^/api/v1/data\.result.data$'),
        format: function (state) {
            void(state);
            return 'json';
        },
        options: function (state) {
            void(state);
            return 'objectrows' + '%7C' + 'ms';
        },
        legend: function (state) {
            void(state);
            return null;
        },
        autoresize: function (state) {
            void(state);
            return false;
        },
        max_updates_to_recreate: function (state) {
            void(state);
            return 5000;
        },
        track_colors: function (state) {
            void(state);
            return false;
        },
        pixels_per_point: function (state) {
            void(state);
            return 15;
        },
        container_class: function (state) {
            void(state);
            return 'netdata-container';
        }
    },
    "d3": {
        initialize: NETDATA.d3Initialize,
        create: NETDATA.d3ChartCreate,
        update: NETDATA.d3ChartUpdate,
        resize: null,
        setSelection: undefined, // function(state, t) { void(state); return true; },
        clearSelection: undefined, // function(state) { void(state); return true; },
        toolboxPanAndZoom: null,
        initialized: false,
        enabled: true,
        xssRegexIgnore: new RegExp('^/api/v1/data\.result.data$'),
        format: function (state) {
            void(state);
            return 'json';
        },
        options: function (state) {
            void(state);
            return '';
        },
        legend: function (state) {
            void(state);
            return null;
        },
        autoresize: function (state) {
            void(state);
            return false;
        },
        max_updates_to_recreate: function (state) {
            void(state);
            return 5000;
        },
        track_colors: function (state) {
            void(state);
            return false;
        },
        pixels_per_point: function (state) {
            void(state);
            return 3;
        },
        container_class: function (state) {
            void(state);
            return 'netdata-container';
        }
    },
    "easypiechart": {
        initialize: NETDATA.easypiechartInitialize,
        create: NETDATA.easypiechartChartCreate,
        update: NETDATA.easypiechartChartUpdate,
        resize: null,
        setSelection: NETDATA.easypiechartSetSelection,
        clearSelection: NETDATA.easypiechartClearSelection,
        toolboxPanAndZoom: null,
        initialized: false,
        enabled: true,
        xssRegexIgnore: new RegExp('^/api/v1/data\.result$'),
        format: function (state) {
            void(state);
            return 'array';
        },
        options: function (state) {
            void(state);
            return 'absolute';
        },
        legend: function (state) {
            void(state);
            return null;
        },
        autoresize: function (state) {
            void(state);
            return false;
        },
        max_updates_to_recreate: function (state) {
            void(state);
            return 5000;
        },
        track_colors: function (state) {
            void(state);
            return true;
        },
        pixels_per_point: function (state) {
            void(state);
            return 3;
        },
        aspect_ratio: 100,
        container_class: function (state) {
            void(state);
            return 'netdata-container-easypiechart';
        }
    },
    "gauge": {
        initialize: NETDATA.gaugeInitialize,
        create: NETDATA.gaugeChartCreate,
        update: NETDATA.gaugeChartUpdate,
        resize: null,
        setSelection: NETDATA.gaugeSetSelection,
        clearSelection: NETDATA.gaugeClearSelection,
        toolboxPanAndZoom: null,
        initialized: false,
        enabled: true,
        xssRegexIgnore: new RegExp('^/api/v1/data\.result$'),
        format: function (state) {
            void(state);
            return 'array';
        },
        options: function (state) {
            void(state);
            return 'absolute';
        },
        legend: function (state) {
            void(state);
            return null;
        },
        autoresize: function (state) {
            void(state);
            return false;
        },
        max_updates_to_recreate: function (state) {
            void(state);
            return 5000;
        },
        track_colors: function (state) {
            void(state);
            return true;
        },
        pixels_per_point: function (state) {
            void(state);
            return 3;
        },
        aspect_ratio: 60,
        container_class: function (state) {
            void(state);
            return 'netdata-container-gauge';
        }
    },
    "textonly": {
        autoresize: function (state) {
            void(state);
            return false;
        },
        container_class: function (state) {
            void(state);
            return 'netdata-container';
        },
        create: NETDATA.textOnlyCreate,
        enabled: true,
        format: function (state) {
            void(state);
            return 'array';
        },
        initialized: true,
        initialize: function (callback) {
            callback();
        },
        legend: function (state) {
            void(state);
            return null;
        },
        max_updates_to_recreate: function (state) {
            void(state);
            return 5000;
        },
        options: function (state) {
            void(state);
            return 'absolute';
        },
        pixels_per_point: function (state) {
            void(state);
            return 3;
        },
        track_colors: function (state) {
            void(state);
            return false;
        },
        update: NETDATA.textOnlyUpdate,
        xssRegexIgnore: new RegExp('^/api/v1/data\.result$'),
    }
};

NETDATA.registerChartLibrary = function (library, url) {
    if (NETDATA.options.debug.libraries) {
        console.log("registering chart library: " + library);
    }

    NETDATA.chartLibraries[library].url = url;
    NETDATA.chartLibraries[library].initialized = true;
    NETDATA.chartLibraries[library].enabled = true;
};

// *** src/dashboard.js/chart-registry.js

// Chart Registry

// When multiple charts need the same chart, we avoid downloading it
// multiple times (and having it in browser memory multiple time)
// by using this registry.

// Every time we download a chart definition, we save it here with .add()
// Then we try to get it back with .get(). If that fails, we download it.

NETDATA.fixHost = function (host) {
    while (host.slice(-1) === '/') {
        host = host.substring(0, host.length - 1);
    }

    return host;
};

NETDATA.chartRegistry = {
    charts: {},

    globalReset: function () {
        this.charts = {};
    },

    add: function (host, id, data) {
        if (typeof this.charts[host] === 'undefined') {
            this.charts[host] = {};
        }

        //console.log('added ' + host + '/' + id);
        this.charts[host][id] = data;
    },

    get: function (host, id) {
        if (typeof this.charts[host] === 'undefined') {
            return null;
        }

        if (typeof this.charts[host][id] === 'undefined') {
            return null;
        }

        //console.log('cached ' + host + '/' + id);
        return this.charts[host][id];
    },

    downloadAll: function (host, callback) {
        host = NETDATA.fixHost(host);

        let self = this;

        function got_data(h, data, callback) {
            if (data !== null) {
                self.charts[h] = data.charts;

                // update the server timezone in our options
                if (typeof data.timezone === 'string') {
                    NETDATA.options.server_timezone = data.timezone;
                }
            } else {
                NETDATA.error(406, h + '/api/v1/charts');
            }

            if (typeof callback === 'function') {
                callback(data);
            }
        }

        if (netdataSnapshotData !== null) {
            got_data(host, netdataSnapshotData.charts, callback);
        } else {
            $.ajax({
                url: host + '/api/v1/charts',
                async: true,
                cache: false,
                xhrFields: {withCredentials: true} // required for the cookie
            })
                .done(function (data) {
                    data = NETDATA.xss.checkOptional('/api/v1/charts', data);
                    got_data(host, data, callback);
                })
                .fail(function () {
                    NETDATA.error(405, host + '/api/v1/charts');

                    if (typeof callback === 'function') {
                        callback(null);
                    }
                });
        }
    }
};

// Compute common (joint) values over multiple charts.


// commonMin & commonMax

NETDATA.commonMin = {
    keys: {},
    latest: {},

    globalReset: function () {
        this.keys = {};
        this.latest = {};
    },

    get: function (state) {
        if (typeof state.tmp.__commonMin === 'undefined') {
            // get the commonMin setting
            state.tmp.__commonMin = NETDATA.dataAttribute(state.element, 'common-min', null);
        }

        let min = state.data.min;
        let name = state.tmp.__commonMin;

        if (name === null) {
            // we don't need commonMin
            //state.log('no need for commonMin');
            return min;
        }

        let t = this.keys[name];
        if (typeof t === 'undefined') {
            // add our commonMin
            this.keys[name] = {};
            t = this.keys[name];
        }

        let uuid = state.uuid;
        if (typeof t[uuid] !== 'undefined') {
            if (t[uuid] === min) {
                //state.log('commonMin ' + state.tmp.__commonMin + ' not changed: ' + this.latest[name]);
                return this.latest[name];
            } else if (min < this.latest[name]) {
                //state.log('commonMin ' + state.tmp.__commonMin + ' increased: ' + min);
                t[uuid] = min;
                this.latest[name] = min;
                return min;
            }
        }

        // add our min
        t[uuid] = min;

        // find the common min
        let m = min;
        // for (let i in t) {
        //     if (t.hasOwnProperty(i) && t[i] < m) m = t[i];
        // }
        for (var ti of Object.values(t)) {
            if (ti < m) {
                m = ti;
            }
        }

        //state.log('commonMin ' + state.tmp.__commonMin + ' updated: ' + m);
        this.latest[name] = m;
        return m;
    }
};

NETDATA.commonMax = {
    keys: {},
    latest: {},

    globalReset: function () {
        this.keys = {};
        this.latest = {};
    },

    get: function (state) {
        if (typeof state.tmp.__commonMax === 'undefined') {
            // get the commonMax setting
            state.tmp.__commonMax = NETDATA.dataAttribute(state.element, 'common-max', null);
        }

        let max = state.data.max;
        let name = state.tmp.__commonMax;

        if (name === null) {
            // we don't need commonMax
            //state.log('no need for commonMax');
            return max;
        }

        let t = this.keys[name];
        if (typeof t === 'undefined') {
            // add our commonMax
            this.keys[name] = {};
            t = this.keys[name];
        }

        let uuid = state.uuid;
        if (typeof t[uuid] !== 'undefined') {
            if (t[uuid] === max) {
                //state.log('commonMax ' + state.tmp.__commonMax + ' not changed: ' + this.latest[name]);
                return this.latest[name];
            } else if (max > this.latest[name]) {
                //state.log('commonMax ' + state.tmp.__commonMax + ' increased: ' + max);
                t[uuid] = max;
                this.latest[name] = max;
                return max;
            }
        }

        // add our max
        t[uuid] = max;

        // find the common max
        let m = max;
        // for (let i in t) {
        //     if (t.hasOwnProperty(i) && t[i] > m) m = t[i];
        // }
        for (var ti of Object.values(t)) {
            if (ti > m) {
                m = ti;
            }
        }

        //state.log('commonMax ' + state.tmp.__commonMax + ' updated: ' + m);
        this.latest[name] = m;
        return m;
    }
};

NETDATA.commonColors = {
    keys: {},

    globalReset: function () {
        this.keys = {};
    },

    get: function (state, label) {
        let ret = this.refill(state);

        if (typeof ret.assigned[label] === 'undefined') {
            ret.assigned[label] = ret.available.shift();
        }

        return ret.assigned[label];
    },

    refill: function (state) {
        let ret, len;

        if (typeof state.tmp.__commonColors === 'undefined') {
            ret = this.prepare(state);
        } else {
            ret = this.keys[state.tmp.__commonColors];
            if (typeof ret === 'undefined') {
                ret = this.prepare(state);
            }
        }

        if (ret.available.length === 0) {
            if (ret.copy_theme || ret.custom.length === 0) {
                // copy the theme colors
                len = NETDATA.themes.current.colors.length;
                while (len--) {
                    ret.available.unshift(NETDATA.themes.current.colors[len]);
                }
            }

            // copy the custom colors
            len = ret.custom.length;
            while (len--) {
                ret.available.unshift(ret.custom[len]);
            }
        }

        state.colors_assigned = ret.assigned;
        state.colors_available = ret.available;
        state.colors_custom = ret.custom;

        return ret;
    },

    __read_custom_colors: function (state, ret) {
        // add the user supplied colors
        let c = NETDATA.dataAttribute(state.element, 'colors', undefined);
        if (typeof c === 'string' && c.length > 0) {
            c = c.split(' ');
            let len = c.length;

            if (len > 0 && c[len - 1] === 'ONLY') {
                len--;
                ret.copy_theme = false;
            }

            while (len--) {
                ret.custom.unshift(c[len]);
            }
        }
    },

    prepare: function (state) {
        let has_custom_colors = false;

        if (typeof state.tmp.__commonColors === 'undefined') {
            let defname = state.chart.context;

            // if this chart has data-colors=""
            // we should use the chart uuid as the default key (private palette)
            // (data-common-colors="NAME" will be used anyways)
            let c = NETDATA.dataAttribute(state.element, 'colors', undefined);
            if (typeof c === 'string' && c.length > 0) {
                defname = state.uuid;
                has_custom_colors = true;
            }

            // get the commonColors setting
            state.tmp.__commonColors = NETDATA.dataAttribute(state.element, 'common-colors', defname);
        }

        let name = state.tmp.__commonColors;
        let ret = this.keys[name];

        if (typeof ret === 'undefined') {
            // add our commonMax
            this.keys[name] = {
                assigned: {},       // name-value of dimensions and their colors
                available: [],      // an array of colors available to be used
                custom: [],         // the array of colors defined by the user
                charts: {},         // the charts linked to this
                copy_theme: true
            };
            ret = this.keys[name];
        }

        if (typeof ret.charts[state.uuid] === 'undefined') {
            ret.charts[state.uuid] = state;

            if (has_custom_colors) {
                this.__read_custom_colors(state, ret);
            }
        }

        return ret;
    }
};

// *** src/dashboard.js/main.js

// Codacy declarations
/* global clipboard */
/* global Ps */

if (NETDATA.options.debug.main_loop) {
    console.log('welcome to NETDATA');
}

NETDATA.onresizeCallback = null;
NETDATA.onresize = function () {
    NETDATA.options.last_page_resize = Date.now();
    NETDATA.onscroll();

    if (typeof NETDATA.onresizeCallback === 'function') {
        NETDATA.onresizeCallback();
    }
};

NETDATA.abortAllRefreshes = function () {
    let targets = NETDATA.options.targets;
    let len = targets.length;

    while (len--) {
        if (targets[len].fetching_data) {
            if (typeof targets[len].xhr !== 'undefined') {
                targets[len].xhr.abort();
                targets[len].running = false;
                targets[len].fetching_data = false;
            }
        }
    }
};

NETDATA.onscrollStartDelay = function () {
    NETDATA.options.last_page_scroll = Date.now();

    NETDATA.options.on_scroll_refresher_stop_until =
        NETDATA.options.last_page_scroll
        + (NETDATA.options.current.async_on_scroll ? 1000 : 0);
};

NETDATA.onscrollEndDelay = function () {
    NETDATA.options.on_scroll_refresher_stop_until =
        Date.now()
        + (NETDATA.options.current.async_on_scroll ? NETDATA.options.current.onscroll_worker_duration_threshold : 0);
};

NETDATA.onscroll_updater_timeout_id = undefined;
NETDATA.onscrollUpdater = function () {
    NETDATA.globalSelectionSync.stop();

    if (NETDATA.options.abort_ajax_on_scroll) {
        NETDATA.abortAllRefreshes();
    }

    // when the user scrolls he sees that we have
    // hidden all the not-visible charts
    // using this little function we try to switch
    // the charts back to visible quickly

    if (!NETDATA.intersectionObserver.enabled()) {
        if (!NETDATA.options.current.parallel_refresher) {
            let targets = NETDATA.options.targets;
            let len = targets.length;

            while (len--) {
                if (!targets[len].running) {
                    targets[len].isVisible();
                }
            }
        }
    }

    NETDATA.onscrollEndDelay();
};

NETDATA.scrollUp = false;
NETDATA.scrollY = window.scrollY;
NETDATA.onscroll = function () {
    //console.log('onscroll() begin');

    NETDATA.onscrollStartDelay();
    NETDATA.chartRefresherReschedule();

    NETDATA.scrollUp = (window.scrollY > NETDATA.scrollY);
    NETDATA.scrollY = window.scrollY;

    if (NETDATA.onscroll_updater_timeout_id) {
        NETDATA.timeout.clear(NETDATA.onscroll_updater_timeout_id);
    }

    NETDATA.onscroll_updater_timeout_id = NETDATA.timeout.set(NETDATA.onscrollUpdater, 0);
    //console.log('onscroll() end');
};

NETDATA.supportsPassiveEvents = function () {
    if (NETDATA.options.passive_events === null) {
        let supportsPassive = false;
        try {
            let opts = Object.defineProperty({}, 'passive', {
                get: function () {
                    supportsPassive = true;
                }
            });
            window.addEventListener("test", null, opts);
        } catch (e) {
            console.log('browser does not support passive events');
        }

        NETDATA.options.passive_events = supportsPassive;
    }

    // console.log('passive ' + NETDATA.options.passive_events);
    return NETDATA.options.passive_events;
};

window.addEventListener('resize', NETDATA.onresize, NETDATA.supportsPassiveEvents() ? {passive: true} : false);
window.addEventListener('scroll', NETDATA.onscroll, NETDATA.supportsPassiveEvents() ? {passive: true} : false);
// window.onresize = NETDATA.onresize;
// window.onscroll = NETDATA.onscroll;

// ----------------------------------------------------------------------------------------------------------------
// Global Pan and Zoom on charts

// Using this structure are synchronize all the charts, so that
// when you pan or zoom one, all others are automatically refreshed
// to the same timespan.

NETDATA.globalPanAndZoom = {
    seq: 0,                 // timestamp ms
                            // every time a chart is panned or zoomed
                            // we set the timestamp here
                            // then we use it as a sequence number
                            // to find if other charts are synchronized
                            // to this time-range

    master: null,           // the master chart (state), to which all others
                            // are synchronized

    force_before_ms: null,  // the timespan to sync all other charts
    force_after_ms: null,

    callback: null,

    globalReset: function () {
        this.clearMaster();
        this.seq = 0;
        this.master = null;
        this.force_after_ms = null;
        this.force_before_ms = null;
        this.callback = null;
    },

    delay: function () {
        if (NETDATA.options.debug.globalPanAndZoom) {
            console.log('globalPanAndZoom.delay()');
        }

        NETDATA.options.auto_refresher_stop_until = Date.now() + NETDATA.options.current.global_pan_sync_time;
    },

    // set a new master
    setMaster: function (state, after, before) {
        this.delay();

        if (!NETDATA.options.current.sync_pan_and_zoom) {
            return;
        }

        if (this.master === null) {
            if (NETDATA.options.debug.globalPanAndZoom) {
                console.log('globalPanAndZoom.setMaster(' + state.id + ', ' + after + ', ' + before + ') SET MASTER');
            }
        } else if (this.master !== state) {
            if (NETDATA.options.debug.globalPanAndZoom) {
                console.log('globalPanAndZoom.setMaster(' + state.id + ', ' + after + ', ' + before + ') CHANGED MASTER');
            }

            this.master.resetChart(true, true);
        }

        let now = Date.now();
        this.master = state;
        this.seq = now;
        this.force_after_ms = after;
        this.force_before_ms = before;

        if (typeof this.callback === 'function') {
            this.callback(true, after, before);
        }
    },

    // clear the master
    clearMaster: function () {
        // if (NETDATA.options.debug.globalPanAndZoom === true)
        //     console.log('globalPanAndZoom.clearMaster()');
        if (NETDATA.options.debug.globalPanAndZoom) {
            console.log('globalPanAndZoom.clearMaster()');
        }

        if (this.master !== null) {
            let st = this.master;
            this.master = null;
            st.resetChart();
        }

        this.master = null;
        this.seq = 0;
        this.force_after_ms = null;
        this.force_before_ms = null;
        NETDATA.options.auto_refresher_stop_until = 0;

        if (typeof this.callback === 'function') {
            this.callback(false, 0, 0);
        }
    },

    // is the given state the master of the global
    // pan and zoom sync?
    isMaster: function (state) {
        return (this.master === state);
    },

    // are we currently have a global pan and zoom sync?
    isActive: function () {
        return (this.master !== null && this.force_before_ms !== null && this.force_after_ms !== null && this.seq !== 0);
    },

    // check if a chart, other than the master
    // needs to be refreshed, due to the global pan and zoom
    shouldBeAutoRefreshed: function (state) {
        if (this.master === null || this.seq === 0) {
            return false;
        }

        //if (state.needsRecreation())
        //  return true;

        return (state.tm.pan_and_zoom_seq !== this.seq);
    }
};

// ----------------------------------------------------------------------------------------------------------------
// global chart underlay (time-frame highlighting)

NETDATA.globalChartUnderlay = {
    callback: null,         // what to call when a highlighted range is setup
    after: null,            // highlight after this time
    before: null,           // highlight before this time
    view_after: null,       // the charts after_ms viewport when the highlight was setup
    view_before: null,      // the charts before_ms viewport, when the highlight was setup
    state: null,            // the chart the highlight was setup

    isActive: function () {
        return (this.after !== null && this.before !== null);
    },

    hasViewport: function () {
        return (this.state !== null && this.view_after !== null && this.view_before !== null);
    },

    init: function (state, after, before, view_after, view_before) {
        this.state = (typeof state !== 'undefined') ? state : null;
        this.after = (typeof after !== 'undefined' && after !== null && after > 0) ? after : null;
        this.before = (typeof before !== 'undefined' && before !== null && before > 0) ? before : null;
        this.view_after = (typeof view_after !== 'undefined' && view_after !== null && view_after > 0) ? view_after : null;
        this.view_before = (typeof view_before !== 'undefined' && view_before !== null && view_before > 0) ? view_before : null;
    },

    setup: function () {
        if (this.isActive()) {
            if (this.state === null) {
                this.state = NETDATA.options.targets[0];
            }

            if (typeof this.callback === 'function') {
                this.callback(true, this.after, this.before);
            }
        } else {
            if (typeof this.callback === 'function') {
                this.callback(false, 0, 0);
            }
        }
    },

    set: function (state, after, before, view_after, view_before) {
        if (after > before) {
            let t = after;
            after = before;
            before = t;
        }

        this.init(state, after, before, view_after, view_before);

        // if (this.hasViewport() === true)
        //     NETDATA.globalPanAndZoom.setMaster(this.state, this.view_after, this.view_before);
        if (this.hasViewport()) {
            NETDATA.globalPanAndZoom.setMaster(this.state, this.view_after, this.view_before);
        }

        this.setup();
    },

    clear: function () {
        this.after = null;
        this.before = null;
        this.state = null;
        this.view_after = null;
        this.view_before = null;

        if (typeof this.callback === 'function') {
            this.callback(false, 0, 0);
        }
    },

    focus: function () {
        if (this.isActive() && this.hasViewport()) {
            if (this.state === null) {
                this.state = NETDATA.options.targets[0];
            }

            if (NETDATA.globalPanAndZoom.isMaster(this.state)) {
                NETDATA.globalPanAndZoom.clearMaster();
            }

            NETDATA.globalPanAndZoom.setMaster(this.state, this.view_after, this.view_before, true);
        }
    }
};

// ----------------------------------------------------------------------------------------------------------------
// dimensions selection

// TODO
// move color assignment to dimensions, here

let dimensionStatus = function (parent, label, name_div, value_div, color) {
    this.enabled = false;
    this.parent = parent;
    this.label = label;
    this.name_div = null;
    this.value_div = null;
    this.color = NETDATA.themes.current.foreground;
    this.selected = (parent.unselected_count === 0);

    this.setOptions(name_div, value_div, color);
};

dimensionStatus.prototype.invalidate = function () {
    this.name_div = null;
    this.value_div = null;
    this.enabled = false;
};

dimensionStatus.prototype.setOptions = function (name_div, value_div, color) {
    this.color = color;

    if (this.name_div !== name_div) {
        this.name_div = name_div;
        this.name_div.title = this.label;
        this.name_div.style.setProperty('color', this.color, 'important');
        if (!this.selected) {
            this.name_div.className = 'netdata-legend-name not-selected';
        } else {
            this.name_div.className = 'netdata-legend-name selected';
        }
    }

    if (this.value_div !== value_div) {
        this.value_div = value_div;
        this.value_div.title = this.label;
        this.value_div.style.setProperty('color', this.color, 'important');
        if (!this.selected) {
            this.value_div.className = 'netdata-legend-value not-selected';
        } else {
            this.value_div.className = 'netdata-legend-value selected';
        }
    }

    this.enabled = true;
    this.setHandler();
};

dimensionStatus.prototype.setHandler = function () {
    if (!this.enabled) {
        return;
    }

    let ds = this;

    // this.name_div.onmousedown = this.value_div.onmousedown = function(e) {
    this.name_div.onclick = this.value_div.onclick = function (e) {
        e.preventDefault();
        if (ds.isSelected()) {
            // this is selected
            if (e.shiftKey || e.ctrlKey) {
                // control or shift key is pressed -> unselect this (except is none will remain selected, in which case select all)
                ds.unselect();

                if (ds.parent.countSelected() === 0) {
                    ds.parent.selectAll();
                }
            } else {
                // no key is pressed -> select only this (except if it is the only selected already, in which case select all)
                if (ds.parent.countSelected() === 1) {
                    ds.parent.selectAll();
                } else {
                    ds.parent.selectNone();
                    ds.select();
                }
            }
        }
        else {
            // this is not selected
            if (e.shiftKey || e.ctrlKey) {
                // control or shift key is pressed -> select this too
                ds.select();
            } else {
                // no key is pressed -> select only this
                ds.parent.selectNone();
                ds.select();
            }
        }

        ds.parent.state.redrawChart();
    }
};

dimensionStatus.prototype.select = function () {
    if (!this.enabled) {
        return;
    }

    this.name_div.className = 'netdata-legend-name selected';
    this.value_div.className = 'netdata-legend-value selected';
    this.selected = true;
};

dimensionStatus.prototype.unselect = function () {
    if (!this.enabled) {
        return;
    }

    this.name_div.className = 'netdata-legend-name not-selected';
    this.value_div.className = 'netdata-legend-value hidden';
    this.selected = false;
};

dimensionStatus.prototype.isSelected = function () {
    // return(this.enabled === true && this.selected === true);
    return this.enabled && this.selected;
};

// ----------------------------------------------------------------------------------------------------------------

let dimensionsVisibility = function (state) {
    this.state = state;
    this.len = 0;
    this.dimensions = {};
    this.selected_count = 0;
    this.unselected_count = 0;
};

dimensionsVisibility.prototype.dimensionAdd = function (label, name_div, value_div, color) {
    if (typeof this.dimensions[label] === 'undefined') {
        this.len++;
        this.dimensions[label] = new dimensionStatus(this, label, name_div, value_div, color);
    } else {
        this.dimensions[label].setOptions(name_div, value_div, color);
    }

    return this.dimensions[label];
};

dimensionsVisibility.prototype.dimensionGet = function (label) {
    return this.dimensions[label];
};

dimensionsVisibility.prototype.invalidateAll = function () {
    let keys = Object.keys(this.dimensions);
    let len = keys.length;
    while (len--) {
        this.dimensions[keys[len]].invalidate();
    }
};

dimensionsVisibility.prototype.selectAll = function () {
    let keys = Object.keys(this.dimensions);
    let len = keys.length;
    while (len--) {
        this.dimensions[keys[len]].select();
    }
};

dimensionsVisibility.prototype.countSelected = function () {
    let selected = 0;
    let keys = Object.keys(this.dimensions);
    let len = keys.length;
    while (len--) {
        if (this.dimensions[keys[len]].isSelected()) {
            selected++;
        }
    }

    return selected;
};

dimensionsVisibility.prototype.selectNone = function () {
    let keys = Object.keys(this.dimensions);
    let len = keys.length;
    while (len--) {
        this.dimensions[keys[len]].unselect();
    }
};

dimensionsVisibility.prototype.selected2BooleanArray = function (array) {
    let ret = [];
    this.selected_count = 0;
    this.unselected_count = 0;

    let len = array.length;
    while (len--) {
        let ds = this.dimensions[array[len]];
        if (typeof ds === 'undefined') {
            // console.log(array[i] + ' is not found');
            ret.unshift(false);
        } else if (ds.isSelected()) {
            ret.unshift(true);
            this.selected_count++;
        } else {
            ret.unshift(false);
            this.unselected_count++;
        }
    }

    if (this.selected_count === 0 && this.unselected_count !== 0) {
        this.selectAll();
        return this.selected2BooleanArray(array);
    }

    return ret;
};

// ----------------------------------------------------------------------------------------------------------------
// date/time conversion

NETDATA.dateTime = {
    using_timezone: false,

    // these are the old netdata functions
    // we fallback to these, if the new ones fail

    localeDateStringNative: function (d) {
        return d.toLocaleDateString();
    },

    localeTimeStringNative: function (d) {
        return d.toLocaleTimeString();
    },

    xAxisTimeStringNative: function (d) {
        return NETDATA.zeropad(d.getHours()) + ":"
            + NETDATA.zeropad(d.getMinutes()) + ":"
            + NETDATA.zeropad(d.getSeconds());
    },

    // initialize the new date/time conversion
    // functions.
    // if this fails, we fallback to the above
    init: function (timezone) {
        //console.log('init with timezone: ' + timezone);

        // detect browser timezone
        try {
            NETDATA.options.browser_timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        } catch (e) {
            console.log('failed to detect browser timezone: ' + e.toString());
            NETDATA.options.browser_timezone = 'cannot-detect-it';
        }

        let ret = false;

        try {
            let dateOptions = {
                localeMatcher: 'best fit',
                formatMatcher: 'best fit',
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: '2-digit'
            };

            let timeOptions = {
                localeMatcher: 'best fit',
                hour12: false,
                formatMatcher: 'best fit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            };

            let xAxisOptions = {
                localeMatcher: 'best fit',
                hour12: false,
                formatMatcher: 'best fit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            };

            if (typeof timezone === 'string' && timezone !== '' && timezone !== 'default') {
                dateOptions.timeZone = timezone;
                timeOptions.timeZone = timezone;
                timeOptions.timeZoneName = 'short';
                xAxisOptions.timeZone = timezone;
                this.using_timezone = true;
            } else {
                timezone = 'default';
                this.using_timezone = false;
            }

            this.dateFormat = new Intl.DateTimeFormat(navigator.language, dateOptions);
            this.timeFormat = new Intl.DateTimeFormat(navigator.language, timeOptions);
            this.xAxisFormat = new Intl.DateTimeFormat(navigator.language, xAxisOptions);

            this.localeDateString = function (d) {
                return this.dateFormat.format(d);
            };

            this.localeTimeString = function (d) {
                return this.timeFormat.format(d);
            };

            this.xAxisTimeString = function (d) {
                return this.xAxisFormat.format(d);
            };

            //let d = new Date();
            //let t = this.dateFormat.format(d) + ' ' + this.timeFormat.format(d) + ' ' + this.xAxisFormat.format(d);

            ret = true;
        } catch (e) {
            console.log('Cannot setup Date/Time formatting: ' + e.toString());

            timezone = 'default';
            this.localeDateString = this.localeDateStringNative;
            this.localeTimeString = this.localeTimeStringNative;
            this.xAxisTimeString = this.xAxisTimeStringNative;
            this.using_timezone = false;

            ret = false;
        }

        // save it
        //console.log('init setOption timezone: ' + timezone);
        NETDATA.setOption('timezone', timezone);

        return ret;
    }
};
NETDATA.dateTime.init(NETDATA.options.current.timezone);

// ----------------------------------------------------------------------------------------------------------------
// global selection sync

NETDATA.globalSelectionSync = {
    state: null,
    dontSyncBefore: 0,
    last_t: 0,
    slaves: [],
    timeoutId: undefined,

    globalReset: function () {
        this.stop();
        this.state = null;
        this.dontSyncBefore = 0;
        this.last_t = 0;
        this.slaves = [];
        this.timeoutId = undefined;
    },

    active: function () {
        return (this.state !== null);
    },

    // return true if global selection sync can be enabled now
    enabled: function () {
        // console.log('enabled()');
        // can we globally apply selection sync?
        if (!NETDATA.options.current.sync_selection) {
            return false;
        }

        return (this.dontSyncBefore <= Date.now());
    },

    // set the global selection sync master
    setMaster: function (state) {
        if (!this.enabled()) {
            this.stop();
            return;
        }

        if (this.state === state) {
            return;
        }

        if (this.state !== null) {
            this.stop();
        }

        if (NETDATA.options.debug.globalSelectionSync) {
            console.log('globalSelectionSync.setMaster(' + state.id + ')');
        }

        state.selected = true;
        this.state = state;
        this.last_t = 0;

        // find all slaves
        let targets = NETDATA.intersectionObserver.targets();
        this.slaves = [];
        let len = targets.length;
        while (len--) {
            let st = targets[len];
            if (this.state !== st && st.globalSelectionSyncIsEligible()) {
                this.slaves.push(st);
            }
        }

        // this.delay(100);
    },

    // stop global selection sync
    stop: function () {
        if (this.state !== null) {
            if (NETDATA.options.debug.globalSelectionSync) {
                console.log('globalSelectionSync.stop()');
            }

            let len = this.slaves.length;
            while (len--) {
                this.slaves[len].clearSelection();
            }

            this.state.clearSelection();

            this.last_t = 0;
            this.slaves = [];
            this.state = null;
        }
    },

    // delay global selection sync for some time
    delay: function (ms) {
        if (NETDATA.options.current.sync_selection) {
            // if (NETDATA.options.debug.globalSelectionSync === true) {
            if (NETDATA.options.debug.globalSelectionSync) {
                console.log('globalSelectionSync.delay()');
            }

            if (typeof ms === 'number') {
                this.dontSyncBefore = Date.now() + ms;
            } else {
                this.dontSyncBefore = Date.now() + NETDATA.options.current.sync_selection_delay;
            }
        }
    },

    __syncSlaves: function () {
        // if (NETDATA.globalSelectionSync.enabled() === true) {
        if (NETDATA.globalSelectionSync.enabled()) {
            // if (NETDATA.options.debug.globalSelectionSync === true)
            if (NETDATA.options.debug.globalSelectionSync) {
                console.log('globalSelectionSync.__syncSlaves()');
            }

            let t = NETDATA.globalSelectionSync.last_t;
            let len = NETDATA.globalSelectionSync.slaves.length;
            while (len--) {
                NETDATA.globalSelectionSync.slaves[len].setSelection(t);
            }

            this.timeoutId = undefined;
        }
    },

    // sync all the visible charts to the given time
    // this is to be called from the chart libraries
    sync: function (state, t) {
        // if (NETDATA.options.current.sync_selection === true) {
        if (NETDATA.options.current.sync_selection) {
            // if (NETDATA.options.debug.globalSelectionSync === true)
            if (NETDATA.options.debug.globalSelectionSync) {
                console.log('globalSelectionSync.sync(' + state.id + ', ' + t.toString() + ')');
            }

            this.setMaster(state);

            if (t === this.last_t) {
                return;
            }

            this.last_t = t;

            if (state.foreignElementSelection !== null) {
                state.foreignElementSelection.innerText = NETDATA.dateTime.localeDateString(t) + ' ' + NETDATA.dateTime.localeTimeString(t);
            }

            if (this.timeoutId) {
                NETDATA.timeout.clear(this.timeoutId);
            }

            this.timeoutId = NETDATA.timeout.set(this.__syncSlaves, 0);
        }
    }
};

NETDATA.intersectionObserver = {
    observer: null,
    visible_targets: [],

    options: {
        root: null,
        rootMargin: "0px",
        threshold: null
    },

    enabled: function () {
        return this.observer !== null;
    },

    globalReset: function () {
        if (this.observer !== null) {
            this.visible_targets = [];
            this.observer.disconnect();
            this.init();
        }
    },

    targets: function () {
        if (this.enabled() && this.visible_targets.length > 0) {
            return this.visible_targets;
        } else {
            return NETDATA.options.targets;
        }
    },

    switchChartVisibility: function () {
        let old = this.__visibilityRatioOld;

        if (old !== this.__visibilityRatio) {
            if (old === 0 && this.__visibilityRatio > 0) {
                this.unhideChart();
            } else if (old > 0 && this.__visibilityRatio === 0) {
                this.hideChart();
            }

            this.__visibilityRatioOld = this.__visibilityRatio;
        }
    },

    handler: function (entries, observer) {
        entries.forEach(function (entry) {
            let state = NETDATA.chartState(entry.target);

            let idx;
            if (entry.intersectionRatio > 0) {
                idx = NETDATA.intersectionObserver.visible_targets.indexOf(state);
                if (idx === -1) {
                    if (NETDATA.scrollUp) {
                        NETDATA.intersectionObserver.visible_targets.push(state);
                    } else {
                        NETDATA.intersectionObserver.visible_targets.unshift(state);
                    }
                }
                else if (state.__visibilityRatio === 0) {
                    state.log("was not visible until now, but was already in visible_targets");
                }
            } else {
                idx = NETDATA.intersectionObserver.visible_targets.indexOf(state);
                if (idx !== -1) {
                    NETDATA.intersectionObserver.visible_targets.splice(idx, 1);
                } else if (state.__visibilityRatio > 0) {
                    state.log("was visible, but not found in visible_targets");
                }
            }

            state.__visibilityRatio = entry.intersectionRatio;

            if (!NETDATA.options.current.async_on_scroll) {
                if (window.requestIdleCallback) {
                    window.requestIdleCallback(function () {
                        NETDATA.intersectionObserver.switchChartVisibility.call(state);
                    }, {timeout: 100});
                } else {
                    NETDATA.intersectionObserver.switchChartVisibility.call(state);
                }
            }
        });
    },

    observe: function (state) {
        if (this.enabled()) {
            state.__visibilityRatioOld = 0;
            state.__visibilityRatio = 0;
            this.observer.observe(state.element);

            state.isVisible = function () {
                if (!NETDATA.options.current.update_only_visible) {
                    return true;
                }

                NETDATA.intersectionObserver.switchChartVisibility.call(this);

                return this.__visibilityRatio > 0;
            }
        }
    },

    init: function () {
        if (typeof netdataIntersectionObserver === 'undefined' || netdataIntersectionObserver) {
            try {
                this.observer = new IntersectionObserver(this.handler, this.options);
            } catch (e) {
                console.log("IntersectionObserver is not supported on this browser");
                this.observer = null;
            }
        }
        //else {
        //    console.log("IntersectionObserver is disabled");
        //}
    }
};
NETDATA.intersectionObserver.init();

// ----------------------------------------------------------------------------------------------------------------
// Our state object, where all per-chart values are stored

let chartState = function (element) {
    this.element = element;

    // IMPORTANT:
    // all private functions should use 'that', instead of 'this'
    // Alternatively, you can use arrow functions (related issue #4514)
    let that = this;

    // ============================================================================================================
    // ERROR HANDLING

    /* error() - private
     * show an error instead of the chart
     */
    let error = (msg) => {
        let ret = true;

        if (typeof netdataErrorCallback === 'function') {
            ret = netdataErrorCallback('chart', this.id, msg);
        }

        if (ret) {
            this.element.innerHTML = this.id + ': ' + msg;
            this.enabled = false;
            this.current = this.pan;
        }
    };

    // console logging
    this.log = function (msg) {
        console.log(this.id + ' (' + this.library_name + ' ' + this.uuid + '): ' + msg);
    };

    this.debugLog = function (msg) {
        if (this.debug) {
            this.log(msg);
        }
    };

    // ============================================================================================================
    // EARLY INITIALIZATION

    // These are variables that should exist even if the chart is never to be rendered.
    // Be careful what you add here - there may be thousands of charts on the page.

    // GUID - a unique identifier for the chart
    this.uuid = NETDATA.guid();

    // string - the name of chart
    this.id = NETDATA.dataAttribute(this.element, 'netdata', undefined);
    if (typeof this.id === 'undefined') {
        error("netdata elements need data-netdata");
        return;
    }

    // string - the key for localStorage settings
    this.settings_id = NETDATA.dataAttribute(this.element, 'id', null);

    // the user given dimensions of the element
    this.width = NETDATA.dataAttribute(this.element, 'width', NETDATA.chartDefaults.width);
    this.height = NETDATA.dataAttribute(this.element, 'height', NETDATA.chartDefaults.height);
    this.height_original = this.height;

    if (this.settings_id !== null) {
        this.height = NETDATA.localStorageGet('chart_heights.' + this.settings_id, this.height, function (height) {
            // this is the callback that will be called
            // if and when the user resets all localStorage variables
            // to their defaults

            resizeChartToHeight(height);
        });
    }

    // the chart library requested by the user
    this.library_name = NETDATA.dataAttribute(this.element, 'chart-library', NETDATA.chartDefaults.library);

    // check the requested library is available
    // we don't initialize it here - it will be initialized when
    // this chart will be first used
    if (typeof NETDATA.chartLibraries[this.library_name] === 'undefined') {
        NETDATA.error(402, this.library_name);
        error('chart library "' + this.library_name + '" is not found');
        this.enabled = false;
    } else if (!NETDATA.chartLibraries[this.library_name].enabled) {
        NETDATA.error(403, this.library_name);
        error('chart library "' + this.library_name + '" is not enabled');
        this.enabled = false;
    } else {
        this.library = NETDATA.chartLibraries[this.library_name];
    }

    this.auto = {
        name: 'auto',
        autorefresh: true,
        force_update_at: 0, // the timestamp to force the update at
        force_before_ms: null,
        force_after_ms: null
    };
    this.pan = {
        name: 'pan',
        autorefresh: false,
        force_update_at: 0, // the timestamp to force the update at
        force_before_ms: null,
        force_after_ms: null
    };
    this.zoom = {
        name: 'zoom',
        autorefresh: false,
        force_update_at: 0, // the timestamp to force the update at
        force_before_ms: null,
        force_after_ms: null
    };

    // this is a pointer to one of the sub-classes below
    // auto, pan, zoom
    this.current = this.auto;

    this.running = false;                       // boolean - true when the chart is being refreshed now
    this.enabled = true;                        // boolean - is the chart enabled for refresh?

    this.force_update_every = null;             // number - overwrite the visualization update frequency of the chart

    this.tmp = {};

    this.foreignElementBefore = null;
    this.foreignElementAfter = null;
    this.foreignElementDuration = null;
    this.foreignElementUpdateEvery = null;
    this.foreignElementSelection = null;

    // ============================================================================================================
    // PRIVATE FUNCTIONS

    // reset the runtime status variables to their defaults
    const runtimeInit = () => {
        this.paused = false;                        // boolean - is the chart paused for any reason?
        this.selected = false;                      // boolean - is the chart shown a selection?

        this.chart_created = false;                 // boolean - is the library.create() been called?
        this.dom_created = false;                   // boolean - is the chart DOM been created?
        this.fetching_data = false;                 // boolean - true while we fetch data via ajax

        this.updates_counter = 0;                   // numeric - the number of refreshes made so far
        this.updates_since_last_unhide = 0;         // numeric - the number of refreshes made since the last time the chart was unhidden
        this.updates_since_last_creation = 0;       // numeric - the number of refreshes made since the last time the chart was created

        this.tm = {
            last_initialized: 0,                    // milliseconds - the timestamp it was last initialized
            last_dom_created: 0,                    // milliseconds - the timestamp its DOM was last created
            last_mode_switch: 0,                    // milliseconds - the timestamp it switched modes

            last_info_downloaded: 0,                // milliseconds - the timestamp we downloaded the chart
            last_updated: 0,                        // the timestamp the chart last updated with data
            pan_and_zoom_seq: 0,                    // the sequence number of the global synchronization
                                                    // between chart.
                                                    // Used with NETDATA.globalPanAndZoom.seq
            last_visible_check: 0,                  // the time we last checked if it is visible
            last_resized: 0,                        // the time the chart was resized
            last_hidden: 0,                         // the time the chart was hidden
            last_unhidden: 0,                       // the time the chart was unhidden
            last_autorefreshed: 0                   // the time the chart was last refreshed
        };

        this.data = null;                           // the last data as downloaded from the netdata server
        this.data_url = 'invalid://';               // string - the last url used to update the chart
        this.data_points = 0;                       // number - the number of points returned from netdata
        this.data_after = 0;                        // milliseconds - the first timestamp of the data
        this.data_before = 0;                       // milliseconds - the last timestamp of the data
        this.data_update_every = 0;                 // milliseconds - the frequency to update the data

        this.tmp = {};                              // members that can be destroyed to save memory
    };

    // initialize all the variables that are required for the chart to be rendered
    const lateInitialization = () => {
        if (typeof this.host !== 'undefined') {
            return;
        }

        // string - the netdata server URL, without any path
        this.host = NETDATA.dataAttribute(this.element, 'host', NETDATA.serverDefault);

        // make sure the host does not end with /
        // all netdata API requests use absolute paths
        while (this.host.slice(-1) === '/') {
            this.host = this.host.substring(0, this.host.length - 1);
        }

        // string - the grouping method requested by the user
        this.method = NETDATA.dataAttribute(this.element, 'method', NETDATA.chartDefaults.method);
        this.gtime = NETDATA.dataAttribute(this.element, 'gtime', 0);

        // the time-range requested by the user
        this.after = NETDATA.dataAttribute(this.element, 'after', NETDATA.chartDefaults.after);
        this.before = NETDATA.dataAttribute(this.element, 'before', NETDATA.chartDefaults.before);

        // the pixels per point requested by the user
        this.pixels_per_point = NETDATA.dataAttribute(this.element, 'pixels-per-point', 1);
        this.points = NETDATA.dataAttribute(this.element, 'points', null);

        // the forced update_every
        this.force_update_every = NETDATA.dataAttribute(this.element, 'update-every', null);
        if (typeof this.force_update_every !== 'number' || this.force_update_every <= 1) {
            if (this.force_update_every !== null) {
                this.log('ignoring invalid value of property data-update-every');
            }

            this.force_update_every = null;
        } else {
            this.force_update_every *= 1000;
        }

        // the dimensions requested by the user
        this.dimensions = NETDATA.encodeURIComponent(NETDATA.dataAttribute(this.element, 'dimensions', null));

        this.title = NETDATA.dataAttribute(this.element, 'title', null);    // the title of the chart
        this.units = NETDATA.dataAttribute(this.element, 'units', null);    // the units of the chart dimensions
        this.units_desired = NETDATA.dataAttribute(this.element, 'desired-units', NETDATA.options.current.units); // the units of the chart dimensions
        this.units_current = this.units;
        this.units_common = NETDATA.dataAttribute(this.element, 'common-units', null);

        // additional options to pass to netdata
        this.append_options = NETDATA.encodeURIComponent(NETDATA.dataAttribute(this.element, 'append-options', null));

        // override options to pass to netdata
        this.override_options = NETDATA.encodeURIComponent(NETDATA.dataAttribute(this.element, 'override-options', null));

        this.debug = NETDATA.dataAttributeBoolean(this.element, 'debug', false);

        this.value_decimal_detail = -1;
        let d = NETDATA.dataAttribute(this.element, 'decimal-digits', -1);
        if (typeof d === 'number') {
            this.value_decimal_detail = d;
        } else if (typeof d !== 'undefined') {
            this.log('ignoring decimal-digits value: ' + d.toString());
        }

        // if we need to report the rendering speed
        // find the element that needs to be updated
        let refresh_dt_element_name = NETDATA.dataAttribute(this.element, 'dt-element-name', null); // string - the element to print refresh_dt_ms

        if (refresh_dt_element_name !== null) {
            this.refresh_dt_element = document.getElementById(refresh_dt_element_name) || null;
        }
        else {
            this.refresh_dt_element = null;
        }

        this.dimensions_visibility = new dimensionsVisibility(that);

        this.netdata_first = 0;                     // milliseconds - the first timestamp in netdata
        this.netdata_last = 0;                      // milliseconds - the last timestamp in netdata
        this.requested_after = null;                // milliseconds - the timestamp of the request after param
        this.requested_before = null;               // milliseconds - the timestamp of the request before param
        this.requested_padding = null;
        this.view_after = 0;
        this.view_before = 0;

        this.refresh_dt_ms = 0;                     // milliseconds - the time the last refresh took

        // how many retries we have made to load chart data from the server
        this.retries_on_data_failures = 0;

        // color management
        this.colors = null;
        this.colors_assigned = null;
        this.colors_available = null;
        this.colors_custom = null;

        this.element_message = null; // the element already created by the user
        this.element_chart = null; // the element with the chart
        this.element_legend = null; // the element with the legend of the chart (if created by us)
        this.element_legend_childs = {
            content: null,
            hidden: null,
            title_date: null,
            title_time: null,
            title_units: null,
            perfect_scroller: null, // the container to apply perfect scroller to
            series: null
        };

        this.chart_url = null;                      // string - the url to download chart info
        this.chart = null;                          // object - the chart as downloaded from the server

        const getForeignElementById = (opt) => {
            let id = NETDATA.dataAttribute(this.element, opt, null);
            if (id === null) {
                //this.log('option "' + opt + '" is undefined');
                return null;
            }

            let el = document.getElementById(id);
            if (typeof el === 'undefined') {
                this.log('cannot find an element with name "' + id.toString() + '"');
                return null;
            }

            return el;
        };

        this.foreignElementBefore = getForeignElementById('show-before-at');
        this.foreignElementAfter = getForeignElementById('show-after-at');
        this.foreignElementDuration = getForeignElementById('show-duration-at');
        this.foreignElementUpdateEvery = getForeignElementById('show-update-every-at');
        this.foreignElementSelection = getForeignElementById('show-selection-at');
    };

    const destroyDOM = () => {
        if (!this.enabled) {
            return;
        }

        if (this.debug) {
            this.log('destroyDOM()');
        }

        // this.element.className = 'netdata-message icon';
        // this.element.innerHTML = '<i class="fas fa-sync"></i> netdata';
        this.element.innerHTML = '';
        this.element_message = null;
        this.element_legend = null;
        this.element_chart = null;
        this.element_legend_childs.series = null;

        this.chart_created = false;
        this.dom_created = false;

        this.tm.last_resized = 0;
        this.tm.last_dom_created = 0;
    };

    const maxMessageFontSize = () => {
        let screenHeight = screen.height;
        let el = this.element;

        // normally we want a font size, as tall as the element
        let h = el.clientHeight;

        // but give it some air, 20% let's say, or 5 pixels min
        let lost = Math.max(h * 0.2, 5);
        h -= lost;

        // center the text, vertically
        let paddingTop = (lost - 5) / 2;

        // but check the width too
        // it should fit 10 characters in it
        let w = el.clientWidth / 10;
        if (h > w) {
            paddingTop += (h - w) / 2;
            h = w;
        }

        // and don't make it too huge
        // 5% of the screen size is good
        if (h > screenHeight / 20) {
            paddingTop += (h - (screenHeight / 20)) / 2;
            h = screenHeight / 20;
        }

        // set it
        this.element_message.style.fontSize = h.toString() + 'px';
        this.element_message.style.paddingTop = paddingTop.toString() + 'px';
    };

    const showMessageIcon = (icon) => {
        this.element_message.innerHTML = icon;
        maxMessageFontSize();
        $(this.element_message).removeClass('hidden');
        this.tmp.___messageHidden___ = undefined;
    };

    const showLoading = () => {
        if (!this.chart_created) {
            showMessageIcon(NETDATA.icons.loading + ' netdata');
            return true;
        }
        return false;
    };

    let createDOM = () => {
        if (!this.enabled) {
            return;
        }
        lateInitialization();

        destroyDOM();

        if (this.debug) {
            this.log('createDOM()');
        }

        this.element_message = document.createElement('div');
        this.element_message.className = 'netdata-message icon hidden';
        this.element.appendChild(this.element_message);

        this.dom_created = true;
        this.chart_created = false;

        this.tm.last_dom_created = this.tm.last_resized = Date.now();

        showLoading();
    };

    const initDOM = () => {
        this.element.className = this.library.container_class(that);

        if (typeof(this.width) === 'string') {
            this.element.style.width = this.width;
        } else if (typeof(this.width) === 'number') {
            this.element.style.width = this.width.toString() + 'px';
        }

        if (typeof(this.library.aspect_ratio) === 'undefined') {
            if (typeof(this.height) === 'string') {
                this.element.style.height = this.height;
            } else if (typeof(this.height) === 'number') {
                this.element.style.height = this.height.toString() + 'px';
            }
        }

        if (NETDATA.chartDefaults.min_width !== null) {
            this.element.style.min_width = NETDATA.chartDefaults.min_width;
        }
    };

    const invisibleSearchableText = () => {
        return '<span style="position:absolute; opacity: 0; width: 0px;">' + this.id + '</span>';
    };

    /* init() private
     * initialize state variables
     * destroy all (possibly) created state elements
     * create the basic DOM for a chart
     */
    const init = (opt) => {
        if (!this.enabled) {
            return;
        }

        runtimeInit();
        this.element.innerHTML = invisibleSearchableText();

        this.tm.last_initialized = Date.now();
        this.setMode('auto');

        if (opt !== 'fast') {
            if (this.isVisible(true) || opt === 'force') {
                createDOM();
            }
        }
    };

    const hideMessage = () => {
        if (typeof this.tmp.___messageHidden___ === 'undefined') {
            this.tmp.___messageHidden___ = true;
            $(this.element_message).addClass('hidden');
        }
    };

    const showRendering = () => {
        let icon;
        if (this.chart !== null) {
            if (this.chart.chart_type === 'line') {
                icon = NETDATA.icons.lineChart;
            } else {
                icon = NETDATA.icons.areaChart;
            }
        }
        else {
            icon = NETDATA.icons.noChart;
        }

        showMessageIcon(icon + ' netdata' + invisibleSearchableText());
    };

    const isHidden = () => {
        return (typeof this.tmp.___chartIsHidden___ !== 'undefined');
    };

    // hide the chart, when it is not visible - called from isVisible()
    this.hideChart = function () {
        // hide it, if it is not already hidden
        if (isHidden()) {
            return;
        }

        if (this.chart_created) {
            if (NETDATA.options.current.show_help) {
                if (this.element_legend_childs.toolbox !== null) {
                    if (this.debug) {
                        this.log('hideChart(): hidding legend popovers');
                    }

                    $(this.element_legend_childs.toolbox_left).popover('hide');
                    $(this.element_legend_childs.toolbox_reset).popover('hide');
                    $(this.element_legend_childs.toolbox_right).popover('hide');
                    $(this.element_legend_childs.toolbox_zoomin).popover('hide');
                    $(this.element_legend_childs.toolbox_zoomout).popover('hide');
                }

                if (this.element_legend_childs.resize_handler !== null) {
                    $(this.element_legend_childs.resize_handler).popover('hide');
                }

                if (this.element_legend_childs.content !== null) {
                    $(this.element_legend_childs.content).popover('hide');
                }
            }

            if (NETDATA.options.current.destroy_on_hide) {
                if (this.debug) {
                    this.log('hideChart(): initializing chart');
                }

                // we should destroy it
                init('force');
            } else {
                if (this.debug) {
                    this.log('hideChart(): hiding chart');
                }

                showRendering();
                this.element_chart.style.display = 'none';
                this.element.style.willChange = 'auto';
                if (this.element_legend !== null) {
                    this.element_legend.style.display = 'none';
                }
                if (this.element_legend_childs.toolbox !== null) {
                    this.element_legend_childs.toolbox.style.display = 'none';
                }
                if (this.element_legend_childs.resize_handler !== null) {
                    this.element_legend_childs.resize_handler.style.display = 'none';
                }

                this.tm.last_hidden = Date.now();

                // de-allocate data
                // This works, but I not sure there are no corner cases somewhere
                // so it is commented - if the user has memory issues he can
                // set Destroy on Hide for all charts
                // this.data = null;
            }
        }

        this.tmp.___chartIsHidden___ = true;
    };

    // unhide the chart, when it is visible - called from isVisible()
    this.unhideChart = function () {
        if (!isHidden()) {
            return;
        }

        this.tmp.___chartIsHidden___ = undefined;
        this.updates_since_last_unhide = 0;

        if (!this.chart_created) {
            if (this.debug) {
                this.log('unhideChart(): initializing chart');
            }

            // we need to re-initialize it, to show our background
            // logo in bootstrap tabs, until the chart loads
            init('force');
        } else {
            if (this.debug) {
                this.log('unhideChart(): unhiding chart');
            }

            this.element.style.willChange = 'transform';
            this.tm.last_unhidden = Date.now();
            this.element_chart.style.display = '';
            if (this.element_legend !== null) {
                this.element_legend.style.display = '';
            }
            if (this.element_legend_childs.toolbox !== null) {
                this.element_legend_childs.toolbox.style.display = '';
            }
            if (this.element_legend_childs.resize_handler !== null) {
                this.element_legend_childs.resize_handler.style.display = '';
            }
            resizeChart();
            hideMessage();
        }

        if (this.__redraw_on_unhide) {
            if (this.debug) {
                this.log("redrawing chart on unhide");
            }

            this.__redraw_on_unhide = undefined;
            this.redrawChart();
        }
    };

    const canBeRendered = (uncached_visibility) => {
        if (this.debug) {
            this.log('canBeRendered() called');
        }

        if (!NETDATA.options.current.update_only_visible) {
            return true;
        }

        let ret = (
            (
                NETDATA.options.page_is_visible ||
                NETDATA.options.current.stop_updates_when_focus_is_lost === false ||
                this.updates_since_last_unhide === 0
            )
            && isHidden() === false && this.isVisible(uncached_visibility)
        );

        if (this.debug) {
            this.log('canBeRendered(): ' + ret);
        }

        return ret;
    };

    // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers
    const callChartLibraryUpdateSafely = (data) => {
        let status;

        // we should not do this here
        // if we prevent rendering the chart then:
        // 1. globalSelectionSync will be wrong
        // 2. globalPanAndZoom will be wrong
        //if (canBeRendered(true) === false)
        //    return false;

        if (NETDATA.options.fake_chart_rendering) {
            return true;
        }

        this.updates_counter++;
        this.updates_since_last_unhide++;
        this.updates_since_last_creation++;

        if (NETDATA.options.debug.chart_errors) {
            status = this.library.update(that, data);
        } else {
            try {
                status = this.library.update(that, data);
            } catch (err) {
                status = false;
            }
        }

        if (!status) {
            error('chart failed to be updated as ' + this.library_name);
            return false;
        }

        return true;
    };

    // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers
    const callChartLibraryCreateSafely = (data) => {
        let status;

        // we should not do this here
        // if we prevent rendering the chart then:
        // 1. globalSelectionSync will be wrong
        // 2. globalPanAndZoom will be wrong
        //if (canBeRendered(true) === false)
        //    return false;

        if (NETDATA.options.fake_chart_rendering) {
            return true;
        }

        this.updates_counter++;
        this.updates_since_last_unhide++;
        this.updates_since_last_creation++;

        if (NETDATA.options.debug.chart_errors) {
            status = this.library.create(that, data);
        } else {
            try {
                status = this.library.create(that, data);
            } catch (err) {
                status = false;
            }
        }

        if (!status) {
            error('chart failed to be created as ' + this.library_name);
            return false;
        }

        this.chart_created = true;
        this.updates_since_last_creation = 0;
        return true;
    };

    // ----------------------------------------------------------------------------------------------------------------
    // Chart Resize

    // resizeChart() - private
    // to be called just before the chart library to make sure that
    // a properly sized dom is available
    const resizeChart = () => {
        if (this.tm.last_resized < NETDATA.options.last_page_resize) {
            if (!this.chart_created) {
                return;
            }

            if (this.needsRecreation()) {
                if (this.debug) {
                    this.log('resizeChart(): initializing chart');
                }

                init('force');
            } else if (typeof this.library.resize === 'function') {
                if (this.debug) {
                    this.log('resizeChart(): resizing chart');
                }

                this.library.resize(that);

                if (this.element_legend_childs.perfect_scroller !== null) {
                    Ps.update(this.element_legend_childs.perfect_scroller);
                }

                maxMessageFontSize();
            }

            this.tm.last_resized = Date.now();
        }
    };

    // this is the actual chart resize algorithm
    // it will:
    // - resize the entire container
    // - update the internal states
    // - resize the chart as the div changes height
    // - update the scrollbar of the legend
    const resizeChartToHeight = (h) => {
        // console.log(h);
        this.element.style.height = h;

        if (this.settings_id !== null) {
            NETDATA.localStorageSet('chart_heights.' + this.settings_id, h);
        }

        let now = Date.now();
        NETDATA.options.last_page_scroll = now;
        NETDATA.options.auto_refresher_stop_until = now + NETDATA.options.current.stop_updates_while_resizing;

        // force a resize
        this.tm.last_resized = 0;
        resizeChart();
    };

    this.resizeForPrint = function () {
        if (typeof this.element_legend_childs !== 'undefined' && this.element_legend_childs.perfect_scroller !== null) {
            let current = this.element.clientHeight;
            let optimal = current
                + this.element_legend_childs.perfect_scroller.scrollHeight
                - this.element_legend_childs.perfect_scroller.clientHeight;

            if (optimal > current) {
                // this.log('resized');
                this.element.style.height = optimal + 'px';
                this.library.resize(this);
            }
        }
    };

    this.resizeHandler = function (e) {
        e.preventDefault();

        if (typeof this.event_resize === 'undefined'
            || this.event_resize.chart_original_w === 'undefined'
            || this.event_resize.chart_original_h === 'undefined') {
            this.event_resize = {
                chart_original_w: this.element.clientWidth,
                chart_original_h: this.element.clientHeight,
                last: 0
            };
        }

        if (e.type === 'touchstart') {
            this.event_resize.mouse_start_x = e.touches.item(0).pageX;
            this.event_resize.mouse_start_y = e.touches.item(0).pageY;
        } else {
            this.event_resize.mouse_start_x = e.clientX;
            this.event_resize.mouse_start_y = e.clientY;
        }

        this.event_resize.chart_start_w = this.element.clientWidth;
        this.event_resize.chart_start_h = this.element.clientHeight;
        this.event_resize.chart_last_w = this.element.clientWidth;
        this.event_resize.chart_last_h = this.element.clientHeight;

        let now = Date.now();
        if (now - this.event_resize.last <= NETDATA.options.current.double_click_speed && this.element_legend_childs.perfect_scroller !== null) {
            // double click / double tap event

            // console.dir(this.element_legend_childs.content);
            // console.dir(this.element_legend_childs.perfect_scroller);

            // the optimal height of the chart
            // showing the entire legend
            let optimal = this.event_resize.chart_last_h
                + this.element_legend_childs.perfect_scroller.scrollHeight
                - this.element_legend_childs.perfect_scroller.clientHeight;

            // if we are not optimal, be optimal
            if (this.event_resize.chart_last_h !== optimal) {
                // this.log('resize to optimal, current = ' + this.event_resize.chart_last_h.toString() + 'px, original = ' + this.event_resize.chart_original_h.toString() + 'px, optimal = ' + optimal.toString() + 'px, internal = ' + this.height_original.toString());
                resizeChartToHeight(optimal.toString() + 'px');
            }

            // else if the current height is not the original/saved height
            // reset to the original/saved height
            else if (this.event_resize.chart_last_h !== this.event_resize.chart_original_h) {
                // this.log('resize to original, current = ' + this.event_resize.chart_last_h.toString() + 'px, original = ' + this.event_resize.chart_original_h.toString() + 'px, optimal = ' + optimal.toString() + 'px, internal = ' + this.height_original.toString());
                resizeChartToHeight(this.event_resize.chart_original_h.toString() + 'px');
            }

            // else if the current height is not the internal default height
            // reset to the internal default height
            else if ((this.event_resize.chart_last_h.toString() + 'px') !== this.height_original) {
                // this.log('resize to internal default, current = ' + this.event_resize.chart_last_h.toString() + 'px, original = ' + this.event_resize.chart_original_h.toString() + 'px, optimal = ' + optimal.toString() + 'px, internal = ' + this.height_original.toString());
                resizeChartToHeight(this.height_original.toString());
            }

            // else if the current height is not the firstchild's clientheight
            // resize to it
            else if (typeof this.element_legend_childs.perfect_scroller.firstChild !== 'undefined') {
                let parent_rect = this.element.getBoundingClientRect();
                let content_rect = this.element_legend_childs.perfect_scroller.firstElementChild.getBoundingClientRect();
                let wanted = content_rect.top - parent_rect.top + this.element_legend_childs.perfect_scroller.firstChild.clientHeight + 18; // 15 = toolbox + 3 space

                // console.log(parent_rect);
                // console.log(content_rect);
                // console.log(wanted);

                // this.log('resize to firstChild, current = ' + this.event_resize.chart_last_h.toString() + 'px, original = ' + this.event_resize.chart_original_h.toString() + 'px, optimal = ' + optimal.toString() + 'px, internal = ' + this.height_original.toString() + 'px, firstChild = ' + wanted.toString() + 'px' );
                if (this.event_resize.chart_last_h !== wanted) {
                    resizeChartToHeight(wanted.toString() + 'px');
                }
            }
        } else {
            this.event_resize.last = now;

            // process movement event
            document.onmousemove =
                document.ontouchmove =
                    this.element_legend_childs.resize_handler.onmousemove =
                        this.element_legend_childs.resize_handler.ontouchmove =
                            function (e) {
                                let y = null;

                                switch (e.type) {
                                    case 'mousemove':
                                        y = e.clientY;
                                        break;
                                    case 'touchmove':
                                        y = e.touches.item(e.touches - 1).pageY;
                                        break;
                                }

                                if (y !== null) {
                                    let newH = that.event_resize.chart_start_h + y - that.event_resize.mouse_start_y;

                                    if (newH >= 70 && newH !== that.event_resize.chart_last_h) {
                                        resizeChartToHeight(newH.toString() + 'px');
                                        that.event_resize.chart_last_h = newH;
                                    }
                                }
                            };

            // process end event
            document.onmouseup =
                document.ontouchend =
                    this.element_legend_childs.resize_handler.onmouseup =
                        this.element_legend_childs.resize_handler.ontouchend =
                            function (e) {
                                void(e);

                                // remove all the hooks
                                document.onmouseup =
                                    document.onmousemove =
                                        document.ontouchmove =
                                            document.ontouchend =
                                                that.element_legend_childs.resize_handler.onmousemove =
                                                    that.element_legend_childs.resize_handler.ontouchmove =
                                                        that.element_legend_childs.resize_handler.onmouseout =
                                                            that.element_legend_childs.resize_handler.onmouseup =
                                                                that.element_legend_childs.resize_handler.ontouchend =
                                                                    null;

                                // allow auto-refreshes
                                NETDATA.options.auto_refresher_stop_until = 0;
                            };
        }
    };

    const noDataToShow = () => {
        showMessageIcon(NETDATA.icons.noData + ' empty');
        this.legendUpdateDOM();
        this.tm.last_autorefreshed = Date.now();
        // this.data_update_every = 30 * 1000;
        //this.element_chart.style.display = 'none';
        //if (this.element_legend !== null) this.element_legend.style.display = 'none';
        //this.tmp.___chartIsHidden___ = true;
    };

    // ============================================================================================================
    // PUBLIC FUNCTIONS

    this.error = function (msg) {
        error(msg);
    };

    this.setMode = function (m) {
        if (this.current !== null && this.current.name === m) {
            return;
        }

        if (m === 'auto') {
            this.current = this.auto;
        } else if (m === 'pan') {
            this.current = this.pan;
        } else if (m === 'zoom') {
            this.current = this.zoom;
        } else {
            this.current = this.auto;
        }

        this.current.force_update_at = 0;
        this.current.force_before_ms = null;
        this.current.force_after_ms = null;

        this.tm.last_mode_switch = Date.now();
    };

    // ----------------------------------------------------------------------------------------------------------------
    // global selection sync for slaves

    // can the chart participate to the global selection sync as a slave?
    this.globalSelectionSyncIsEligible = function () {
        return (
            this.enabled &&
            this.library !== null &&
            typeof this.library.setSelection === 'function' &&
            this.isVisible() &&
            this.chart_created
        );
    };

    this.setSelection = function (t) {
        if (typeof this.library.setSelection === 'function') {
            // this.selected = this.library.setSelection(this, t) === true;
            this.selected = this.library.setSelection(this, t);
        } else {
            this.selected = true;
        }

        if (this.selected && this.debug) {
            this.log('selection set to ' + t.toString());
        }

        if (this.foreignElementSelection !== null) {
            this.foreignElementSelection.innerText = NETDATA.dateTime.localeDateString(t) + ' ' + NETDATA.dateTime.localeTimeString(t);
        }

        return this.selected;
    };

    this.clearSelection = function () {
        if (this.selected) {
            if (typeof this.library.clearSelection === 'function') {
                this.selected = (this.library.clearSelection(this) !== true);
            } else {
                this.selected = false;
            }

            if (this.selected === false && this.debug) {
                this.log('selection cleared');
            }

            if (this.foreignElementSelection !== null) {
                this.foreignElementSelection.innerText = '';
            }

            this.legendReset();
        }

        return this.selected;
    };

    // ----------------------------------------------------------------------------------------------------------------

    // find if a timestamp (ms) is shown in the current chart
    this.timeIsVisible = function (t) {
        return (t >= this.data_after && t <= this.data_before);
    };

    this.calculateRowForTime = function (t) {
        if (!this.timeIsVisible(t)) {
            return -1;
        }
        return Math.floor((t - this.data_after) / this.data_update_every);
    };

    // ----------------------------------------------------------------------------------------------------------------

    this.pauseChart = function () {
        if (!this.paused) {
            if (this.debug) {
                this.log('pauseChart()');
            }

            this.paused = true;
        }
    };

    this.unpauseChart = function () {
        if (this.paused) {
            if (this.debug) {
                this.log('unpauseChart()');
            }

            this.paused = false;
        }
    };

    this.resetChart = function (dontClearMaster, dontUpdate) {
        if (this.debug) {
            this.log('resetChart(' + dontClearMaster + ', ' + dontUpdate + ') called');
        }

        if (typeof dontClearMaster === 'undefined') {
            dontClearMaster = false;
        }

        if (typeof dontUpdate === 'undefined') {
            dontUpdate = false;
        }

        if (dontClearMaster !== true && NETDATA.globalPanAndZoom.isMaster(this)) {
            if (this.debug) {
                this.log('resetChart() diverting to clearMaster().');
            }
            // this will call us back with master === true
            NETDATA.globalPanAndZoom.clearMaster();
            return;
        }

        this.clearSelection();

        this.tm.pan_and_zoom_seq = 0;

        this.setMode('auto');
        this.current.force_update_at = 0;
        this.current.force_before_ms = null;
        this.current.force_after_ms = null;
        this.tm.last_autorefreshed = 0;
        this.paused = false;
        this.selected = false;
        this.enabled = true;
        // this.debug = false;

        // do not update the chart here
        // or the chart will flip-flop when it is the master
        // of a selection sync and another chart becomes
        // the new master

        if (dontUpdate !== true && this.isVisible()) {
            this.updateChart();
        }
    };

    this.updateChartPanOrZoom = function (after, before, callback) {
        let logme = 'updateChartPanOrZoom(' + after + ', ' + before + '): ';
        let ret = true;

        NETDATA.globalPanAndZoom.delay();
        NETDATA.globalSelectionSync.delay();

        if (this.debug) {
            this.log(logme);
        }

        if (before < after) {
            if (this.debug) {
                this.log(logme + 'flipped parameters, rejecting it.');
            }
            return false;
        }

        if (typeof this.fixed_min_duration === 'undefined') {
            this.fixed_min_duration = Math.round((this.chartWidth() / 30) * this.chart.update_every * 1000);
        }

        let min_duration = this.fixed_min_duration;
        let current_duration = Math.round(this.view_before - this.view_after);

        // round the numbers
        after = Math.round(after);
        before = Math.round(before);

        // align them to update_every
        // stretching them further away
        after -= after % this.data_update_every;
        before += this.data_update_every - (before % this.data_update_every);

        // the final wanted duration
        let wanted_duration = before - after;

        // to allow panning, accept just a point below our minimum
        if ((current_duration - this.data_update_every) < min_duration) {
            min_duration = current_duration - this.data_update_every;
        }

        // we do it, but we adjust to minimum size and return false
        // when the wanted size is below the current and the minimum
        // and we zoom
        if (wanted_duration < current_duration && wanted_duration < min_duration) {
            if (this.debug) {
                this.log(logme + 'too small: min_duration: ' + (min_duration / 1000).toString() + ', wanted: ' + (wanted_duration / 1000).toString());
            }

            min_duration = this.fixed_min_duration;

            let dt = (min_duration - wanted_duration) / 2;
            before += dt;
            after -= dt;
            wanted_duration = before - after;
            ret = false;
        }

        let tolerance = this.data_update_every * 2;
        let movement = Math.abs(before - this.view_before);

        if (Math.abs(current_duration - wanted_duration) <= tolerance && movement <= tolerance && ret) {
            if (this.debug) {
                this.log(logme + 'REJECTING UPDATE: current/min duration: ' + (current_duration / 1000).toString() + '/' + (this.fixed_min_duration / 1000).toString() + ', wanted duration: ' + (wanted_duration / 1000).toString() + ', duration diff: ' + (Math.round(Math.abs(current_duration - wanted_duration) / 1000)).toString() + ', movement: ' + (movement / 1000).toString() + ', tolerance: ' + (tolerance / 1000).toString() + ', returning: ' + false);
            }
            return false;
        }

        if (this.current.name === 'auto') {
            this.log(logme + 'caller called me with mode: ' + this.current.name);
            this.setMode('pan');
        }

        if (this.debug) {
            this.log(logme + 'ACCEPTING UPDATE: current/min duration: ' + (current_duration / 1000).toString() + '/' + (this.fixed_min_duration / 1000).toString() + ', wanted duration: ' + (wanted_duration / 1000).toString() + ', duration diff: ' + (Math.round(Math.abs(current_duration - wanted_duration) / 1000)).toString() + ', movement: ' + (movement / 1000).toString() + ', tolerance: ' + (tolerance / 1000).toString() + ', returning: ' + ret);
        }

        this.current.force_update_at = Date.now() + NETDATA.options.current.pan_and_zoom_delay;
        this.current.force_after_ms = after;
        this.current.force_before_ms = before;
        NETDATA.globalPanAndZoom.setMaster(this, after, before);

        if (ret && typeof callback === 'function') {
            callback();
        }

        return ret;
    };

    this.updateChartPanOrZoomAsyncTimeOutId = undefined;
    this.updateChartPanOrZoomAsync = function (after, before, callback) {
        NETDATA.globalPanAndZoom.delay();
        NETDATA.globalSelectionSync.delay();

        if (!NETDATA.globalPanAndZoom.isMaster(this)) {
            this.pauseChart();
            NETDATA.globalPanAndZoom.setMaster(this, after, before);
            // NETDATA.globalSelectionSync.stop();
            NETDATA.globalSelectionSync.setMaster(this);
        }

        if (this.updateChartPanOrZoomAsyncTimeOutId) {
            NETDATA.timeout.clear(this.updateChartPanOrZoomAsyncTimeOutId);
        }

        NETDATA.timeout.set(function () {
            that.updateChartPanOrZoomAsyncTimeOutId = undefined;
            that.updateChartPanOrZoom(after, before, callback);
        }, 0);
    };

    let _unitsConversionLastUnits = undefined;
    let _unitsConversionLastUnitsDesired = undefined;
    let _unitsConversionLastMin = undefined;
    let _unitsConversionLastMax = undefined;
    let _unitsConversion = function (value) {
        return value;
    };
    this.unitsConversionSetup = function (min, max) {
        if (this.units !== _unitsConversionLastUnits
            || this.units_desired !== _unitsConversionLastUnitsDesired
            || min !== _unitsConversionLastMin
            || max !== _unitsConversionLastMax) {

            _unitsConversionLastUnits = this.units;
            _unitsConversionLastUnitsDesired = this.units_desired;
            _unitsConversionLastMin = min;
            _unitsConversionLastMax = max;

            _unitsConversion = NETDATA.unitsConversion.get(this.uuid, min, max, this.units, this.units_desired, this.units_common, function (units) {
                // console.log('switching units from ' + that.units.toString() + ' to ' + units.toString());
                that.units_current = units;
                that.legendSetUnitsString(that.units_current);
            });
        }
    };

    let _legendFormatValueChartDecimalsLastMin = undefined;
    let _legendFormatValueChartDecimalsLastMax = undefined;
    let _legendFormatValueChartDecimals = -1;
    let _intlNumberFormat = null;
    this.legendFormatValueDecimalsFromMinMax = function (min, max) {
        if (min === _legendFormatValueChartDecimalsLastMin && max === _legendFormatValueChartDecimalsLastMax) {
            return;
        }

        this.unitsConversionSetup(min, max);
        if (_unitsConversion !== null) {
            min = _unitsConversion(min);
            max = _unitsConversion(max);

            if (typeof min !== 'number' || typeof max !== 'number') {
                return;
            }
        }

        _legendFormatValueChartDecimalsLastMin = min;
        _legendFormatValueChartDecimalsLastMax = max;

        let old = _legendFormatValueChartDecimals;

        if (this.data !== null && this.data.min === this.data.max)
        // it is a fixed number, let the visualizer decide based on the value
        {
            _legendFormatValueChartDecimals = -1;
        } else if (this.value_decimal_detail !== -1)
        // there is an override
        {
            _legendFormatValueChartDecimals = this.value_decimal_detail;
        } else {
            // ok, let's calculate the proper number of decimal points
            let delta;

            if (min === max) {
                delta = Math.abs(min);
            } else {
                delta = Math.abs(max - min);
            }

            if (delta > 1000) {
                _legendFormatValueChartDecimals = 0;
            } else if (delta > 10) {
                _legendFormatValueChartDecimals = 1;
            } else if (delta > 1) {
                _legendFormatValueChartDecimals = 2;
            } else if (delta > 0.1) {
                _legendFormatValueChartDecimals = 2;
            } else if (delta > 0.01) {
                _legendFormatValueChartDecimals = 4;
            } else if (delta > 0.001) {
                _legendFormatValueChartDecimals = 5;
            } else if (delta > 0.0001) {
                _legendFormatValueChartDecimals = 6;
            } else {
                _legendFormatValueChartDecimals = 7;
            }
        }

        if (_legendFormatValueChartDecimals !== old) {
            if (_legendFormatValueChartDecimals < 0) {
                _intlNumberFormat = null;
            } else {
                _intlNumberFormat = NETDATA.fastNumberFormat.get(
                    _legendFormatValueChartDecimals,
                    _legendFormatValueChartDecimals
                );
            }
        }
    };

    this.legendFormatValue = function (value) {
        if (typeof value !== 'number') {
            return '-';
        }

        value = _unitsConversion(value);

        if (typeof value !== 'number') {
            return value;
        }

        if (_intlNumberFormat !== null) {
            return _intlNumberFormat.format(value);
        }

        let dmin, dmax;
        if (this.value_decimal_detail !== -1) {
            dmin = dmax = this.value_decimal_detail;
        } else {
            dmin = 0;
            let abs = (value < 0) ? -value : value;
            if (abs > 1000) {
                dmax = 0;
            } else if (abs > 10) {
                dmax = 1;
            } else if (abs > 1) {
                dmax = 2;
            } else if (abs > 0.1) {
                dmax = 2;
            } else if (abs > 0.01) {
                dmax = 4;
            } else if (abs > 0.001) {
                dmax = 5;
            } else if (abs > 0.0001) {
                dmax = 6;
            } else {
                dmax = 7;
            }
        }

        return NETDATA.fastNumberFormat.get(dmin, dmax).format(value);
    };

    this.legendSetLabelValue = function (label, value) {
        let series = this.element_legend_childs.series[label];
        if (typeof series === 'undefined') {
            return;
        }
        if (series.value === null && series.user === null) {
            return;
        }

        /*
        // this slows down firefox and edge significantly
        // since it requires to use innerHTML(), instead of innerText()

        // if the value has not changed, skip DOM update
        //if (series.last === value) return;

        let s, r;
        if (typeof value === 'number') {
            let v = Math.abs(value);
            s = r = this.legendFormatValue(value);

            if (typeof series.last === 'number') {
                if (v > series.last) s += '<i class="fas fa-angle-up" style="width: 8px; text-align: center; overflow: hidden; vertical-align: middle;"></i>';
                else if (v < series.last) s += '<i class="fas fa-angle-down" style="width: 8px; text-align: center; overflow: hidden; vertical-align: middle;"></i>';
                else s += '<i class="fas fa-angle-left" style="width: 8px; text-align: center; overflow: hidden; vertical-align: middle;"></i>';
            }
            else s += '<i class="fas fa-angle-right" style="width: 8px; text-align: center; overflow: hidden; vertical-align: middle;"></i>';

            series.last = v;
        }
        else {
            if (value === null)
                s = r = '';
            else
                s = r = value;

            series.last = value;
        }
        */

        let s = this.legendFormatValue(value);

        // caching: do not update the update to show the same value again
        if (s === series.last_shown_value) {
            return;
        }
        series.last_shown_value = s;

        if (series.value !== null) {
            series.value.innerText = s;
        }
        if (series.user !== null) {
            series.user.innerText = s;
        }
    };

    this.legendSetDateString = function (date) {
        if (this.element_legend_childs.title_date !== null && date !== this.tmp.__last_shown_legend_date) {
            this.element_legend_childs.title_date.innerText = date;
            this.tmp.__last_shown_legend_date = date;
        }
    };

    this.legendSetTimeString = function (time) {
        if (this.element_legend_childs.title_time !== null && time !== this.tmp.__last_shown_legend_time) {
            this.element_legend_childs.title_time.innerText = time;
            this.tmp.__last_shown_legend_time = time;
        }
    };

    this.legendSetUnitsString = function (units) {
        if (this.element_legend_childs.title_units !== null && units !== this.tmp.__last_shown_legend_units) {
            this.element_legend_childs.title_units.innerText = units;
            this.tmp.__last_shown_legend_units = units;
        }
    };

    this.legendSetDateLast = {
        ms: 0,
        date: undefined,
        time: undefined
    };

    this.legendSetDate = function (ms) {
        if (typeof ms !== 'number') {
            this.legendShowUndefined();
            return;
        }

        if (this.legendSetDateLast.ms !== ms) {
            let d = new Date(ms);
            this.legendSetDateLast.ms = ms;
            this.legendSetDateLast.date = NETDATA.dateTime.localeDateString(d);
            this.legendSetDateLast.time = NETDATA.dateTime.localeTimeString(d);
        }

        this.legendSetDateString(this.legendSetDateLast.date);
        this.legendSetTimeString(this.legendSetDateLast.time);
        this.legendSetUnitsString(this.units_current)
    };

    this.legendShowUndefined = function () {
        this.legendSetDateString(this.legendPluginModuleString(false));
        this.legendSetTimeString(this.chart.context.toString());
        // this.legendSetUnitsString(' ');

        if (this.data && this.element_legend_childs.series !== null) {
            let labels = this.data.dimension_names;
            let i = labels.length;
            while (i--) {
                let label = labels[i];

                if (typeof label === 'undefined' || typeof this.element_legend_childs.series[label] === 'undefined') {
                    continue;
                }
                this.legendSetLabelValue(label, null);
            }
        }
    };

    this.legendShowLatestValues = function () {
        if (this.chart === null) {
            return;
        }
        if (this.selected) {
            return;
        }

        if (this.data === null || this.element_legend_childs.series === null) {
            this.legendShowUndefined();
            return;
        }

        let show_undefined = true;
        if (Math.abs(this.netdata_last - this.view_before) <= this.data_update_every) {
            show_undefined = false;
        }

        if (show_undefined) {
            this.legendShowUndefined();
            return;
        }

        this.legendSetDate(this.view_before);

        let labels = this.data.dimension_names;
        let i = labels.length;
        while (i--) {
            let label = labels[i];

            if (typeof label === 'undefined') {
                continue;
            }
            if (typeof this.element_legend_childs.series[label] === 'undefined') {
                continue;
            }

            this.legendSetLabelValue(label, this.data.view_latest_values[i]);
        }
    };

    this.legendReset = function () {
        this.legendShowLatestValues();
    };

    // this should be called just ONCE per dimension per chart
    this.__chartDimensionColor = function (label) {
        let c = NETDATA.commonColors.get(this, label);

        // it is important to maintain a list of colors
        // for this chart only, since the chart library
        // uses this to assign colors to dimensions in the same
        // order the dimension are given to it
        this.colors.push(c);

        return c;
    };

    this.chartPrepareColorPalette = function () {
        NETDATA.commonColors.refill(this);
    };

    // get the ordered list of chart colors
    // this includes user defined colors
    this.chartCustomColors = function () {
        this.chartPrepareColorPalette();

        let colors;
        if (this.colors_custom.length) {
            colors = this.colors_custom;
        } else {
            colors = this.colors;
        }

        if (this.debug) {
            this.log("chartCustomColors() returns:");
            this.log(colors);
        }

        return colors;
    };

    // get the ordered list of chart ASSIGNED colors
    // (this returns only the colors that have been
    //  assigned to dimensions, prepended with any
    // custom colors defined)
    this.chartColors = function () {
        this.chartPrepareColorPalette();

        if (this.debug) {
            this.log("chartColors() returns:");
            this.log(this.colors);
        }

        return this.colors;
    };

    this.legendPluginModuleString = function (withContext) {
        let str = ' ';
        let context = '';

        if (typeof this.chart !== 'undefined') {
            if (withContext && typeof this.chart.context === 'string') {
                context = this.chart.context;
            }

            if (typeof this.chart.plugin === 'string' && this.chart.plugin !== '') {
                str = this.chart.plugin;

                if (str.endsWith(".plugin")) {
                    str = str.substring(0, str.length - 7);
                }

                if (typeof this.chart.module === 'string' && this.chart.module !== '') {
                    str += ':' + this.chart.module;
                }

                if (withContext && context !== '') {
                    str += ', ' + context;
                }
            }
            else if (withContext && context !== '') {
                str = context;
            }
        }

        return str;
    };

    this.legendResolutionTooltip = function () {
        if (!this.chart) {
            return '';
        }

        let collected = this.chart.update_every;
        let viewed = (this.data) ? this.data.view_update_every : collected;

        if (collected === viewed) {
            return "刷新时间 " + NETDATA.seconds4human(collected);
        }

        return "刷新时间 " + NETDATA.seconds4human(viewed) + ", collected every " + NETDATA.seconds4human(collected);
    };

    this.legendUpdateDOM = function () {
        let needed = false, dim, keys, len;

        // check that the legend DOM is up to date for the downloaded dimensions
        if (typeof this.element_legend_childs.series !== 'object' || this.element_legend_childs.series === null) {
            // this.log('the legend does not have any series - requesting legend update');
            needed = true;
        } else if (this.data === null) {
            // this.log('the chart does not have any data - requesting legend update');
            needed = true;
        } else if (typeof this.element_legend_childs.series.labels_key === 'undefined') {
            needed = true;
        } else {
            let labels = this.data.dimension_names.toString();
            if (labels !== this.element_legend_childs.series.labels_key) {
                needed = true;

                if (this.debug) {
                    this.log('新标签："' + labels + '" 不相等的旧标签："' + this.element_legend_childs.series.labels_key + '"');
                }
            }
        }

        if (!needed) {
            // make sure colors available
            this.chartPrepareColorPalette();

            // do we have to update the current values?
            // we do this, only when the visible chart is current
            if (Math.abs(this.netdata_last - this.view_before) <= this.data_update_every) {
                if (this.debug) {
                    this.log('图表处于最新位置...更新图例上的值...');
                }

                //let labels = this.data.dimension_names;
                //let i = labels.length;
                //while (i--)
                //  this.legendSetLabelValue(labels[i], this.data.view_latest_values[i]);
            }
            return;
        }

        if (this.colors === null) {
            // this is the first time we update the chart
            // let's assign colors to all dimensions
            if (this.library.track_colors()) {
                this.colors = [];
                keys = Object.keys(this.chart.dimensions);
                len = keys.length;
                for (let i = 0; i < len; i++) {
                    NETDATA.commonColors.get(this, this.chart.dimensions[keys[i]].name);
                }
            }
        }

        // we will re-generate the colors for the chart
        // based on the dimensions this result has data for
        this.colors = [];

        if (this.debug) {
            this.log('更新图例DOM');
        }

        // mark all dimensions as invalid
        this.dimensions_visibility.invalidateAll();

        const genLabel = function (state, parent, dim, name, count) {
            let color = state.__chartDimensionColor(name);

            let user_element = null;
            let user_id = NETDATA.dataAttribute(state.element, 'show-value-of-' + name.toLowerCase() + '-at', null);
            if (user_id === null) {
                user_id = NETDATA.dataAttribute(state.element, 'show-value-of-' + dim.toLowerCase() + '-at', null);
            }
            if (user_id !== null) {
                user_element = document.getElementById(user_id) || null;
                if (user_element === null) {
                    state.log('找不到ID为的元素： ' + user_id);
                }
            }

            state.element_legend_childs.series[name] = {
                name: document.createElement('span'),
                value: document.createElement('span'),
                user: user_element,
                last: null,
                last_shown_value: null
            };

            let label = state.element_legend_childs.series[name];

            // create the dimension visibility tracking for this label
            state.dimensions_visibility.dimensionAdd(name, label.name, label.value, color);

            let rgb = NETDATA.colorHex2Rgb(color);
            label.name.innerHTML = '<table class="netdata-legend-name-table-'
                + state.chart.chart_type
                + '" style="background-color: '
                + 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + NETDATA.options.current['color_fill_opacity_' + state.chart.chart_type] + ') !important'
                + '"><tr class="netdata-legend-name-tr"><td class="netdata-legend-name-td"></td></tr></table>';

            let text = document.createTextNode(' ' + name);
            label.name.appendChild(text);

            if (count > 0) {
                parent.appendChild(document.createElement('br'));
            }

            parent.appendChild(label.name);
            parent.appendChild(label.value);
        };

        let content = document.createElement('div');

        if (this.element_chart === null) {
            this.element_chart = document.createElement('div');
            this.element_chart.id = this.library_name + '-' + this.uuid + '-chart';
            this.element.appendChild(this.element_chart);

            if (this.hasLegend()) {
                this.element_chart.className = 'netdata-chart-with-legend-right netdata-' + this.library_name + '-chart-with-legend-right';
            } else {
                this.element_chart.className = ' netdata-chart netdata-' + this.library_name + '-chart';
            }
        }

        if (this.hasLegend()) {
            if (this.element_legend === null) {
                this.element_legend = document.createElement('div');
                this.element_legend.className = 'netdata-chart-legend netdata-' + this.library_name + '-legend';
                this.element.appendChild(this.element_legend);
            } else {
                this.element_legend.innerHTML = '';
            }

            this.element_legend_childs = {
                content: content,
                resize_handler: null,
                toolbox: null,
                toolbox_left: null,
                toolbox_right: null,
                toolbox_reset: null,
                toolbox_zoomin: null,
                toolbox_zoomout: null,
                toolbox_volume: null,
                title_date: document.createElement('span'),
                title_time: document.createElement('span'),
                title_units: document.createElement('span'),
                perfect_scroller: document.createElement('div'),
                series: {}
            };

            if (NETDATA.options.current.legend_toolbox && this.library.toolboxPanAndZoom !== null) {
                this.element_legend_childs.toolbox = document.createElement('div');
                this.element_legend_childs.toolbox_left = document.createElement('div');
                this.element_legend_childs.toolbox_right = document.createElement('div');
                this.element_legend_childs.toolbox_reset = document.createElement('div');
                this.element_legend_childs.toolbox_zoomin = document.createElement('div');
                this.element_legend_childs.toolbox_zoomout = document.createElement('div');
                this.element_legend_childs.toolbox_volume = document.createElement('div');

                const getPanAndZoomStep = function (event) {
                    if (event.ctrlKey) {
                        return NETDATA.options.current.pan_and_zoom_factor * NETDATA.options.current.pan_and_zoom_factor_multiplier_control;
                    } else if (event.shiftKey) {
                        return NETDATA.options.current.pan_and_zoom_factor * NETDATA.options.current.pan_and_zoom_factor_multiplier_shift;
                    } else if (event.altKey) {
                        return NETDATA.options.current.pan_and_zoom_factor * NETDATA.options.current.pan_and_zoom_factor_multiplier_alt;
                    } else {
                        return NETDATA.options.current.pan_and_zoom_factor;
                    }
                };

                this.element_legend_childs.toolbox.className += ' netdata-legend-toolbox';
                this.element.appendChild(this.element_legend_childs.toolbox);

                this.element_legend_childs.toolbox_left.className += ' netdata-legend-toolbox-button';
                this.element_legend_childs.toolbox_left.innerHTML = NETDATA.icons.left;
                this.element_legend_childs.toolbox.appendChild(this.element_legend_childs.toolbox_left);
                this.element_legend_childs.toolbox_left.onclick = function (e) {
                    e.preventDefault();

                    let step = (that.view_before - that.view_after) * getPanAndZoomStep(e);
                    let before = that.view_before - step;
                    let after = that.view_after - step;
                    if (after >= that.netdata_first) {
                        that.library.toolboxPanAndZoom(that, after, before);
                    }
                };
                if (NETDATA.options.current.show_help) {
                    $(this.element_legend_childs.toolbox_left).popover({
                        container: "body",
                        animation: false,
                        html: true,
                        trigger: 'hover',
                        placement: 'bottom',
                        delay: {
                            show: NETDATA.options.current.show_help_delay_show_ms,
                            hide: NETDATA.options.current.show_help_delay_hide_ms
                        },
                        title: '向左平移',
                        content: '将图表平移到左侧。您也可以用鼠标或手指（在触摸设备上）<b>拖动</b>。<br/><small>可以从设置中禁用帮助。</small>'
                    });
                }

                this.element_legend_childs.toolbox_reset.className += ' netdata-legend-toolbox-button';
                this.element_legend_childs.toolbox_reset.innerHTML = NETDATA.icons.reset;
                this.element_legend_childs.toolbox.appendChild(this.element_legend_childs.toolbox_reset);
                this.element_legend_childs.toolbox_reset.onclick = function (e) {
                    e.preventDefault();
                    NETDATA.resetAllCharts(that);
                };
                if (NETDATA.options.current.show_help) {
                    $(this.element_legend_childs.toolbox_reset).popover({
                        container: "body",
                        animation: false,
                        html: true,
                        trigger: 'hover',
                        placement: 'bottom',
                        delay: {
                            show: NETDATA.options.current.show_help_delay_show_ms,
                            hide: NETDATA.options.current.show_help_delay_hide_ms
                        },
                        title: '图表重置',
                        content: '将所有图表重置为其默认的自动刷新状态。您也可以用鼠标或手指（在触摸设备上）<b>双击</b>图表内容。<br/><small>可以从设置中禁用帮助。</small>'
                    });
                }

                this.element_legend_childs.toolbox_right.className += ' netdata-legend-toolbox-button';
                this.element_legend_childs.toolbox_right.innerHTML = NETDATA.icons.right;
                this.element_legend_childs.toolbox.appendChild(this.element_legend_childs.toolbox_right);
                this.element_legend_childs.toolbox_right.onclick = function (e) {
                    e.preventDefault();
                    let step = (that.view_before - that.view_after) * getPanAndZoomStep(e);
                    let before = that.view_before + step;
                    let after = that.view_after + step;
                    if (before <= that.netdata_last) {
                        that.library.toolboxPanAndZoom(that, after, before);
                    }
                };
                if (NETDATA.options.current.show_help) {
                    $(this.element_legend_childs.toolbox_right).popover({
                        container: "body",
                        animation: false,
                        html: true,
                        trigger: 'hover',
                        placement: 'bottom',
                        delay: {
                            show: NETDATA.options.current.show_help_delay_show_ms,
                            hide: NETDATA.options.current.show_help_delay_hide_ms
                        },
                        title: '向右平移',
                        content: '将图表平移到右侧。您也可以用鼠标或手指（在触摸设备上）<b>拖动</b>。<br/><small>可以从设置中禁用帮助。</small>'
                    });
                }

                this.element_legend_childs.toolbox_zoomin.className += ' netdata-legend-toolbox-button';
                this.element_legend_childs.toolbox_zoomin.innerHTML = NETDATA.icons.zoomIn;
                this.element_legend_childs.toolbox.appendChild(this.element_legend_childs.toolbox_zoomin);
                this.element_legend_childs.toolbox_zoomin.onclick = function (e) {
                    e.preventDefault();
                    let dt = ((that.view_before - that.view_after) * (getPanAndZoomStep(e) * 0.8) / 2);
                    let before = that.view_before - dt;
                    let after = that.view_after + dt;
                    that.library.toolboxPanAndZoom(that, after, before);
                };
                if (NETDATA.options.current.show_help) {
                    $(this.element_legend_childs.toolbox_zoomin).popover({
                        container: "body",
                        animation: false,
                        html: true,
                        trigger: 'hover',
                        placement: 'bottom',
                        delay: {
                            show: NETDATA.options.current.show_help_delay_show_ms,
                            hide: NETDATA.options.current.show_help_delay_hide_ms
                        },
                        title: '图表放大',
                        content: '放大图表。 您也可以按SHIFT键并选择图表的区域，或者按SHIFT或ALT键并使用鼠标滚轮或两指触摸板滚动来放大或缩小。<br/><small>可以从设置中禁用帮助。</small>'
                    });
                }

                this.element_legend_childs.toolbox_zoomout.className += ' netdata-legend-toolbox-button';
                this.element_legend_childs.toolbox_zoomout.innerHTML = NETDATA.icons.zoomOut;
                this.element_legend_childs.toolbox.appendChild(this.element_legend_childs.toolbox_zoomout);
                this.element_legend_childs.toolbox_zoomout.onclick = function (e) {
                    e.preventDefault();
                    let dt = (((that.view_before - that.view_after) / (1.0 - (getPanAndZoomStep(e) * 0.8)) - (that.view_before - that.view_after)) / 2);
                    let before = that.view_before + dt;
                    let after = that.view_after - dt;

                    that.library.toolboxPanAndZoom(that, after, before);
                };
                if (NETDATA.options.current.show_help) {
                    $(this.element_legend_childs.toolbox_zoomout).popover({
                        container: "body",
                        animation: false,
                        html: true,
                        trigger: 'hover',
                        placement: 'bottom',
                        delay: {
                            show: NETDATA.options.current.show_help_delay_show_ms,
                            hide: NETDATA.options.current.show_help_delay_hide_ms
                        },
                        title: '图表缩小',
                        content: '缩小图表。 您还可以按SHIFT或ALT并使用鼠标滚轮或2指触摸板滚动来放大或缩小。<br/><small>可以从设置中禁用帮助。</small>'
                    });
                }

                //this.element_legend_childs.toolbox_volume.className += ' netdata-legend-toolbox-button';
                //this.element_legend_childs.toolbox_volume.innerHTML = '<i class="fas fa-sort-amount-down"></i>';
                //this.element_legend_childs.toolbox_volume.title = 'Visible Volume';
                //this.element_legend_childs.toolbox.appendChild(this.element_legend_childs.toolbox_volume);
                //this.element_legend_childs.toolbox_volume.onclick = function(e) {
                //e.preventDefault();
                //alert('clicked toolbox_volume on ' + that.id);
                //}
            }

            if (NETDATA.options.current.resize_charts) {
                this.element_legend_childs.resize_handler = document.createElement('div');

                this.element_legend_childs.resize_handler.className += " netdata-legend-resize-handler";
                this.element_legend_childs.resize_handler.innerHTML = NETDATA.icons.resize;
                this.element.appendChild(this.element_legend_childs.resize_handler);
                if (NETDATA.options.current.show_help) {
                    $(this.element_legend_childs.resize_handler).popover({
                        container: "body",
                        animation: false,
                        html: true,
                        trigger: 'hover',
                        placement: 'bottom',
                        delay: {
                            show: NETDATA.options.current.show_help_delay_show_ms,
                            hide: NETDATA.options.current.show_help_delay_hide_ms
                        },
                        title: '图表调整',
                        content: '用鼠标或手指（在触摸设备上）拖动此点，以垂直调整图表大小。您也可以<b>双击它</b>或<b>双击它</b>以在两种状态之间复位：默认状态和适合所有值的状态。<br/><small>帮助可以 从设置中禁用。</small>'
                    });
                }

                // mousedown event
                this.element_legend_childs.resize_handler.onmousedown =
                    function (e) {
                        that.resizeHandler(e);
                    };

                // touchstart event
                this.element_legend_childs.resize_handler.addEventListener('touchstart', function (e) {
                    that.resizeHandler(e);
                }, false);
            }

            if (this.chart) {
                this.element_legend_childs.title_date.title = this.legendPluginModuleString(true);
                this.element_legend_childs.title_time.title = this.legendResolutionTooltip();
            }

            this.element_legend_childs.title_date.className += " netdata-legend-title-date";
            this.element_legend.appendChild(this.element_legend_childs.title_date);
            this.tmp.__last_shown_legend_date = undefined;

            this.element_legend.appendChild(document.createElement('br'));

            this.element_legend_childs.title_time.className += " netdata-legend-title-time";
            this.element_legend.appendChild(this.element_legend_childs.title_time);
            this.tmp.__last_shown_legend_time = undefined;

            this.element_legend.appendChild(document.createElement('br'));

            this.element_legend_childs.title_units.className += " netdata-legend-title-units";
            this.element_legend_childs.title_units.innerText = this.units_current;
            this.element_legend.appendChild(this.element_legend_childs.title_units);
            this.tmp.__last_shown_legend_units = undefined;

            this.element_legend.appendChild(document.createElement('br'));

            this.element_legend_childs.perfect_scroller.className = 'netdata-legend-series';
            this.element_legend.appendChild(this.element_legend_childs.perfect_scroller);

            content.className = 'netdata-legend-series-content';
            this.element_legend_childs.perfect_scroller.appendChild(content);

            this.element_legend_childs.content = content;

            if (NETDATA.options.current.show_help) {
                $(content).popover({
                    container: "body",
                    animation: false,
                    html: true,
                    trigger: 'hover',
                    placement: 'bottom',
                    title: '图表图例',
                    delay: {
                        show: NETDATA.options.current.show_help_delay_show_ms,
                        hide: NETDATA.options.current.show_help_delay_hide_ms
                    },
                    content: '您可以单击或点击值或标签以选择尺寸。通过按SHIFT或CONTROL，可以启用或禁用多个尺寸。<br/><small>可以从设置中禁用帮助。</small>'
                });
            }
        } else {
            this.element_legend_childs = {
                content: content,
                resize_handler: null,
                toolbox: null,
                toolbox_left: null,
                toolbox_right: null,
                toolbox_reset: null,
                toolbox_zoomin: null,
                toolbox_zoomout: null,
                toolbox_volume: null,
                title_date: null,
                title_time: null,
                title_units: null,
                perfect_scroller: null,
                series: {}
            };
        }

        if (this.data) {
            this.element_legend_childs.series.labels_key = this.data.dimension_names.toString();
            if (this.debug) {
                this.log('数据标签： "' + this.element_legend_childs.series.labels_key + '"');
            }

            for (let i = 0, len = this.data.dimension_names.length; i < len; i++) {
                genLabel(this, content, this.data.dimension_ids[i], this.data.dimension_names[i], i);
            }
        } else {
            let tmp = [];
            keys = Object.keys(this.chart.dimensions);
            for (let i = 0, len = keys.length; i < len; i++) {
                dim = keys[i];
                tmp.push(this.chart.dimensions[dim].name);
                genLabel(this, content, dim, this.chart.dimensions[dim].name, i);
            }
            this.element_legend_childs.series.labels_key = tmp.toString();
            if (this.debug) {
                this.log('图表中的标签： "' + this.element_legend_childs.series.labels_key + '"');
            }
        }

        // create a hidden div to be used for hidding
        // the original legend of the chart library
        let el = document.createElement('div');
        if (this.element_legend !== null) {
            this.element_legend.appendChild(el);
        }
        el.style.display = 'none';

        this.element_legend_childs.hidden = document.createElement('div');
        el.appendChild(this.element_legend_childs.hidden);

        if (this.element_legend_childs.perfect_scroller !== null) {
            Ps.initialize(this.element_legend_childs.perfect_scroller, {
                wheelSpeed: 0.2,
                wheelPropagation: true,
                swipePropagation: true,
                minScrollbarLength: null,
                maxScrollbarLength: null,
                useBothWheelAxes: false,
                suppressScrollX: true,
                suppressScrollY: false,
                scrollXMarginOffset: 0,
                scrollYMarginOffset: 0,
                theme: 'default'
            });
            Ps.update(this.element_legend_childs.perfect_scroller);
        }

        this.legendShowLatestValues();
    };

    this.hasLegend = function () {
        if (typeof this.tmp.___hasLegendCache___ !== 'undefined') {
            return this.tmp.___hasLegendCache___;
        }

        let leg = false;
        if (this.library && this.library.legend(this) === 'right-side') {
            leg = true;
        }

        this.tmp.___hasLegendCache___ = leg;
        return leg;
    };

    this.legendWidth = function () {
        return (this.hasLegend()) ? 140 : 0;
    };

    this.legendHeight = function () {
        return $(this.element).height();
    };

    this.chartWidth = function () {
        return $(this.element).width() - this.legendWidth();
    };

    this.chartHeight = function () {
        return $(this.element).height();
    };

    this.chartPixelsPerPoint = function () {
        // force an options provided detail
        let px = this.pixels_per_point;

        if (this.library && px < this.library.pixels_per_point(this)) {
            px = this.library.pixels_per_point(this);
        }

        if (px < NETDATA.options.current.pixels_per_point) {
            px = NETDATA.options.current.pixels_per_point;
        }

        return px;
    };

    this.needsRecreation = function () {
        let ret = (
            this.chart_created &&
            this.library &&
            this.library.autoresize() === false &&
            this.tm.last_resized < NETDATA.options.last_page_resize
        );

        if (this.debug) {
            this.log('needsRecreation(): ' + ret.toString() + ', chart_created = ' + this.chart_created.toString());
        }

        return ret;
    };

    this.chartDataUniqueID = function () {
        return this.id + ',' + this.library_name + ',' + this.dimensions + ',' + this.chartURLOptions(true);
    };

    this.chartURLOptions = function (isForUniqueId) {
        let ret = '';

        if (this.override_options !== null) {
            ret = this.override_options.toString();
        } else {
            ret = this.library.options(this);
        }

        if (this.append_options !== null) {
            ret += '%7C' + this.append_options.toString();
        }

        ret += '%7C' + 'jsonwrap';

        // always add `nonzero` when it's used to create a chartDataUniqueID
        // we cannot just remove `nonzero` because of backwards compatibility with old snapshots
        if (isForUniqueId || NETDATA.options.current.eliminate_zero_dimensions) {
            ret += '%7C' + 'nonzero';
        }

        return ret;
    };

    this.chartURL = function () {
        let after, before, points_multiplier = 1;
        if (NETDATA.globalPanAndZoom.isActive()) {
            if (this.current.force_before_ms !== null && this.current.force_after_ms !== null) {
                this.tm.pan_and_zoom_seq = 0;

                before = Math.round(this.current.force_before_ms / 1000);
                after = Math.round(this.current.force_after_ms / 1000);
                this.view_after = after * 1000;
                this.view_before = before * 1000;

                if (NETDATA.options.current.pan_and_zoom_data_padding) {
                    this.requested_padding = Math.round((before - after) / 2);
                    after -= this.requested_padding;
                    before += this.requested_padding;
                    this.requested_padding *= 1000;
                    points_multiplier = 2;
                }

                this.current.force_before_ms = null;
                this.current.force_after_ms = null;
            } else {
                this.tm.pan_and_zoom_seq = NETDATA.globalPanAndZoom.seq;

                after = Math.round(NETDATA.globalPanAndZoom.force_after_ms / 1000);
                before = Math.round(NETDATA.globalPanAndZoom.force_before_ms / 1000);
                this.view_after = after * 1000;
                this.view_before = before * 1000;

                this.requested_padding = null;
                points_multiplier = 1;
            }
        } else {
            this.tm.pan_and_zoom_seq = 0;

            before = this.before;
            after = this.after;
            this.view_after = after * 1000;
            this.view_before = before * 1000;

            this.requested_padding = null;
            points_multiplier = 1;
        }

        this.requested_after = after * 1000;
        this.requested_before = before * 1000;

        let data_points;
        if (NETDATA.options.force_data_points !== 0) {
            data_points = NETDATA.options.force_data_points;
            this.data_points = data_points;
        } else {
            this.data_points = this.points || Math.round(this.chartWidth() / this.chartPixelsPerPoint());
            data_points = this.data_points * points_multiplier;
        }

        // build the data URL
        this.data_url = this.host + this.chart.data_url;
        this.data_url += "&format=" + this.library.format();
        this.data_url += "&points=" + (data_points).toString();
        this.data_url += "&group=" + this.method;
        this.data_url += "&gtime=" + this.gtime;
        this.data_url += "&options=" + this.chartURLOptions();

        if (after) {
            this.data_url += "&after=" + after.toString();
        }

        if (before) {
            this.data_url += "&before=" + before.toString();
        }

        if (this.dimensions) {
            this.data_url += "&dimensions=" + this.dimensions;
        }

        if (NETDATA.options.debug.chart_data_url || this.debug) {
            this.log('chartURL(): ' + this.data_url + ' WxH:' + this.chartWidth() + 'x' + this.chartHeight() + ' points: ' + data_points.toString() + ' library: ' + this.library_name);
        }
    };

    this.redrawChart = function () {
        if (this.data !== null) {
            this.updateChartWithData(this.data);
        }
    };

    this.updateChartWithData = function (data) {
        if (this.debug) {
            this.log('updateChartWithData() called.');
        }

        // this may force the chart to be re-created
        resizeChart();

        this.data = data;

        let started = Date.now();
        let view_update_every = data.view_update_every * 1000;

        if (this.data_update_every !== view_update_every) {
            if (this.element_legend_childs.title_time) {
                this.element_legend_childs.title_time.title = this.legendResolutionTooltip();
            }
        }

        // if the result is JSON, find the latest update-every
        this.data_update_every = view_update_every;
        this.data_after = data.after * 1000;
        this.data_before = data.before * 1000;
        this.netdata_first = data.first_entry * 1000;
        this.netdata_last = data.last_entry * 1000;
        this.data_points = data.points;

        data.state = this;

        if (NETDATA.options.current.pan_and_zoom_data_padding && this.requested_padding !== null) {
            if (this.view_after < this.data_after) {
                // console.log('adjusting view_after from ' + this.view_after + ' to ' + this.data_after);
                this.view_after = this.data_after;
            }

            if (this.view_before > this.data_before) {
                // console.log('adjusting view_before from ' + this.view_before + ' to ' + this.data_before);
                this.view_before = this.data_before;
            }
        } else {
            this.view_after = this.data_after;
            this.view_before = this.data_before;
        }

        if (this.debug) {
            this.log('UPDATE No ' + this.updates_counter + ' COMPLETED');

            if (this.current.force_after_ms) {
                this.log('STATUS: forced    : ' + (this.current.force_after_ms / 1000).toString() + ' - ' + (this.current.force_before_ms / 1000).toString());
            } else {
                this.log('STATUS: forced    : unset');
            }

            this.log('STATUS: requested : ' + (this.requested_after / 1000).toString() + ' - ' + (this.requested_before / 1000).toString());
            this.log('STATUS: downloaded: ' + (this.data_after / 1000).toString() + ' - ' + (this.data_before / 1000).toString());
            this.log('STATUS: rendered  : ' + (this.view_after / 1000).toString() + ' - ' + (this.view_before / 1000).toString());
            this.log('STATUS: points    : ' + (this.data_points).toString());
        }

        if (this.data_points === 0) {
            noDataToShow();
            return;
        }

        if (this.updates_since_last_creation >= this.library.max_updates_to_recreate()) {
            if (this.debug) {
                this.log('max updates of ' + this.updates_since_last_creation.toString() + ' reached. Forcing re-generation.');
            }

            init('force');
            return;
        }

        // check and update the legend
        this.legendUpdateDOM();

        if (this.chart_created && typeof this.library.update === 'function') {
            if (this.debug) {
                this.log('正在更新图表。。。');
            }

            if (!callChartLibraryUpdateSafely(data)) {
                return;
            }
        } else {
            if (this.debug) {
                this.log('正在创建图表。。。');
            }

            if (!callChartLibraryCreateSafely(data)) {
                return;
            }
        }

        if (this.isVisible()) {
            hideMessage();
            this.legendShowLatestValues();
        } else {
            this.__redraw_on_unhide = true;

            if (this.debug) {
                this.log("在不可见的情况下绘制");
            }
        }

        if (this.selected) {
            NETDATA.globalSelectionSync.stop();
        }

        // update the performance counters
        let now = Date.now();
        this.tm.last_updated = now;

        // don't update last_autorefreshed if this chart is
        // forced to be updated with global PanAndZoom
        if (NETDATA.globalPanAndZoom.isActive()) {
            this.tm.last_autorefreshed = 0;
        } else {
            if (NETDATA.options.current.parallel_refresher && NETDATA.options.current.concurrent_refreshes && typeof this.force_update_every !== 'number') {
                this.tm.last_autorefreshed = now - (now % this.data_update_every);
            } else {
                this.tm.last_autorefreshed = now;
            }
        }

        this.refresh_dt_ms = now - started;
        NETDATA.options.auto_refresher_fast_weight += this.refresh_dt_ms;

        if (this.refresh_dt_element !== null) {
            this.refresh_dt_element.innerText = this.refresh_dt_ms.toString();
        }

        if (this.foreignElementBefore !== null) {
            this.foreignElementBefore.innerText = NETDATA.dateTime.localeDateString(this.view_before) + ' ' + NETDATA.dateTime.localeTimeString(this.view_before);
        }

        if (this.foreignElementAfter !== null) {
            this.foreignElementAfter.innerText = NETDATA.dateTime.localeDateString(this.view_after) + ' ' + NETDATA.dateTime.localeTimeString(this.view_after);
        }

        if (this.foreignElementDuration !== null) {
            this.foreignElementDuration.innerText = NETDATA.seconds4human(Math.floor((this.view_before - this.view_after) / 1000) + 1);
        }

        if (this.foreignElementUpdateEvery !== null) {
            this.foreignElementUpdateEvery.innerText = NETDATA.seconds4human(Math.floor(this.data_update_every / 1000));
        }
    };

    this.getSnapshotData = function (key) {
        if (this.debug) {
            this.log('从快照更新： ' + key);
        }

        if (typeof netdataSnapshotData.data[key] === 'undefined') {
            this.log('快照不包含密钥数据 "' + key + '"');
            return null;
        }

        if (typeof netdataSnapshotData.data[key] !== 'string') {
            this.log('snapshot data for key "' + key + '" is not string');
            return null;
        }

        let uncompressed;
        try {
            uncompressed = netdataSnapshotData.uncompress(netdataSnapshotData.data[key]);

            if (uncompressed === null) {
                this.log('uncompressed snapshot data for key ' + key + ' is null');
                return null;
            }

            if (typeof uncompressed === 'undefined') {
                this.log('uncompressed snapshot data for key ' + key + ' is undefined');
                return null;
            }
        } catch (e) {
            this.log('decompression of snapshot data for key ' + key + ' failed');
            console.log(e);
            uncompressed = null;
        }

        if (typeof uncompressed !== 'string') {
            this.log('uncompressed snapshot data for key ' + key + ' is not string');
            return null;
        }

        let data;
        try {
            data = JSON.parse(uncompressed);
        } catch (e) {
            this.log('parsing snapshot data for key ' + key + ' failed');
            console.log(e);
            data = null;
        }

        return data;
    };

    this.updateChart = function (callback) {
        if (this.debug) {
            this.log('updateChart()');
        }

        if (this.fetching_data) {
            if (this.debug) {
                this.log('updateChart(): I am already updating...');
            }

            if (typeof callback === 'function') {
                return callback(false, 'already running');
            }

            return;
        }

        // due to late initialization of charts and libraries
        // we need to check this too
        if (!this.enabled) {
            if (this.debug) {
                this.log('updateChart(): I am not enabled');
            }

            if (typeof callback === 'function') {
                return callback(false, 'not enabled');
            }

            return;
        }

        if (!canBeRendered()) {
            if (this.debug) {
                this.log('updateChart(): cannot be rendered');
            }

            if (typeof callback === 'function') {
                return callback(false, 'cannot be rendered');
            }

            return;
        }

        if (that.dom_created !== true) {
            if (this.debug) {
                this.log('updateChart(): creating DOM');
            }

            createDOM();
        }

        if (this.chart === null) {
            if (this.debug) {
                this.log('updateChart(): getting chart');
            }

            return this.getChart(function () {
                return that.updateChart(callback);
            });
        }

        if (!this.library.initialized) {
            if (this.library.enabled) {
                if (this.debug) {
                    this.log('updateChart(): initializing chart library');
                }

                return this.library.initialize(function () {
                    return that.updateChart(callback);
                });
            } else {
                error('chart library "' + this.library_name + '" is not available.');

                if (typeof callback === 'function') {
                    return callback(false, 'library not available');
                }

                return;
            }
        }

        this.clearSelection();
        this.chartURL();

        NETDATA.statistics.refreshes_total++;
        NETDATA.statistics.refreshes_active++;

        if (NETDATA.statistics.refreshes_active > NETDATA.statistics.refreshes_active_max) {
            NETDATA.statistics.refreshes_active_max = NETDATA.statistics.refreshes_active;
        }

        let ok = false;
        this.fetching_data = true;

        if (netdataSnapshotData !== null) {
            let key = this.chartDataUniqueID();
            let data = this.getSnapshotData(key);
            if (data !== null) {
                ok = true;
                data = NETDATA.xss.checkData('/api/v1/data', data, this.library.xssRegexIgnore);
                this.updateChartWithData(data);
            } else {
                ok = false;
                error('cannot get data from snapshot for key: "' + key + '"');
                that.tm.last_autorefreshed = Date.now();
            }

            NETDATA.statistics.refreshes_active--;
            this.fetching_data = false;

            if (typeof callback === 'function') {
                callback(ok, 'snapshot');
            }

            return;
        }

        if (this.debug) {
            this.log('updating from ' + this.data_url);
        }

        this.xhr = $.ajax({
            url: this.data_url,
            cache: false,
            async: true,
            headers: {
                'Cache-Control': 'no-cache, no-store',
                'Pragma': 'no-cache'
            },
            xhrFields: {withCredentials: true} // required for the cookie
        })
            .done(function (data) {
                data = NETDATA.xss.checkData('/api/v1/data', data, that.library.xssRegexIgnore);

                that.xhr = undefined;
                that.retries_on_data_failures = 0;
                ok = true;

                if (that.debug) {
                    that.log('data received. updating chart.');
                }

                that.updateChartWithData(data);
            })
            .fail(function (msg) {
                that.xhr = undefined;

                if (msg.statusText !== 'abort') {
                    that.retries_on_data_failures++;
                    if (that.retries_on_data_failures > NETDATA.options.current.retries_on_data_failures) {
                        // that.log('failed ' + that.retries_on_data_failures.toString() + ' times - giving up');
                        that.retries_on_data_failures = 0;
                        error('data download failed for url: ' + that.data_url);
                    }
                    else {
                        that.tm.last_autorefreshed = Date.now();
                        // that.log('failed ' + that.retries_on_data_failures.toString() + ' times, but I will retry');
                    }
                }
            })
            .always(function () {
                that.xhr = undefined;

                NETDATA.statistics.refreshes_active--;
                that.fetching_data = false;

                if (typeof callback === 'function') {
                    return callback(ok, 'download');
                }
            });
    };

    const __isVisible = function () {
        let ret = true;

        if (NETDATA.options.current.update_only_visible !== false) {
            // tolerance is the number of pixels a chart can be off-screen
            // to consider it as visible and refresh it as if was visible
            let tolerance = 0;

            that.tm.last_visible_check = Date.now();

            let rect = that.element.getBoundingClientRect();

            let screenTop = window.scrollY;
            let screenBottom = screenTop + window.innerHeight;

            let chartTop = rect.top + screenTop;
            let chartBottom = chartTop + rect.height;

            ret = !(rect.width === 0 || rect.height === 0 || chartBottom + tolerance < screenTop || chartTop - tolerance > screenBottom);
        }

        if (that.debug) {
            that.log('__isVisible(): ' + ret);
        }

        return ret;
    };

    this.isVisible = function (nocache) {
        // this.log('last_visible_check: ' + this.tm.last_visible_check + ', last_page_scroll: ' + NETDATA.options.last_page_scroll);

        // caching - we do not evaluate the charts visibility
        // if the page has not been scrolled since the last check
        if ((typeof nocache !== 'undefined' && nocache)
            || typeof this.tmp.___isVisible___ === 'undefined'
            || this.tm.last_visible_check <= NETDATA.options.last_page_scroll) {
            this.tmp.___isVisible___ = __isVisible();
            if (this.tmp.___isVisible___) {
                this.unhideChart();
            } else {
                this.hideChart();
            }
        }

        if (this.debug) {
            this.log('isVisible(' + nocache + '): ' + this.tmp.___isVisible___);
        }

        return this.tmp.___isVisible___;
    };

    this.isAutoRefreshable = function () {
        return (this.current.autorefresh);
    };

    this.canBeAutoRefreshed = function () {
        if (!this.enabled) {
            if (this.debug) {
                this.log('canBeAutoRefreshed() -> not enabled');
            }

            return false;
        }

        if (this.running) {
            if (this.debug) {
                this.log('canBeAutoRefreshed() -> already running');
            }

            return false;
        }

        if (this.library === null || this.library.enabled === false) {
            error('charting library "' + this.library_name + '" is not available');
            if (this.debug) {
                this.log('canBeAutoRefreshed() -> chart library ' + this.library_name + ' is not available');
            }

            return false;
        }

        if (!this.isVisible()) {
            if (NETDATA.options.debug.visibility || this.debug) {
                this.log('canBeAutoRefreshed() -> not visible');
            }

            return false;
        }

        let now = Date.now();

        if (this.current.force_update_at !== 0 && this.current.force_update_at < now) {
            if (this.debug) {
                this.log('canBeAutoRefreshed() -> timed force update - allowing this update');
            }

            this.current.force_update_at = 0;
            return true;
        }

        if (!this.isAutoRefreshable()) {
            if (this.debug) {
                this.log('canBeAutoRefreshed() -> not auto-refreshable');
            }

            return false;
        }

        // allow the first update, even if the page is not visible
        if (NETDATA.options.page_is_visible === false && this.updates_counter && this.updates_since_last_unhide) {
            if (NETDATA.options.debug.focus || this.debug) {
                this.log('canBeAutoRefreshed() -> not the first update, and page does not have focus');
            }

            return false;
        }

        if (this.needsRecreation()) {
            if (this.debug) {
                this.log('canBeAutoRefreshed() -> needs re-creation.');
            }

            return true;
        }

        if (NETDATA.options.auto_refresher_stop_until >= now) {
            if (this.debug) {
                this.log('canBeAutoRefreshed() -> stopped until is in future.');
            }

            return false;
        }

        // options valid only for autoRefresh()
        if (NETDATA.globalPanAndZoom.isActive()) {
            if (NETDATA.globalPanAndZoom.shouldBeAutoRefreshed(this)) {
                if (this.debug) {
                    this.log('canBeAutoRefreshed(): global panning: I need an update.');
                }

                return true;
            }
            else {
                if (this.debug) {
                    this.log('canBeAutoRefreshed(): global panning: I am already up to date.');
                }

                return false;
            }
        }

        if (this.selected) {
            if (this.debug) {
                this.log('canBeAutoRefreshed(): I have a selection in place.');
            }

            return false;
        }

        if (this.paused) {
            if (this.debug) {
                this.log('canBeAutoRefreshed(): I am paused.');
            }

            return false;
        }

        let data_update_every = this.data_update_every;
        if (typeof this.force_update_every === 'number') {
            data_update_every = this.force_update_every;
        }

        if (now - this.tm.last_autorefreshed >= data_update_every) {
            if (this.debug) {
                this.log('canBeAutoRefreshed(): It is time to update me. Now: ' + now.toString() + ', last_autorefreshed: ' + this.tm.last_autorefreshed + ', data_update_every: ' + data_update_every + ', delta: ' + (now - this.tm.last_autorefreshed).toString());
            }

            return true;
        }

        return false;
    };

    this.autoRefresh = function (callback) {
        let state = that;

        if (state.canBeAutoRefreshed() && state.running === false) {
            state.running = true;
            state.updateChart(function () {
                state.running = false;

                if (typeof callback === 'function') {
                    return callback();
                }
            });
        } else {
            if (typeof callback === 'function') {
                return callback();
            }
        }
    };

    this.__defaultsFromDownloadedChart = function (chart) {
        this.chart = chart;
        this.chart_url = chart.url;
        this.data_update_every = chart.update_every * 1000;
        this.data_points = Math.round(this.chartWidth() / this.chartPixelsPerPoint());
        this.tm.last_info_downloaded = Date.now();

        if (this.title === null) {
            this.title = chart.title;
        }

        if (this.units === null) {
            this.units = chart.units;
            this.units_current = this.units;
        }
    };

    // fetch the chart description from the netdata server
    this.getChart = function (callback) {
        this.chart = NETDATA.chartRegistry.get(this.host, this.id);
        if (this.chart) {
            this.__defaultsFromDownloadedChart(this.chart);

            if (typeof callback === 'function') {
                return callback();
            }
        } else if (netdataSnapshotData !== null) {
            // console.log(this);
            // console.log(NETDATA.chartRegistry);
            NETDATA.error(404, 'host: ' + this.host + ', chart: ' + this.id);
            error('chart not found in snapshot');

            if (typeof callback === 'function') {
                return callback();
            }
        } else {
            this.chart_url = "/api/v1/chart?chart=" + this.id;

            if (this.debug) {
                this.log('downloading ' + this.chart_url);
            }

            $.ajax({
                url: this.host + this.chart_url,
                cache: false,
                async: true,
                xhrFields: {withCredentials: true} // required for the cookie
            })
                .done(function (chart) {
                    chart = NETDATA.xss.checkOptional('/api/v1/chart', chart);

                    chart.url = that.chart_url;
                    that.__defaultsFromDownloadedChart(chart);
                    NETDATA.chartRegistry.add(that.host, that.id, chart);
                })
                .fail(function () {
                    NETDATA.error(404, that.chart_url);
                    error('chart not found on url "' + that.chart_url + '"');
                })
                .always(function () {
                    if (typeof callback === 'function') {
                        return callback();
                    }
                });
        }
    };

    // ============================================================================================================
    // INITIALIZATION

    initDOM();
    init('fast');
};

NETDATA.resetAllCharts = function (state) {
    // first clear the global selection sync
    // to make sure no chart is in selected state
    NETDATA.globalSelectionSync.stop();

    // there are 2 possibilities here
    // a. state is the global Pan and Zoom master
    // b. state is not the global Pan and Zoom master

    // let master = true;
    // if (NETDATA.globalPanAndZoom.isMaster(state) === false) {
    //     master = false;
    // }
    const master = NETDATA.globalPanAndZoom.isMaster(state);

    // clear the global Pan and Zoom
    // this will also refresh the master
    // and unblock any charts currently mirroring the master
    NETDATA.globalPanAndZoom.clearMaster();

    // if we were not the master, reset our status too
    // this is required because most probably the mouse
    // is over this chart, blocking it from auto-refreshing
    if (master === false && (state.paused || state.selected)) {
        state.resetChart();
    }
};

// get or create a chart state, given a DOM element
NETDATA.chartState = function (element) {
    let self = $(element);

    let state = self.data('netdata-state-object') || null;
    if (state === null) {
        state = new chartState(element);
        self.data('netdata-state-object', state);
    }
    return state;
};

// ----------------------------------------------------------------------------------------------------------------
// Library functions

// Load a script without jquery
// This is used to load jquery - after it is loaded, we use jquery
NETDATA._loadjQuery = function (callback) {
    if (typeof jQuery === 'undefined') {
        if (NETDATA.options.debug.main_loop) {
            console.log('loading ' + NETDATA.jQuery);
        }

        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = NETDATA.jQuery;

        // script.onabort = onError;
        script.onerror = function () {
            NETDATA.error(101, NETDATA.jQuery);
        };
        if (typeof callback === "function") {
            script.onload = function () {
                $ = jQuery;
                return callback();
            };
        }

        let s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(script, s);
    }
    else if (typeof callback === "function") {
        $ = jQuery;
        return callback();
    }
};

NETDATA._loadCSS = function (filename) {
    // don't use jQuery here
    // styles are loaded before jQuery
    // to eliminate showing an unstyled page to the user

    let fileref = document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", filename);

    if (typeof fileref !== 'undefined') {
        document.getElementsByTagName("head")[0].appendChild(fileref);
    }
};

// user function to signal us the DOM has been
// updated.
NETDATA.updatedDom = function () {
    NETDATA.options.updated_dom = true;
};

NETDATA.ready = function (callback) {
    NETDATA.options.pauseCallback = callback;
};

NETDATA.pause = function (callback) {
    if (typeof callback === 'function') {
        if (NETDATA.options.pause) {
            return callback();
        } else {
            NETDATA.options.pauseCallback = callback;
        }
    }
};

NETDATA.unpause = function () {
    NETDATA.options.pauseCallback = null;
    NETDATA.options.updated_dom = true;
    NETDATA.options.pause = false;
};

// ----------------------------------------------------------------------------------------------------------------

// this is purely sequential charts refresher
// it is meant to be autonomous
NETDATA.chartRefresherNoParallel = function (index, callback) {
    let targets = NETDATA.intersectionObserver.targets();

    if (NETDATA.options.debug.main_loop) {
        console.log('NETDATA.chartRefresherNoParallel(' + index + ')');
    }

    if (NETDATA.options.updated_dom) {
        // the dom has been updated
        // get the dom parts again
        NETDATA.parseDom(callback);
        return;
    }
    if (index >= targets.length) {
        if (NETDATA.options.debug.main_loop) {
            console.log('waiting to restart main loop...');
        }

        NETDATA.options.auto_refresher_fast_weight = 0;
        callback();
    } else {
        let state = targets[index];

        if (NETDATA.options.auto_refresher_fast_weight < NETDATA.options.current.fast_render_timeframe) {
            if (NETDATA.options.debug.main_loop) {
                console.log('fast rendering...');
            }

            if (state.isVisible()) {
                NETDATA.timeout.set(function () {
                    state.autoRefresh(function () {
                        NETDATA.chartRefresherNoParallel(++index, callback);
                    });
                }, 0);
            } else {
                NETDATA.chartRefresherNoParallel(++index, callback);
            }
        } else {
            if (NETDATA.options.debug.main_loop) {
                console.log('waiting for next refresh...');
            }
            NETDATA.options.auto_refresher_fast_weight = 0;

            NETDATA.timeout.set(function () {
                state.autoRefresh(function () {
                    NETDATA.chartRefresherNoParallel(++index, callback);
                });
            }, NETDATA.options.current.idle_between_charts);
        }
    }
};

NETDATA.chartRefresherWaitTime = function () {
    return NETDATA.options.current.idle_parallel_loops;
};

// the default refresher
NETDATA.chartRefresherLastRun = 0;
NETDATA.chartRefresherRunsAfterParseDom = 0;
NETDATA.chartRefresherTimeoutId = undefined;

NETDATA.chartRefresherReschedule = function () {
    if (NETDATA.options.current.async_on_scroll) {
        if (NETDATA.chartRefresherTimeoutId) {
            NETDATA.timeout.clear(NETDATA.chartRefresherTimeoutId);
        }
        NETDATA.chartRefresherTimeoutId = NETDATA.timeout.set(NETDATA.chartRefresher, NETDATA.options.current.onscroll_worker_duration_threshold);
        //console.log('chartRefresherReschedule()');
    }
};

NETDATA.chartRefresher = function () {
    // console.log('chartRefresher() begin ' + (Date.now() - NETDATA.chartRefresherLastRun).toString() + ' ms since last run');

    if (NETDATA.options.page_is_visible === false
        && NETDATA.options.current.stop_updates_when_focus_is_lost
        && NETDATA.chartRefresherLastRun > NETDATA.options.last_page_resize
        && NETDATA.chartRefresherLastRun > NETDATA.options.last_page_scroll
        && NETDATA.chartRefresherRunsAfterParseDom > 10
    ) {
        setTimeout(
            NETDATA.chartRefresher,
            NETDATA.options.current.idle_lost_focus
        );

        // console.log('chartRefresher() page without focus, will run in ' + NETDATA.options.current.idle_lost_focus.toString() + ' ms, ' + NETDATA.chartRefresherRunsAfterParseDom.toString());
        return;
    }
    NETDATA.chartRefresherRunsAfterParseDom++;

    let now = Date.now();
    NETDATA.chartRefresherLastRun = now;

    if (now < NETDATA.options.on_scroll_refresher_stop_until) {
        NETDATA.chartRefresherTimeoutId = NETDATA.timeout.set(
            NETDATA.chartRefresher,
            NETDATA.chartRefresherWaitTime()
        );

        // console.log('chartRefresher() end1 will run in ' + NETDATA.chartRefresherWaitTime().toString() + ' ms');
        return;
    }

    if (now < NETDATA.options.auto_refresher_stop_until) {
        NETDATA.chartRefresherTimeoutId = NETDATA.timeout.set(
            NETDATA.chartRefresher,
            NETDATA.chartRefresherWaitTime()
        );

        // console.log('chartRefresher() end2 will run in ' + NETDATA.chartRefresherWaitTime().toString() + ' ms');
        return;
    }

    if (NETDATA.options.pause) {
        // console.log('auto-refresher is paused');
        NETDATA.chartRefresherTimeoutId = NETDATA.timeout.set(
            NETDATA.chartRefresher,
            NETDATA.chartRefresherWaitTime()
        );

        // console.log('chartRefresher() end3 will run in ' + NETDATA.chartRefresherWaitTime().toString() + ' ms');
        return;
    }

    if (typeof NETDATA.options.pauseCallback === 'function') {
        // console.log('auto-refresher is calling pauseCallback');

        NETDATA.options.pause = true;
        NETDATA.options.pauseCallback();
        NETDATA.chartRefresher();

        // console.log('chartRefresher() end4 (nested)');
        return;
    }

    if (!NETDATA.options.current.parallel_refresher) {
        // console.log('auto-refresher is calling chartRefresherNoParallel(0)');
        NETDATA.chartRefresherNoParallel(0, function () {
            NETDATA.chartRefresherTimeoutId = NETDATA.timeout.set(
                NETDATA.chartRefresher,
                NETDATA.options.current.idle_between_loops
            );
        });
        // console.log('chartRefresher() end5 (no parallel, nested)');
        return;
    }

    if (NETDATA.options.updated_dom) {
        // the dom has been updated
        // get the dom parts again
        // console.log('auto-refresher is calling parseDom()');
        NETDATA.parseDom(NETDATA.chartRefresher);
        // console.log('chartRefresher() end6 (parseDom)');
        return;
    }

    if (!NETDATA.globalSelectionSync.active()) {
        let parallel = [];
        let targets = NETDATA.intersectionObserver.targets();
        let len = targets.length;
        let state;
        while (len--) {
            state = targets[len];
            if (state.running || state.isVisible() === false) {
                continue;
            }

            if (!state.library.initialized) {
                if (state.library.enabled) {
                    state.library.initialize(NETDATA.chartRefresher);
                    //console.log('chartRefresher() end6 (library init)');
                    return;
                }
                else {
                    state.error('chart library "' + state.library_name + '" is not enabled.');
                }
            }

            if (NETDATA.scrollUp) {
                parallel.unshift(state);
            } else {
                parallel.push(state);
            }
        }

        len = parallel.length;
        while (len--) {
            state = parallel[len];
            // console.log('auto-refresher executing in parallel for ' + parallel.length.toString() + ' charts');
            // this will execute the jobs in parallel

            if (!state.running) {
                NETDATA.timeout.set(state.autoRefresh, 0);
            }
        }
        //else {
        //    console.log('auto-refresher nothing to do');
        //}
    }

    // run the next refresh iteration
    NETDATA.chartRefresherTimeoutId = NETDATA.timeout.set(
        NETDATA.chartRefresher,
        NETDATA.chartRefresherWaitTime()
    );

    //console.log('chartRefresher() completed in ' + (Date.now() - now).toString() + ' ms');
};

NETDATA.parseDom = function (callback) {
    //console.log('parseDom()');

    NETDATA.options.last_page_scroll = Date.now();
    NETDATA.options.updated_dom = false;
    NETDATA.chartRefresherRunsAfterParseDom = 0;

    let targets = $('div[data-netdata]'); //.filter(':visible');

    if (NETDATA.options.debug.main_loop) {
        console.log('DOM updated - there are ' + targets.length + ' charts on page.');
    }

    NETDATA.intersectionObserver.globalReset();
    NETDATA.options.targets = [];
    let len = targets.length;
    while (len--) {
        // the initialization will take care of sizing
        // and the "loading..." message
        let state = NETDATA.chartState(targets[len]);
        NETDATA.options.targets.push(state);
        NETDATA.intersectionObserver.observe(state);
    }

    if (NETDATA.globalChartUnderlay.isActive()) {
        NETDATA.globalChartUnderlay.setup();
    } else {
        NETDATA.globalChartUnderlay.clear();
    }

    if (typeof callback === 'function') {
        return callback();
    }
};

// this is the main function - where everything starts
NETDATA.started = false;
NETDATA.start = function () {
    // this should be called only once

    if (NETDATA.started) {
        console.log('netdata is already started');
        return;
    }

    NETDATA.started = true;
    NETDATA.options.page_is_visible = true;

    $(window).blur(function () {
        if (NETDATA.options.current.stop_updates_when_focus_is_lost) {
            NETDATA.options.page_is_visible = false;
            if (NETDATA.options.debug.focus) {
                console.log('Lost Focus!');
            }
        }
    });

    $(window).focus(function () {
        if (NETDATA.options.current.stop_updates_when_focus_is_lost) {
            NETDATA.options.page_is_visible = true;
            if (NETDATA.options.debug.focus) {
                console.log('Focus restored!');
            }
        }
    });

    if (typeof document.hasFocus === 'function' && !document.hasFocus()) {
        if (NETDATA.options.current.stop_updates_when_focus_is_lost) {
            NETDATA.options.page_is_visible = false;
            if (NETDATA.options.debug.focus) {
                console.log('Document has no focus!');
            }
        }
    }

    // bootstrap tab switching
    $('a[data-toggle="tab"]').on('shown.bs.tab', NETDATA.onscroll);

    // bootstrap modal switching
    let $modal = $('.modal');
    $modal.on('hidden.bs.modal', NETDATA.onscroll);
    $modal.on('shown.bs.modal', NETDATA.onscroll);

    // bootstrap collapse switching
    let $collapse = $('.collapse');
    $collapse.on('hidden.bs.collapse', NETDATA.onscroll);
    $collapse.on('shown.bs.collapse', NETDATA.onscroll);

    NETDATA.parseDom(NETDATA.chartRefresher);

    // Alarms initialization
    setTimeout(NETDATA.alarms.init, 1000);

    // Registry initialization
    setTimeout(NETDATA.registry.init, netdataRegistryAfterMs);

    if (typeof netdataCallback === 'function') {
        netdataCallback();
    }
};

NETDATA.globalReset = function () {
    NETDATA.intersectionObserver.globalReset();
    NETDATA.globalSelectionSync.globalReset();
    NETDATA.globalPanAndZoom.globalReset();
    NETDATA.chartRegistry.globalReset();
    NETDATA.commonMin.globalReset();
    NETDATA.commonMax.globalReset();
    NETDATA.commonColors.globalReset();
    NETDATA.unitsConversion.globalReset();
    NETDATA.options.targets = [];
    NETDATA.parseDom();
    NETDATA.unpause();
};

// Registry of netdata hosts

NETDATA.alarms = {
    onclick: null,                  // the callback to handle the click - it will be called with the alarm log entry
    chart_div_offset: -50,          // give that space above the chart when scrolling to it
    chart_div_id_prefix: 'chart_',  // the chart DIV IDs have this prefix (they should be NETDATA.name2id(chart.id))
    chart_div_animation_duration: 0,// the duration of the animation while scrolling to a chart

    ms_penalty: 0,                  // the time penalty of the next alarm
    ms_between_notifications: 500,  // firefox moves the alarms off-screen (above, outside the top of the screen)
                                    // if alarms are shown faster than: one per 500ms

    update_every: 10000,            // the time in ms between alarm checks

    notifications: false,           // when true, the browser supports notifications (may not be granted though)
    last_notification_id: 0,        // the id of the last alarm_log we have raised an alarm for
    first_notification_id: 0,       // the id of the first alarm_log entry for this session
                                    // this is used to prevent CLEAR notifications for past events
    // notifications_shown: [],

    server: null,                   // the server to connect to for fetching alarms
    current: null,                  // the list of raised alarms - updated in the background

    // a callback function to call every time the list of raised alarms is refreshed
    callback: (typeof netdataAlarmsActiveCallback === 'function') ? netdataAlarmsActiveCallback : null,

    // a callback function to call every time a notification is shown
    // the return value is used to decide if the notification will be shown
    notificationCallback: (typeof netdataAlarmsNotifCallback === 'function') ? netdataAlarmsNotifCallback : null,

    recipients: null,               // the list (array) of recipients to show alarms for, or null

    recipientMatches: function (to_string, wanted_array) {
        if (typeof wanted_array === 'undefined' || wanted_array === null || Array.isArray(wanted_array) === false) {
            return true;
        }

        let r = ' ' + to_string.toString() + ' ';
        let len = wanted_array.length;
        while (len--) {
            if (r.indexOf(' ' + wanted_array[len] + ' ') >= 0) {
                return true;
            }
        }

        return false;
    },

    activeForRecipients: function () {
        let active = {};
        let data = NETDATA.alarms.current;

        if (typeof data === 'undefined' || data === null) {
            return active;
        }

        for (let x in data.alarms) {
            if (!data.alarms.hasOwnProperty(x)) {
                continue;
            }

            let alarm = data.alarms[x];
            if ((alarm.status === 'WARNING' || alarm.status === 'CRITICAL') && NETDATA.alarms.recipientMatches(alarm.recipient, NETDATA.alarms.recipients)) {
                active[x] = alarm;
            }
        }

        return active;
    },

    notify: function (entry) {
        // console.log('alarm ' + entry.unique_id);

        if (entry.updated) {
            // console.log('alarm ' + entry.unique_id + ' has been updated by another alarm');
            return;
        }

        let value_string = entry.value_string;

        if (NETDATA.alarms.current !== null) {
            // get the current value_string
            let t = NETDATA.alarms.current.alarms[entry.chart + '.' + entry.name];
            if (typeof t !== 'undefined' && entry.status === t.status && typeof t.value_string !== 'undefined') {
                value_string = t.value_string;
            }
        }

        let name = entry.name.replace(/_/g, ' ');
        let status = entry.status.toLowerCase();
        let title = name + ' = ' + value_string.toString();
        let tag = entry.alarm_id;
        let icon = 'images/banner-icon-144x144.png';
        let interaction = false;
        let data = entry;
        let show = true;

        // console.log('alarm ' + entry.unique_id + ' ' + entry.chart + '.' + entry.name + ' is ' +  entry.status);

        switch (entry.status) {
            case 'REMOVED':
                show = false;
                break;

            case 'UNDEFINED':
                return;

            case 'UNINITIALIZED':
                return;

            case 'CLEAR':
                if (entry.unique_id < NETDATA.alarms.first_notification_id) {
                    // console.log('alarm ' + entry.unique_id + ' is not current');
                    return;
                }
                if (entry.old_status === 'UNINITIALIZED' || entry.old_status === 'UNDEFINED') {
                    // console.log('alarm' + entry.unique_id + ' switch to CLEAR from ' + entry.old_status);
                    return;
                }
                if (entry.no_clear_notification) {
                    // console.log('alarm' + entry.unique_id + ' is CLEAR but has no_clear_notification flag');
                    return;
                }
                title = name + ' back to normal (' + value_string.toString() + ')';
                icon = 'images/check-mark-2-128-green.png';
                interaction = false;
                break;

            case 'WARNING':
                if (entry.old_status === 'CRITICAL') {
                    status = 'demoted to ' + entry.status.toLowerCase();
                }

                icon = 'images/alert-128-orange.png';
                interaction = false;
                break;

            case 'CRITICAL':
                if (entry.old_status === 'WARNING') {
                    status = 'escalated to ' + entry.status.toLowerCase();
                }

                icon = 'images/alert-128-red.png';
                interaction = true;
                break;

            default:
                console.log('invalid alarm status ' + entry.status);
                return;
        }

        // filter recipients
        if (show) {
            show = NETDATA.alarms.recipientMatches(entry.recipient, NETDATA.alarms.recipients);
        }

        /*
        // cleanup old notifications with the same alarm_id as this one
        // it does not seem to work on any web browser - so notifications cannot be removed

        let len = NETDATA.alarms.notifications_shown.length;
        while (len--) {
            let n = NETDATA.alarms.notifications_shown[len];
            if (n.data.alarm_id === entry.alarm_id) {
                console.log('removing old alarm ' + n.data.unique_id);

                // close the notification
                n.close.bind(n);

                // remove it from the array
                NETDATA.alarms.notifications_shown.splice(len, 1);
                len = NETDATA.alarms.notifications_shown.length;
            }
        }
        */

        if (show) {
            if (typeof NETDATA.alarms.notificationCallback === 'function') {
                show = NETDATA.alarms.notificationCallback(entry);
            }

            if (show) {
                setTimeout(function () {
                    // show this notification
                    // console.log('new notification: ' + title);
                    let n = new Notification(title, {
                        body: entry.hostname + ' - ' + entry.chart + ' (' + entry.family + ') - ' + status + ': ' + entry.info,
                        tag: tag,
                        requireInteraction: interaction,
                        icon: NETDATA.serverStatic + icon,
                        data: data
                    });

                    n.onclick = function (event) {
                        event.preventDefault();
                        NETDATA.alarms.onclick(event.target.data);
                    };

                    // console.log(n);
                    // NETDATA.alarms.notifications_shown.push(n);
                    // console.log(entry);
                }, NETDATA.alarms.ms_penalty);

                NETDATA.alarms.ms_penalty += NETDATA.alarms.ms_between_notifications;
            }
        }
    },

    scrollToChart: function (chart_id) {
        if (typeof chart_id === 'string') {
            let offset = $('#' + NETDATA.alarms.chart_div_id_prefix + NETDATA.name2id(chart_id)).offset();
            if (typeof offset !== 'undefined') {
                $('html, body').animate({scrollTop: offset.top + NETDATA.alarms.chart_div_offset}, NETDATA.alarms.chart_div_animation_duration);
                return true;
            }
        }
        return false;
    },

    scrollToAlarm: function (alarm) {
        if (typeof alarm === 'object') {
            let ret = NETDATA.alarms.scrollToChart(alarm.chart);

            if (ret && NETDATA.options.page_is_visible === false) {
                window.focus();
            }
            //    alert('netdata dashboard will now scroll to chart: ' + alarm.chart + '\n\nThis alarm opened to bring the browser window in front of the screen. Click on the dashboard to prevent it from appearing again.');
        }

    },

    notifyAll: function () {
        // console.log('FETCHING ALARM LOG');
        NETDATA.alarms.get_log(NETDATA.alarms.last_notification_id, function (data) {
            // console.log('ALARM LOG FETCHED');

            if (data === null || typeof data !== 'object') {
                console.log('invalid alarms log response');
                return;
            }

            if (data.length === 0) {
                console.log('received empty alarm log');
                return;
            }

            // console.log('received alarm log of ' + data.length + ' entries, from ' + data[data.length - 1].unique_id.toString() + ' to ' + data[0].unique_id.toString());

            data.sort(function (a, b) {
                if (a.unique_id > b.unique_id) {
                    return -1;
                }
                if (a.unique_id < b.unique_id) {
                    return 1;
                }
                return 0;
            });

            NETDATA.alarms.ms_penalty = 0;

            let len = data.length;
            while (len--) {
                if (data[len].unique_id > NETDATA.alarms.last_notification_id) {
                    NETDATA.alarms.notify(data[len]);
                }
                //else
                //    console.log('ignoring alarm (older) with id ' + data[len].unique_id.toString());
            }

            NETDATA.alarms.last_notification_id = data[0].unique_id;

            if (typeof netdataAlarmsRemember === 'undefined' || netdataAlarmsRemember) {
                NETDATA.localStorageSet('last_notification_id', NETDATA.alarms.last_notification_id, null);
            }
            // console.log('last notification id = ' + NETDATA.alarms.last_notification_id);
        })
    },

    check_notifications: function () {
        // returns true if we should fire 1+ notifications

        if (NETDATA.alarms.notifications !== true) {
            // console.log('web notifications are not available');
            return false;
        }

        if (Notification.permission !== 'granted') {
            // console.log('web notifications are not granted');
            return false;
        }

        if (typeof NETDATA.alarms.current !== 'undefined' && typeof NETDATA.alarms.current.alarms === 'object') {
            // console.log('can do alarms: old id = ' + NETDATA.alarms.last_notification_id + ' new id = ' + NETDATA.alarms.current.latest_alarm_log_unique_id);

            if (NETDATA.alarms.current.latest_alarm_log_unique_id > NETDATA.alarms.last_notification_id) {
                // console.log('new alarms detected');
                return true;
            }
            //else console.log('no new alarms');
        }
        // else console.log('cannot process alarms');

        return false;
    },

    get: function (what, callback) {
        $.ajax({
            url: NETDATA.alarms.server + '/api/v1/alarms?' + what.toString(),
            async: true,
            cache: false,
            headers: {
                'Cache-Control': 'no-cache, no-store',
                'Pragma': 'no-cache'
            },
            xhrFields: {withCredentials: true} // required for the cookie
        })
            .done(function (data) {
                data = NETDATA.xss.checkOptional('/api/v1/alarms', data /*, '.*\.(calc|calc_parsed|warn|warn_parsed|crit|crit_parsed)$' */);

                if (NETDATA.alarms.first_notification_id === 0 && typeof data.latest_alarm_log_unique_id === 'number') {
                    NETDATA.alarms.first_notification_id = data.latest_alarm_log_unique_id;
                }

                if (typeof callback === 'function') {
                    return callback(data);
                }
            })
            .fail(function () {
                NETDATA.error(415, NETDATA.alarms.server);

                if (typeof callback === 'function') {
                    return callback(null);
                }
            });
    },

    update_forever: function () {
        if (netdataShowAlarms !== true || netdataSnapshotData !== null) {
            return;
        }

        NETDATA.alarms.get('active', function (data) {
            if (data !== null) {
                NETDATA.alarms.current = data;

                if (NETDATA.alarms.check_notifications()) {
                    NETDATA.alarms.notifyAll();
                }

                if (typeof NETDATA.alarms.callback === 'function') {
                    NETDATA.alarms.callback(data);
                }

                // Health monitoring is disabled on this netdata
                if (data.status === false) {
                    return;
                }
            }

            setTimeout(NETDATA.alarms.update_forever, NETDATA.alarms.update_every);
        });
    },

    get_log: function (last_id, callback) {
        // console.log('fetching all log after ' + last_id.toString());
        $.ajax({
            url: NETDATA.alarms.server + '/api/v1/alarm_log?after=' + last_id.toString(),
            async: true,
            cache: false,
            headers: {
                'Cache-Control': 'no-cache, no-store',
                'Pragma': 'no-cache'
            },
            xhrFields: {withCredentials: true} // required for the cookie
        })
            .done(function (data) {
                data = NETDATA.xss.checkOptional('/api/v1/alarm_log', data);

                if (typeof callback === 'function') {
                    return callback(data);
                }
            })
            .fail(function () {
                NETDATA.error(416, NETDATA.alarms.server);

                if (typeof callback === 'function') {
                    return callback(null);
                }
            });
    },

    init: function () {
        NETDATA.alarms.server = NETDATA.fixHost(NETDATA.serverDefault);

        if (typeof netdataAlarmsRemember === 'undefined' || netdataAlarmsRemember) {
            NETDATA.alarms.last_notification_id =
                NETDATA.localStorageGet('last_notification_id', NETDATA.alarms.last_notification_id, null);
        }

        if (NETDATA.alarms.onclick === null) {
            NETDATA.alarms.onclick = NETDATA.alarms.scrollToAlarm;
        }

        if (typeof netdataAlarmsRecipients !== 'undefined' && Array.isArray(netdataAlarmsRecipients)) {
            NETDATA.alarms.recipients = netdataAlarmsRecipients;
        }

        if (netdataShowAlarms) {
            NETDATA.alarms.update_forever();

            if ('Notification' in window) {
                // console.log('notifications available');
                NETDATA.alarms.notifications = true;

                if (Notification.permission === 'default') {
                    Notification.requestPermission();
                }
            }
        }
    }
};

// Registry of netdata hosts

NETDATA.registry = {
    server: null,         // the netdata registry server
    isCloudEnabled: false,// is netdata.cloud functionality enabled?
    cloudBaseURL: null,   // the netdata cloud base url
    person_guid: null,    // the unique ID of this browser / user
    machine_guid: null,   // the unique ID the netdata server that served dashboard.js
    hostname: 'unknown',  // the hostname of the netdata server that served dashboard.js
    machines: null,       // the user's other URLs
    machines_array: null, // the user's other URLs in an array
    person_urls: null,
    anonymous_statistics_checked: false,
    MASKED_DATA: "***",

    isUsingGlobalRegistry: function() {
        return NETDATA.registry.server == "https://registry.my-netdata.io";
    },

    isRegistryEnabled: function() {
        return !(NETDATA.registry.isUsingGlobalRegistry() || isSignedIn())
    },

    parsePersonUrls: function (person_urls) {
        NETDATA.registry.person_urls = person_urls;

        if (person_urls) {
            NETDATA.registry.machines = {};
            NETDATA.registry.machines_array = [];

            let apu = person_urls;
            let i = apu.length;
            while (i--) {
                if (typeof NETDATA.registry.machines[apu[i][0]] === 'undefined') {
                    // console.log('adding: ' + apu[i][4] + ', ' + ((now - apu[i][2]) / 1000).toString());

                    let obj = {
                        guid: apu[i][0],
                        url: apu[i][1],
                        last_t: apu[i][2],
                        accesses: apu[i][3],
                        name: apu[i][4],
                        alternate_urls: []
                    };
                    obj.alternate_urls.push(apu[i][1]);

                    NETDATA.registry.machines[apu[i][0]] = obj;
                    NETDATA.registry.machines_array.push(obj);
                } else {
                    // console.log('appending: ' + apu[i][4] + ', ' + ((now - apu[i][2]) / 1000).toString());

                    let pu = NETDATA.registry.machines[apu[i][0]];
                    if (pu.last_t < apu[i][2]) {
                        pu.url = apu[i][1];
                        pu.last_t = apu[i][2];
                        pu.name = apu[i][4];
                    }
                    pu.accesses += apu[i][3];
                    pu.alternate_urls.push(apu[i][1]);
                }
            }
        }

        if (typeof netdataRegistryCallback === 'function') {
            netdataRegistryCallback(NETDATA.registry.machines_array);
        }
    },

    init: function () {
        if (netdataRegistry !== true) {
            return;
        }

        NETDATA.registry.hello(NETDATA.serverDefault, function (data) {
            if (data) {
                NETDATA.registry.server = data.registry;
                if (data.cloud_base_url !== "") {
                    NETDATA.registry.isCloudEnabled = true;
                    NETDATA.registry.cloudBaseURL = data.cloud_base_url;
                } else {
                    NETDATA.registry.isCloudEnabled = false;
                    NETDATA.registry.cloudBaseURL = "";
                }
                NETDATA.registry.machine_guid = data.machine_guid;
                NETDATA.registry.hostname = data.hostname;
                if (!NETDATA.registry.anonymous_statistics_checked) {
                    NETDATA.registry.anonymous_statistics_checked=true;
                    if (data.anonymous_statistics) {
                        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=false;j.src=
                            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                        })(window,document,'script','dataLayer','GTM-N6CBMJD');
                        dataLayer.push({"anonymous_statistics" : "true", "machine_guid" : data.machine_guid});
                    }
                }
                NETDATA.registry.access(2, function (person_urls) {
                    NETDATA.registry.parsePersonUrls(person_urls);
                });    
            }
        });
    },

    hello: function (host, callback) {
        host = NETDATA.fixHost(host);

        // send HELLO to a netdata server:
        // 1. verifies the server is reachable
        // 2. responds with the registry URL, the machine GUID of this netdata server and its hostname
        $.ajax({
            url: host + '/api/v1/registry?action=hello',
            async: true,
            cache: false,
            headers: {
                'Cache-Control': 'no-cache, no-store',
                'Pragma': 'no-cache'
            },
            xhrFields: {withCredentials: true} // required for the cookie
        })
            .done(function (data) {
                data = NETDATA.xss.checkOptional('/api/v1/registry?action=hello', data);

                if (typeof data.status !== 'string' || data.status !== 'ok') {
                    NETDATA.error(408, host + ' response: ' + JSON.stringify(data));
                    data = null;
                }

                if (typeof callback === 'function') {
                    return callback(data);
                }
            })
            .fail(function () {
                NETDATA.error(407, host);

                if (typeof callback === 'function') {
                    return callback(null);
                }
            });
    },

    access: function (max_redirects, callback) {
        let name = NETDATA.registry.MASKED_DATA;
        let url = NETDATA.registry.MASKED_DATA;

        if (!NETDATA.registry.isUsingGlobalRegistry()) {
            // If the user is using a private registry keep sending identifiable
            // data.
            name = NETDATA.registry.hostname;
            url = NETDATA.serverDefault;
        } 

        console.log("ACCESS", name, url);

        // send ACCESS to a netdata registry:
        // 1. it lets it know we are accessing a netdata server (its machine GUID and its URL)
        // 2. it responds with a list of netdata servers we know
        // the registry identifies us using a cookie it sets the first time we access it
        // the registry may respond with a redirect URL to send us to another registry
        $.ajax({
            url: NETDATA.registry.server + '/api/v1/registry?action=access&machine=' + NETDATA.registry.machine_guid + '&name=' + encodeURIComponent(name) + '&url=' + encodeURIComponent(url), // + '&visible_url=' + encodeURIComponent(document.location),
            async: true,
            cache: false,
            headers: {
                'Cache-Control': 'no-cache, no-store',
                'Pragma': 'no-cache'
            },
            xhrFields: {withCredentials: true} // required for the cookie
        })
            .done(function (data) {
                data = NETDATA.xss.checkAlways('/api/v1/registry?action=access', data);

                let redirect = null;
                if (typeof data.registry === 'string') {
                    redirect = data.registry;
                }

                if (typeof data.status !== 'string' || data.status !== 'ok') {
                    NETDATA.error(409, NETDATA.registry.server + ' responded with: ' + JSON.stringify(data));
                    data = null;
                }

                if (data === null) {
                    if (redirect !== null && max_redirects > 0) {
                        NETDATA.registry.server = redirect;
                        NETDATA.registry.access(max_redirects - 1, callback);
                    }
                    else {
                        if (typeof callback === 'function') {
                            return callback(null);
                        }
                    }
                } else {
                    if (typeof data.person_guid === 'string') {
                        NETDATA.registry.person_guid = data.person_guid;
                    }

                    if (typeof callback === 'function') {
                        const urls = data.urls.filter((u) => u[1] !== NETDATA.registry.MASKED_DATA);
                        return callback(urls);
                    }
                }
            })
            .fail(function () {
                NETDATA.error(410, NETDATA.registry.server);

                if (typeof callback === 'function') {
                    return callback(null);
                }
            });
    },

    delete: function (delete_url, callback) {
        // send DELETE to a netdata registry:
        $.ajax({
            url: NETDATA.registry.server + '/api/v1/registry?action=delete&machine=' + NETDATA.registry.machine_guid + '&name=' + encodeURIComponent(NETDATA.registry.hostname) + '&url=' + encodeURIComponent(NETDATA.serverDefault) + '&delete_url=' + encodeURIComponent(delete_url),
            async: true,
            cache: false,
            headers: {
                'Cache-Control': 'no-cache, no-store',
                'Pragma': 'no-cache'
            },
            xhrFields: {withCredentials: true} // required for the cookie
        })
            .done(function (data) {
                data = NETDATA.xss.checkAlways('/api/v1/registry?action=delete', data);

                if (typeof data.status !== 'string' || data.status !== 'ok') {
                    NETDATA.error(411, NETDATA.registry.server + ' responded with: ' + JSON.stringify(data));
                    data = null;
                }

                if (typeof callback === 'function') {
                    return callback(data);
                }
            })
            .fail(function () {
                NETDATA.error(412, NETDATA.registry.server);

                if (typeof callback === 'function') {
                    return callback(null);
                }
            });
    },

    search: function (machine_guid, callback) {
        // SEARCH for the URLs of a machine:
        $.ajax({
            url: NETDATA.registry.server + '/api/v1/registry?action=search&machine=' + NETDATA.registry.machine_guid + '&name=' + encodeURIComponent(NETDATA.registry.hostname) + '&url=' + encodeURIComponent(NETDATA.serverDefault) + '&for=' + machine_guid,
            async: true,
            cache: false,
            headers: {
                'Cache-Control': 'no-cache, no-store',
                'Pragma': 'no-cache'
            },
            xhrFields: {withCredentials: true} // required for the cookie
        })
            .done(function (data) {
                data = NETDATA.xss.checkAlways('/api/v1/registry?action=search', data);

                if (typeof data.status !== 'string' || data.status !== 'ok') {
                    NETDATA.error(417, NETDATA.registry.server + ' responded with: ' + JSON.stringify(data));
                    data = null;
                }

                if (typeof callback === 'function') {
                    return callback(data);
                }
            })
            .fail(function () {
                NETDATA.error(418, NETDATA.registry.server);

                if (typeof callback === 'function') {
                    return callback(null);
                }
            });
    },

    switch: function (new_person_guid, callback) {
        // impersonate
        $.ajax({
            url: NETDATA.registry.server + '/api/v1/registry?action=switch&machine=' + NETDATA.registry.machine_guid + '&name=' + encodeURIComponent(NETDATA.registry.hostname) + '&url=' + encodeURIComponent(NETDATA.serverDefault) + '&to=' + new_person_guid,
            async: true,
            cache: false,
            headers: {
                'Cache-Control': 'no-cache, no-store',
                'Pragma': 'no-cache'
            },
            xhrFields: {withCredentials: true} // required for the cookie
        })
            .done(function (data) {
                data = NETDATA.xss.checkAlways('/api/v1/registry?action=switch', data);

                if (typeof data.status !== 'string' || data.status !== 'ok') {
                    NETDATA.error(413, NETDATA.registry.server + ' responded with: ' + JSON.stringify(data));
                    data = null;
                }

                if (typeof callback === 'function') {
                    return callback(data);
                }
            })
            .fail(function () {
                NETDATA.error(414, NETDATA.registry.server);

                if (typeof callback === 'function') {
                    return callback(null);
                }
            });
    }
};

// Load required JS libraries and CSS

NETDATA.requiredJs = [
    {
        url: NETDATA.serverStatic + 'lib/bootstrap-3.3.7.min.js',
        async: false,
        isAlreadyLoaded: function () {
            // check if bootstrap is loaded
            if (typeof $().emulateTransitionEnd === 'function') {
                return true;
            } else {
                return typeof netdataNoBootstrap !== 'undefined' && netdataNoBootstrap;
            }
        }
    },
    {
        url: NETDATA.serverStatic + 'lib/fontawesome-all-5.0.1.min.js',
        async: true,
        isAlreadyLoaded: function () {
            return typeof netdataNoFontAwesome !== 'undefined' && netdataNoFontAwesome;
        }
    },
    {
        url: NETDATA.serverStatic + 'lib/perfect-scrollbar-0.6.15.min.js',
        isAlreadyLoaded: function () {
            return false;
        }
    }
];

NETDATA.requiredCSS = [
    {
        url: NETDATA.themes.current.bootstrap_css,
        isAlreadyLoaded: function () {
            return typeof netdataNoBootstrap !== 'undefined' && netdataNoBootstrap;
        }
    },
    {
        url: NETDATA.themes.current.dashboard_css,
        isAlreadyLoaded: function () {
            return false;
        }
    }
];

NETDATA.loadedRequiredJs = 0;
NETDATA.loadRequiredJs = function (index, callback) {
    if (index >= NETDATA.requiredJs.length) {
        if (typeof callback === 'function') {
            return callback();
        }
        return;
    }

    if (NETDATA.requiredJs[index].isAlreadyLoaded()) {
        NETDATA.loadedRequiredJs++;
        NETDATA.loadRequiredJs(++index, callback);
        return;
    }

    if (NETDATA.options.debug.main_loop) {
        console.log('loading ' + NETDATA.requiredJs[index].url);
    }

    let async = true;
    if (typeof NETDATA.requiredJs[index].async !== 'undefined' && NETDATA.requiredJs[index].async === false) {
        async = false;
    }

    $.ajax({
        url: NETDATA.requiredJs[index].url,
        cache: true,
        dataType: "script",
        xhrFields: {withCredentials: true} // required for the cookie
    })
        .done(function () {
            if (NETDATA.options.debug.main_loop) {
                console.log('loaded ' + NETDATA.requiredJs[index].url);
            }
        })
        .fail(function () {
            alert('Cannot load required JS library: ' + NETDATA.requiredJs[index].url);
        })
        .always(function () {
            NETDATA.loadedRequiredJs++;

            // if (async === false)
            if (!async) {
                NETDATA.loadRequiredJs(++index, callback);
            }
        });

    // if (async === true)
    if (async) {
        NETDATA.loadRequiredJs(++index, callback);
    }
};

NETDATA.loadRequiredCSS = function (index) {
    if (index >= NETDATA.requiredCSS.length) {
        return;
    }

    if (NETDATA.requiredCSS[index].isAlreadyLoaded()) {
        NETDATA.loadRequiredCSS(++index);
        return;
    }

    if (NETDATA.options.debug.main_loop) {
        console.log('loading ' + NETDATA.requiredCSS[index].url);
    }

    NETDATA._loadCSS(NETDATA.requiredCSS[index].url);
    NETDATA.loadRequiredCSS(++index);
};

// Boot it!

if (typeof netdataPrepCallback === 'function') {
    netdataPrepCallback();
}

NETDATA.errorReset();
NETDATA.loadRequiredCSS(0);

NETDATA._loadjQuery(function () {
    NETDATA.loadRequiredJs(0, function () {
        if (typeof $().emulateTransitionEnd !== 'function') {
            // bootstrap is not available
            NETDATA.options.current.show_help = false;
        }

        if (typeof netdataDontStart === 'undefined' || !netdataDontStart) {
            if (NETDATA.options.debug.main_loop) {
                console.log('starting chart refresh thread');
            }

            NETDATA.start();
        }
    });
});
})(window, document, (typeof jQuery === 'function')?jQuery:undefined);
