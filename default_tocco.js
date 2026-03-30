/**
 * This file includes common cms helper methods.
 */

/**
 * Logout method from nice extranets. Calls the logout servlet which redirects to @param url (or to the
 * current page, if missing) subsequently.
 */
function logout(url) {
    if (!url) {
        url = window.location.href;
    }
    window.location = '/nice2/logout?location=' + url + '&ts=' + new Date().getTime();
}

function login(url) {
    window.location = url + '#?username=' + document.getElementById('template_username').value + '&password=' + document.getElementById('template_password').value;
    return false;
}

/**
 * jQuery functions for Off-Canvas Panels
 * disable OffCanvas by defining variable disableOffCanvas = true;'
 */

jQuery(document).ready(function() {
    var disableOffCanvas = window.disableOffCanvas === true;
    (function($, disableOffCanvas) {
        if (disableOffCanvas !== true) {
            var overlayClass = "offcanvas-overlay";
            var offcanvasClass = "offcanvas";
            var fadeOverlayTransition = 200;

            $(document).on('touchstart click', '[data-toggle="' + offcanvasClass + '"]',showCanvas);
            $(document).on('touchstart click', '.'+ overlayClass +'',hideCanvas);

            function showCanvas(){
                $("<div class='"+ overlayClass +"'></div>").hide().appendTo("body").fadeIn(fadeOverlayTransition);
                var placement = $(this).attr("data-placement");
                var action = $(this).attr("data-action");
                var target = $(this).attr("data-target");
                $(target).toggleClass("off in").addClass(action);
                $( "body" ).addClass( action + "-" + placement);
                event.preventDefault();
            }

            function hideCanvas(){
                $("." + overlayClass).fadeOut('fadeOverlayTransition', function() {
                    $(this).remove();
                });
                $("body").removeClass("push-right push-left overlay-right overlay-left");
                $("." + offcanvasClass + ".in").removeClass("in").addClass("off");
                $("." + offcanvasClass + ".overlay").removeClass("overlay");
                $("." + offcanvasClass + ".push").removeClass("push");
                event.preventDefault();
            }
        }
    })(jQuery, disableOffCanvas);
});


/**
 * Call services if user has approved them.
 *
 * Configure a required level per service.
 *   callback must be a JavaScript function. Be aware that a callback is not present on every webpage. To prevent a reference error define the variable.
 *   requiredLevel = 0 means no approval is required. Callback is triggered always.
 *   requiredLevel > 0 means that each service can be approved or declined. By increasing the level a given approval gets outdated.
 *
 * Test if all services are approved or declined by areAllApprovedOrDeclined().
 * Call services by controlPrivacy.evokeServices().
 * Approve a single service by controlPrivacy.approveService(key).
 * Approve all services by controlPrivacy.approveServices().
 * Decline a single service by controlPrivacy.declineService(key).
 * Decline all services by controlPrivacy.declineServices().
 * Overwrite or extend service configuration by controlPrivacy.defineServices().
 * Overwrite or extend cookie configuration by controlPrivacy.defineCookieSettings().
 * Test approval is given for a service by controlPrivacy.isApproved(key).
 * Test approval is given for all services by controlPrivacy.areApproved().
  */
var initGoogleAnalytics, initGoogleTagManager, initUniversalAnalytics, initAddThis;
var controlPrivacy = (function() {
    var cookieNameAffix = 'PrivacySettings'

    var cookieSettings = {
        expires: 3650
    };

    var services = {
        addThis: {
            callback: initAddThis,
            requiredLevel: 0
        },
        googleAnalytics: {
            callback: initGoogleAnalytics,
            requiredLevel: 0
        },
        googleTagManager: {
            callback: initGoogleTagManager,
            requiredLevel: 0
        },
        universalAnalytics: {
            callback: initUniversalAnalytics,
            requiredLevel: 0
        }
    };

    var _isFunction = function(key, service) {
        if (typeof service['callback'] === 'function') {
            return true;
        } else {
            console.warn(key, 'is not a callable privacy service');
            return false;
        }
    };

    var _isValidService = function(key) {
        if (services.hasOwnProperty(key)) {
            return true;
        } else {
            console.warn(key, 'is not a registred privacy service');
            return false;
        }
    };

    var _setCookie = function(key, value) {
        var value = value || 0;
        var cookieName = key + cookieNameAffix;
        Cookies.set(cookieName, value, cookieSettings);
    };

    var _getCookie = function(key) {
        var cookieName = key + cookieNameAffix;
        return Cookies.get(cookieName);
    };

    var defineCookieSettings = function(newCookieSettings) {
        cookieSettings = Object.assign(cookieSettings, newCookieSettings);
    };

    var defineServices = function(newServices) {
        services = Object.assign(services, newServices);
    };

    var evokeServices = function() {
        Object.keys(services).forEach(function(key) {
            var service = services[key];
            var requiredLevel = service['requiredLevel'];
            if (_getCookie(key) === undefined) {
                _setCookie(key);
            }
            if ((requiredLevel === 0 || _getCookie(key) >= requiredLevel) && _isFunction(key, service)) {
                service['callback']();
            }
        }, this.services);
    };

    var approveService = function(key) {
        if (_isValidService(key)) {
            var service = services[key];
            var requiredLevel = service['requiredLevel'];
            if (_getCookie(key) < requiredLevel) {
                _setCookie(key, requiredLevel);
                if (_isFunction(key, service)) {
                    service['callback']();
                }
            }
        }
    };

    var approveServices = function() {
        Object.keys(services).forEach(function(key) {
            approveService(key);
        }, this.services);
    };

    var declineService = function(key) {
        if (_isValidService(key)) {
            _setCookie(key, -1);
        }
    };

    var declineServices = function() {
        Object.keys(services).forEach(function(key) {
            declineService(key);
        }, this.services);
    };

    var isApproved = function(key) {
        return _getCookie(key) >= services[key]['requiredLevel'];
    }

    var isDeclined = function(key) {
        return _getCookie(key) < 0;
    }

    var areAllApprovedOrDeclined = function() {
        return Object.keys(services).every(function(key) {
            return isApproved(key) || isDeclined(key)
        }, this.services);
    };

    return {
        areAllApprovedOrDeclined: areAllApprovedOrDeclined,
        approveService: approveService,
        approveServices: approveServices,
        declineService: declineService,
        declineServices: declineServices,
        defineCookieSettings: defineCookieSettings,
        defineServices: defineServices,
        evokeServices: evokeServices,
        isApproved: isApproved,
        isDeclined: isDeclined
    }
})();