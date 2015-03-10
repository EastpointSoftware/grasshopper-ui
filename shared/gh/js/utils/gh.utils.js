/*!
 * Copyright 2015 Digital Services, University of Cambridge Licensed
 * under the Educational Community License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the
 * License. You may obtain a copy of the License at
 *
 *     http://opensource.org/licenses/ECL-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an "AS IS"
 * BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

define(['exports', 'gh.utils.templates', 'gh.utils.time', 'bootstrap-notify'], function(exports, templates, time) {


    ///////////////
    //  GENERAL  //
    ///////////////

    /**
     * Set the title of the document. Depending on the interface that's loaded up, the title will be prefixed with:
     *     - 'My Timetable' when the student UI is loaded
     *     - 'Timetable Administration' when the administrator UI is loaded
     *     
     * @param {String}    [title]    The title to set to the document
     */
    var setDocumentTitle = exports.setDocumentTitle = function(title) {
        if (title && !_.isString(title)) {
            throw new Error('An invalid value for title was provided');
        }

        // Default the previx to 'My Timetable'. If the admin UI is loaded
        // up the prefix should be 'Timetable Administration'
        var prefix = 'My Timetable ';
        if ($('body').data('isadminui')) {
            prefix = 'Timetable Administration ';
        }

        document.title = prefix + title.trim();
    };

    /**
     * Generates a random 10 character sequence of upper and lowercase letters.
     *
     * @param  {Boolean}    toLowerCase    Whether or not the string should be returned lowercase
     * @return {String}                    Random 10 character sequence of upper and lowercase letters
     */
    var generateRandomString = exports.generateRandomString = function(toLowerCase) {
        if (toLowerCase && !_.isBoolean(toLowerCase)) {
            throw new Error('An invalid value for toLowerCase has been provided');
        }

        // Generate a random string
        var rndString = _.sample('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 10).join('');
        if (toLowerCase) {
            rndString = rndString.toLowerCase();
        }
        return rndString;
    };

    /**
     * Mock a XMLHttpRequest
     *
     * @param  {String}           type           The request type. (e.g. 'GET', 'POST'...)
     * @param  {String}           url            The request url
     * @param  {Number}           statusCode     The response status code (e.g. 200, 400, 503...)
     * @param  {Object}           headers        The response headers
     * @param  {Object|String}    body           The response body
     * @param  {Function}         requestFunc    The mock function
     */
    var mockRequest = exports.mockRequest = function(type, url, statusCode, headers, body, requestFunc) {
        if (!_.isString(type)) {
            throw new Error('An invalid value for type was provided');
        } else if (!_.isString(url)) {
            throw new Error('An invalid value for url was provided');
        } else if (!_.isNumber(statusCode)) {
            throw new Error('An invalid value for statusCode was provided');
        } else if (!_.isObject(headers)) {
            throw new Error('An invalid value for headers was provided');
        } else if (_.isEmpty(body)) {
            throw new Error('An invalid value for body was provided');
        } else if (!_.isFunction(requestFunc)) {
            throw new Error('An invalid value for callback was provided');
        }

        // Stringify the response body
        body = JSON.stringify(body);

        // Require Sinon before continuing
        require(['sinon'], function(sinon) {
            var server = sinon.fakeServer.create();
            server.respondWith(type, url, [statusCode, headers, body]);

            // Execute the request
            requestFunc();

            // Mock the response
            server.respond();
            server.restore();
        });
    };

    /**
     * Sort given objects based on the displayName property.
     * The list will be ordered from A to Z.
     *
     * @see Array#sort
     */
    var sortByDisplayName = exports.sortByDisplayName = function(a, b) {
        if (a.displayName.toLowerCase() < b.displayName.toLowerCase()){
            return -1;
        } else if (a.displayName.toLowerCase() > b.displayName.toLowerCase()) {
            return 1;
        }
        return 0;
    };

    /**
     * Sort given objects based on the host property.
     * The list will be ordered from A to Z.
     *
     * @see Array#sort
     */
    var sortByHost = exports.sortByHost = function(a, b) {
        if (a.host.toLowerCase() < b.host.toLowerCase()){
            return -1;
        } else if (a.host.toLowerCase() > b.host.toLowerCase()) {
            return 1;
        }
        return 0;
    };


    ////////////////////////
    //  GOOGLE ANALYTICS  //
    ////////////////////////

    /**
     * Set up Google Analytics tracking. Note that this is using Universal Tracking
     *
     * @private
     */
    /* istanbul ignore next */
    var googleAnalytics = function() {
        (function(i,s,o,g,r,a,m) {i['GoogleAnalyticsObject']=r;i[r]=i[r]||function() {
        (i[r].q=i[r].q||[]).push(arguments);};i[r].l=1*new Date();a=s.createElement(o);
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m);
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

        // Add hostname to allow tracking of accessed tenant
        ga('create', 'UA-57660493-1', window.location.hostname);
        ga('send', 'pageview');

        // Add event handler to track JavaScript errors
        window.addEventListener('error', function(ev) {
            ga('send', 'event', 'JavaScript Error', 'log', ev.message + ' [' + ev.filename + ':  ' + ev.lineno + ']');
        });

        // Add event handler to track jQuery AJAX errors
        $(document).ajaxError(function(ev, request, settings, err) {
            ga('send', 'event', 'Ajax Error', 'log', settings.type + ' ' + settings.url + ' => ' + err + ' (' + request.status + ')');
        });
    };

    /**
     * Register a Google Analytics tracking event
     * (https://developers.google.com/analytics/devguides/collection/analyticsjs/events#overview)
     *
     * @param  {String}    category      Typically the object that was interacted with (e.g. button)
     * @param  {String}    action        The type of interaction (e.g. click)
     * @param  {String}    label         Useful for categorizing events (e.g. nav buttons)
     * @param  {Number}    [value]       Value of the action, values must be non-negative
     */
    var sendTrackingEvent = exports.sendTrackingEvent = function(category, action, label, value) {
        if (!_.isString(category)) {
            throw new Error('An invalid value for \'category\' has been provided');
        } else if (!_.isString(action)) {
            throw new Error('An invalid value for \'action\' has been provided');
        } else if (!_.isString(label)){
            throw new Error('An invalid value for \'label\' has been provided');
        } else if (value && !_.isNumber(value)) {
            throw new Error('An invalid value for \'value\' has been provided');
        }

        // Only send the value along when it's specified
        /* istanbul ignore next */
        if (value) {
            ga('send', 'event', category, action, label, value);
        } else {
            ga('send', 'event', category, action, label);
        }

        return true;
    };


    ///////////////////
    // LOCAL STORAGE //
    ///////////////////

    /**
     * All the functionality related to local storage
     *
     * @return  {Object}    Object containing the local storage functionality
     */
    var localDataStorage = exports.localDataStorage = function() {

        /**
         * Return a value from the local storage
         *
         * @param  {String}                 key    The key of the value that needs to be retrieved from the local storage
         * @return {Object|Array|String}           The requested value
         */
        var get = function(key) {
            if (!_.isString(key)) {
                throw new Error('An invalid value for \'key\' was provided');
            }

            // Return an entry from the local storage
            return JSON.parse(localStorage.getItem(key));
        };

        /**
         * Remove a local value
         *
         * @param  {String}     key      The key of the entry that needs to be stored
         * @return {undefined}
         */
        var remove = function(key) {
            if (!_.isString(key)) {
                throw new Error('An invalid value for \'key\' was provided');
            }

            // Remove the entry from the local storage
            return localStorage.removeItem(key);
        };

        /**
         * Store a value in the local storage
         *
         * @param  {String}                 key      The key of the entry that needs to be stored
         * @param  {Object|Array|String}    value    The value of the key that needs to be stored
         * @return {undefined}
         */
        var store = function(key, value) {
            if (!_.isString(key)) {
                throw new Error('An invalid value for \'key\' was provided');
            }

            // Add the entry to the local storage
            try {
                return localStorage.setItem(key, JSON.stringify(value));
            } catch(err) {
                throw new Error('An invalid value was provided');
            }
        };

        return {
            'get': get,
            'remove': remove,
            'store': store
        };
    };


    ///////////////////
    // NOTIFICATIONS //
    ///////////////////

    /**
     * Show a Growl-like notification message. A notification can have a title and a message, and will also have
     * a close button for closing the notification. Notifications can be used as a confirmation message, error message, etc.
     *
     * This function is mostly just a wrapper around jQuery.bootstrap.notify.js and supports all of the options documented
     * at https://github.com/goodybag/bootstrap-notify.
     *
     * @param  {String}    [title]     The notification title
     * @param  {String}    message     The notification message that will be shown underneath the title
     * @param  {String}    [type]      The notification type. The supported types are `success`, `error` and `info`, as defined in http://getbootstrap.com/components/#alerts. By default, the `success` type will be used
     * @param  {String}    [id]        Unique identifier for the notification, in case a notification can be triggered twice due to some reason. If a second notification with the same id is triggered it will be ignored
     * @param  {String}    [sticky]    Whether or not the notification should be sticky. Defaults to `false`
     * @throws {Error}                 Error thrown when no message has been provided
     * @return {Boolean}               Returns true when the notification has been shown
     */
    var notification = exports.notification = function(title, message, type, id, sticky) {
        if (!message) {
            throw new Error('A valid notification message should be provided');
        }

        if (id && $('#' + id).length) {
            return false;
        }

        // Check if the notifications container has already been created.
        // If the container has not been created yet, we create it and add
        // it to the DOM.
        var $notificationContainer = $('#gh-notification-container');
        var randomId = generateRandomString();
        if ($notificationContainer.length === 0) {
            $notificationContainer = $('<div>').attr('id', 'gh-notification-container').addClass('notifications bottom-left');
            $('body').append($notificationContainer);
        }

        // If a title has been provided, we wrap it in an h4 and prepend it to the message
        if (title) {
            message = '<div data-internal-id="' + randomId + '"><h4>' + title + '</h4><p>' + message + '</p></div>';
        }

        // If an ID has been provided, add the `id` attribute to the message
        if (id) {
            message = $(message).attr('id', id);
        }

        // Show the notification
        $notificationContainer.notify({
            'fadeOut': {
                'enabled': sticky ? false : true,
                'delay': 5000
            },
            'type': type ? type : 'success',
            'message': {'html': message}
        }).show();

        // Cache the rendered notification object to refer to it later
        var $notification = $($('[data-internal-id]', $notificationContainer).closest('.alert'));

        // Wait until the call stack has cleared before animating
        setTimeout(function() {
            $notification.removeClass('fade in');
            $notification.addClass('gh-notification-in');
        }, 10);

        // Fade out and remove the container after 5 seconds if it's not marked as sticky
        var fadeTimeout = setTimeout(function() {
            if (!sticky) {
                $notification.addClass('gh-notification-fade');
            }
        }, 5000);

        // Close the notification when the 'X' is clicked
        $('a.close', $notificationContainer).off('click').on('click', function(ev) {
            // Add the fade animation to remove the popover from view
            $(this).closest('.alert').addClass('gh-notification-fade');
            // Remove the notification from the DOM after the animation finishes
            setTimeout(function() {
                $(this).closest('.alert').remove();
            }, 500);
            // Clear the timeout that removes the notification
            clearTimeout(fadeTimeout);
            // Avoid default link click behaviour
            return false;
        });

        return true;
    };


    ///////////////
    // REDIRECTS //
    ///////////////

    /**
     * All functionality related to redirecting users to error pages, etc.
     */
    /* istanbul ignore next */
    var redirect = exports.redirect = function() {

        /**
         * Redirect the current user to the 401 page. This can be used when the user requests a page or entity
         * to which no access should be granted.
         */
        var accessdenied = function() {
            window.location = '/accessdenied';
        };

        /**
         * Redirect the current user to the 404 page. This can be used when the user requests a page or entity
         * that cannot be found.
         */
        var notfound = function() {
            window.location = '/notfound';
        };

        /**
         * Redirect the current user to the 503 page. This can be used when the user requests a page on a tenant
         * that is currently not available
         */
        var unavailable = function() {
            window.location = '/unavailable';
        };

        return {
            'accessdenied': accessdenied,
            'notfound': notfound,
            'unavailable': unavailable
        };
    };


    ////////////////
    //  TRIPOSES  //
    ////////////////

    /**
     * Return the tripos structure
     *
     * @param  {Function}    callback             Standard callback function
     * @param  {Object}      callback.err         Error object containing the error code and error message
     * @param  {Object}      callback.response    The tripos structure
     */
    /* istanbul ignore next */
    var getTriposStructure = exports.getTriposStructure = function(callback) {
        if (!_.isFunction(callback)) {
            throw new Error('An invalid value for callback was provided');
        }

        var core = require('gh.core');
        var appId = core.data.me && core.data.me.AppId ? core.data.me.AppId : null;
        require('gh.api.orgunit').getOrgUnits(null, false, true, null, ['course', 'subject', 'part'], function(err, data) {
            if (err) {
                return callback(err);
            }

            var triposData = {
                'courses': [],
                'subjects': [],
                'parts': [],
                'modules': []
            };

            triposData.courses = _.filter(data.results, function(course) {
                return course.type === 'course';
            });

            triposData.subjects = _.filter(data.results, function(subject) {
                return subject.type === 'subject';
            });

            triposData.parts = _.filter(data.results, function(part) {
                return part.type === 'part';
            });

            // Sort the data before displaying it
            triposData.courses.sort(sortByDisplayName);
            triposData.subjects.sort(sortByDisplayName);
            triposData.parts.sort(sortByDisplayName);

            return callback(null, triposData);
        });
    };

    // Initialise Google Analytics
    googleAnalytics();


    /////////////
    //  STATE  //
    /////////////

    /**
     * Refresh the state by triggering the statechange event without making modifications
     */
    var refreshState = exports.refreshState = function() {
        History.Adapter.trigger(window, 'statechange');
    };

    /**
     * Add a key/value pair to the URL state
     *
     * @param {Object}    toAdd        The key of the state parameter to set
     * @param {Boolean}   [replace]    Whether to replace the state or push a new one in. Setting to `true` is useful when the state needs to be updated but no history entry should be created. Defaults to `false`
     */
    var addToState = exports.addToState = function(toAdd, replace) {
        // Construct an array to create the state string from
        var stateString = [];
        // Whether or not the key/value pair overrides an already existing state property
        var override = false;
        // Merge the current history with the arguments to add to it
        var currentState = _.extend(History.getState().data, toAdd);

        // For each entry, add it to the stateString
        _.each(currentState, function(value, key) {
            stateString.push(key + '=' + value);
        });

        // Create the URL to set the state to
        var url = '/?' + stateString.join('&');
        // If the admin UI is loaded, prepend '/admin/?'
        if ($('body').data('isadminui')) {
            url = '/admin' + url;
        }

        // Clear the queue
        History.clearQueue();

        if (replace) {
            // Replace with the new state
            History.replaceState(currentState, $('title').text(), url);
        } else {
            // Push the new state
            History.pushState(currentState, $('title').text(), url);
        }
    };

    /**
     * Remove one or more keys from the state
     *
     * @param  {String[]}    keys    Array of keys to remove from the state
     */
    var removeFromState = exports.removeFromState = function(keys) {
        // Construct an array to create the state string from
        var stateString = [];
        // Get the current history state to work with
        var currentState = History.getState();
        // Cache the state data object to set
        var stateData = {};

        // If the state is already empty there is nothing to do
        if (_.isEmpty(currentState.data)) {
            return;
        }

        // Loop over each data entry in the state and remove the keys that match
        _.each(currentState.data, function(value, key) {
            // Remove the key from the state, if it's matched, by not adding it to the
            // updated state object
            if (_.indexOf(keys, key) === -1) {
                stateString.push(key + '=' + value);
                stateData[key] = value;
            }
        });

        // Create the URL to set the state to
        var url = '/?' + stateString.join('&');
        // If the admin UI is loaded, prepend '/admin/?'
        if ($('body').data('isadminui')) {
            url = '/admin' + url;
        }

        // Clear the queue
        History.clearQueue();

        // Replace the state data
        History.replaceState(stateData, $('title').text(), url);
    };

    /**
     * Set the state data. This is useful in functions that are using the data to determine what to add or remove
     *
     */
    var setStateData = exports.setStateData = function() {
        // Parse the URL that's in the History state.
        // The expected URL structure is `[/admin]/?tripos=123&part=234&module=567&series=890`
        var stateString = History.getState().cleanUrl.split('?');

        // The hostname is included in the stateString Array; if it has more than one item in it that means
        // there's some state handling to be done.
        if (stateString.length > 1) {
            // Cache the state data object to set
            var stateData = {};

            // Drop the hostname from the Array to only keep the hash
            stateString = stateString.pop();

            // Split the hash into an Array
            stateString = stateString.split('&');

            // For each key/value pair in the Array, assign it to the new state object
            _.each(stateString, function(s) {
                if (s) {
                    // Split the string into a key and value
                    s = s.split('=');
                    // Add the key/value pair to the state object
                    stateData[s[0]] = parseInt(s[1], 10);
                }
            });

            // Create the URL to set the state to
            var url = '/?' + stateString.join('&');
            // If the admin UI is loaded, prepend '/admin/?'
            if ($('body').data('isadminui')) {
                url = '/admin' + url;
            }

            // Clear the queue
            History.clearQueue();

            // Replace the state data
            History.replaceState(stateData, $('title').text(), url);
        }
    };


    //////////////////////
    //  INITIALISATION  //
    //////////////////////

    /**
     * Extend the basic utils with specific functionality
     *
     * @private
     */
    var initialise = function(that) {

        // Gather all the specific funtionality classes
        var utilClasses = [
            templates,
            time
        ];

        // Extend the util class
        _.each(utilClasses, function(utilClass) {
            _.extend(that, utilClass);
        });
    };

    initialise(this);
});
