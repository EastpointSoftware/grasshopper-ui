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

define(['exports'], function(exports) {

    /**
     * Add an event to an organisational unit
     *
     * @param  {Number}      orgUnitId            The ID of the organisational unit to add an event to
     * @param  {Number}      eventId              The ID of the event to add to the organisational unit
     * @param  {Function}    callback             Standard callback function
     * @param  {Object}      callback.err         Error object containing the error code and error message
     * @param  {Object}      callback.response    Object representing the events in an organisational unit
     * @throws {Error}                            A parameter validation error
     */
    var addOrgUnitEvent = exports.addOrgUnitEvent = function(orgUnitId, eventId, callback) {
        if (!_.isFunction(callback)) {
            throw new Error('A valid callback function should be provided');
        } else if (!_.isNumber(orgUnitId)) {
            return callback({'code': 400, 'msg': 'A valid orgUnitId should be provided'});
        } else if (!_.isNumber(eventId)) {
            return callback({'code': 400, 'msg': 'A valid eventId should be provided'});
        }

        $.ajax({
            'url': '/api/orgunit/' + orgUnitId + '/events',
            'type': 'POST',
            'data': {
                'event': eventId
            },
            'success': function(data) {
                return callback(null, data);
            },
            'error': function(jqXHR, textStatus) {
                return callback({'code': jqXHR.status, 'msg': jqXHR.responseText});
            }
        });
    };

    /**
     * Add an event series to an organisational unit
     *
     * @param  {Number}      orgUnitId            The ID of the organisational unit to add an event series to
     * @param  {Number[]}    serieId              The ID of the event series to add to the organisational unit
     * @param  {Function}    callback             Standard callback function
     * @param  {Object}      callback.err         Error object containing the error code and error message
     * @param  {Object}      callback.response    Object representing the added event series
     * @throws {Error}                            A parameter validation error
     */
    var addOrgUnitSeries = exports.addOrgUnitSeries = function(orgUnitId, serieId, callback) {
        if (!_.isFunction(callback)) {
            throw new Error('A valid callback function should be provided');
        } else if (!_.isNumber(orgUnitId)) {
            return callback({'code': 400, 'msg': 'A valid orgUnitId should be provided'});
        } else if (!_.isNumber(serieId) && !_.isArray(serieId)) {
            return callback({'code': 400, 'msg': 'A valid serieId should be provided'});
        }

        $.ajax({
            'url': '/api/orgunit/' + orgUnitId + '/series',
            'type': 'POST',
            'data': {
                'serie': serieId
            },
            'success': function(data) {
                return callback(null, data);
            },
            'error': function(jqXHR, textStatus) {
                return callback({'code': jqXHR.status, 'msg': jqXHR.responseText});
            }
        });
    };

    /**
     * Create a new organisational unit in an app
     *
     * @param  {Number}      appId                  The ID of the app to create the organisational unit for
     * @param  {String}      displayName            The name of the organisational unit
     * @param  {String}      type                   The type of the organisational unit. e.g., `tripos`, `part`
     * @param  {Number}      [parentId]             The ID of the parent organisational unit
     * @param  {Number}      [groupId]              The ID of the group that can manage the organisational unit
     * @param  {String}      [description]          The description of the organisational unit
     * @param  {Object}      [metadata]             The metadata of the organisational unit
     * @param  {String}      [published]            The published status of the organisational unit.
     * @param  {Function}    [callback]             Standard callback function
     * @param  {Object}      [callback.err]         Error object containing the error code and error message
     * @param  {Object}      [callback.response]    Object representing the new organisational unit in an app
     * @throws {Error}                              A parameter validation error
     */
    var createOrgUnit = exports.createOrgUnit = function(appId, displayName, type, parentId, groupId, description, metadata, published, callback) {
        if (callback && !_.isFunction(callback)) {
            throw new Error('A valid callback function should be provided');
        } else if (!_.isNumber(appId)) {
            return callback({'code': 400, 'msg': 'A valid appId should be provided'});
        } else if (!_.isString(displayName)) {
            return callback({'code': 400, 'msg': 'A valid display name should be provided'});
        } else if (!_.isString(type)) {
            return callback({'code': 400, 'msg': 'A valid type should be provided'});
        } else if (parentId && !_.isNumber(parentId)) {
            return callback({'code': 400, 'msg': 'A valid parentId should be provided'});
        } else if (groupId && !_.isNumber(groupId)) {
            return callback({'code': 400, 'msg': 'A valid groupId should be provided'});
        } else if (description && !_.isString(description)) {
            return callback({'code': 400, 'msg': 'A valid description should be provided'});
        } else if (metadata && !_.isObject(metadata)) {
            return callback({'code': 400, 'msg': 'A valid value for metadata should be provided'});
        } else if (!_.isNull(published) && !_.isBoolean(published)) {
            return callback({'code': 400, 'msg': 'A valid value for published should be provided'});
        }

        // Set a default callback function in case no callback function has been provided
        callback = callback || function() {};

        // Request options object
        var data = {
            'app': appId,
            'displayName': displayName,
            'type': type
        };

        // Only add the optional parameters if they have been explicitly specified
        if (parentId) {
            data['parent'] = parentId;
        }
        if (groupId) {
            data['group'] = groupId;
        }
        if (description) {
            data['description'] = description;
        }
        if (metadata) {
            data['metadata'] = metadata;
        }
        if (!_.isNull(published)) {
            data['published'] = published;
        }

        $.ajax({
            'url': '/api/orgunit',
            'type': 'POST',
            'data': data,
            'success': function(data) {
                return callback(null, data);
            },
            'error': function(jqXHR, textStatus) {
                return callback({'code': jqXHR.status, 'msg': jqXHR.responseText});
            }
        });
    };

    /**
     * Delete an organisational unit
     *
     * @param  {Number}      orgUnitId              The ID of the organisational unit to delete
     * @param  {Function}    [callback]             Standard callback function
     * @param  {Object}      [callback.err]         Error object containing the error code and error message
     * @param  {Object}      [callback.response]    Object representing the deleted organisational unit
     * @throws {Error}                              A parameter validation error
     */
    var deleteOrgUnit = exports.deleteOrgUnit = function(orgUnitId, callback) {
        if (callback && !_.isFunction(callback)) {
            throw new Error('A valid callback function should be provided');
        } else if (!_.isNumber(orgUnitId)) {
            return callback({'code': 400, 'msg': 'A valid orgUnitId should be provided'});
        }

        // Set a default callback function in case no callback function has been provided
        callback = callback || function() {};

        $.ajax({
            'url': '/api/orgunit/' + orgUnitId,
            'type': 'DELETE',
            'success': function(data) {
                return callback(null, data);
            },
            'error': function(jqXHR, textStatus) {
                return callback({'code': jqXHR.status, 'msg': jqXHR.responseText});
            }
        });
    };

    /**
     * Get the event series in an organisational unit
     *
     * @param  {Number}      orgUnitId            The ID of the organisational unit to retrieve the event series for
     * @param  {Number}      [limit]              The maximum number of results to retrieve
     * @param  {Number}      [offset]             The paging number of the results to retrieve
     * @param  {Boolean}     [upcoming]           Whether to only include event series with upcoming events.
     * @param  {Function}    callback             Standard callback function
     * @param  {Object}      callback.err         Error object containing the error code and error message
     * @param  {Object}      callback.response    Object representing the event series in an organisational unit
     * @throws {Error}                            A parameter validation error
     */
    var getOrgUnitSeries = exports.getOrgUnitSeries = function(orgUnitId, limit, offset, upcoming, callback) {
        if (!_.isFunction(callback)) {
            throw new Error('A valid callback function should be provided');
        } else if (!_.isNumber(orgUnitId)) {
            return callback({'code': 400, 'msg': 'A valid orgUnitId should be provided'});
        } else if (limit && !_.isNumber(limit)) {
            return callback({'code': 400, 'msg': 'A valid limit should be provided'});
        } else if (offset && !_.isNumber(offset)) {
            return callback({'code': 400, 'msg': 'A valid offset should be provided'});
        } else if (upcoming && !_.isBoolean(upcoming)) {
            return callback({'code': 400, 'msg': 'A valid upcoming should be provided'});
        }

        // Request options object
        var data = {};

        // Only add the parameters to the request object if they have been explicitly specified
        if (!_.isNull(limit)) {
            data['limit'] = limit;
        }
        if (!_.isNull(offset)) {
            data['offset'] = offset;
        }
        if (_.isBoolean(upcoming)) {
            data['upcoming'] = upcoming;
        }

        $.ajax({
            'url': '/api/orgunit/' + orgUnitId + '/series',
            'type': 'GET',
            'data': data,
            'success': function(data) {
                return callback(null, data);
            },
            'error': function(jqXHR, textStatus) {
                return callback({'code': jqXHR.status, 'msg': jqXHR.responseText});
            }
        });
    };

    /**
     * Get the calendar for an organisational unit
     *
     * @param  {Number}      orgUnitId            The ID of the organisational unit to get the calendar for
     * @param  {String}      start                The timestamp (ISO 8601) from which to get the calendar for the organisational unit
     * @param  {String}      end                  The timestamp (ISO 8601) until which to get the calendar for the organisational unit
     * @param  {Function}    callback             Standard callback function
     * @param  {Object}      callback.err         Error object containing the error code and error message
     * @param  {Object}      callback.response    Object representing the calendar for an organisational unit
     * @throws {Error}                            A parameter validation error
     */
    var getOrgUnitCalendar = exports.getOrgUnitCalendar = function(orgUnitId, start, end, callback) {
        if (!_.isFunction(callback)) {
            throw new Error('A valid callback function should be provided');
        } else if (!_.isNumber(orgUnitId)) {
            return callback({'code': 400, 'msg': 'A valid orgUnitId should be provided'});
        } else if (!_.isString(start)) {
            return callback({'code': 400, 'msg': 'A valid start ISO 8601 date should be provided'});
        } else if (!_.isString(end)) {
            return callback({'code': 400, 'msg': 'A valid end ISO 8601 date should be provided'});
        }

        $.ajax({
            'url': '/api/orgunit/' + orgUnitId + '/calendar',
            'type': 'GET',
            'data': {
                'start': start,
                'end': end
            },
            'success': function(data) {
                return callback(null, data);
            },
            'error': function(jqXHR, textStatus) {
                return callback({'code': jqXHR.status, 'msg': jqXHR.responseText});
            }
        });
    };

    /**
     * Get the calendar for an organisational unit in iCal
     *
     * @param  {Number}      orgUnitId            The ID of the organisational unit to get the calendar for in iCal format
     * @param  {Function}    callback             Standard callback function
     * @param  {Object}      callback.err         Error object containing the error code and error message
     * @param  {Object}      callback.response    Object representing the calendar for an organisational unit in iCal
     * @throws {Error}                            A parameter validation error
     */
    var getOrgUnitCalendarICal = exports.getOrgUnitCalendarICal = function(orgUnitId, callback) {
        if (!_.isFunction(callback)) {
            throw new Error('A valid callback function should be provided');
        } else if (!_.isNumber(orgUnitId)) {
            return callback({'code': 400, 'msg': 'A valid orgUnitId should be provided'});
        }

        $.ajax({
            'url': '/api/orgunit/' + orgUnitId + '/calendar.ical',
            'type': 'GET',
            'success': function(data) {
                return callback(null, data);
            },
            'error': function(jqXHR, textStatus) {
                return callback({'code': jqXHR.status, 'msg': jqXHR.responseText});
            }
        });
    };

    /**
     * Get the calendar for an organisational unit in RSS
     *
     * @param  {Number}      orgUnitId            The ID of the organisational unit to get the calendar for in RSS format
     * @param  {Function}    callback             Standard callback function
     * @param  {Object}      callback.err         Error object containing the error code and error message
     * @param  {Object}      callback.response    Object representing the calendar for an organisational unit in RSS
     * @throws {Error}                            A parameter validation error
     */
    var getOrgUnitCalendarRSS = exports.getOrgUnitCalendarRSS = function(orgUnitId, callback) {
        if (!_.isFunction(callback)) {
            throw new Error('A valid callback function should be provided');
        } else if (!_.isNumber(orgUnitId)) {
            return callback({'code': 400, 'msg': 'A valid orgUnitId should be provided'});
        }

        $.ajax({
            'url': '/api/orgunit/' + orgUnitId + '/calendar.rss',
            'type': 'GET',
            'success': function(data) {
                return callback(null, data);
            },
            'error': function(jqXHR, textStatus) {
                return callback({'code': jqXHR.status, 'msg': jqXHR.responseText});
            }
        });
    };

    /**
     * Get an organisational unit
     *
     * @param  {Number}      orgUnitId            The ID of the organisational unit to retrieve
     * @param  {Boolean}     [includeSeries]      Whether to include the event series associated to the oranisational unit
     * @param  {Function}    callback             Standard callback function
     * @param  {Object}      callback.err         Error object containing the error code and error message
     * @param  {Object}      callback.response    Object representing the organisational unit
     * @throws {Error}                            A parameter validation error
     */
    var getOrgUnit = exports.getOrgUnit = function(orgUnitId, includeSeries, callback) {
        if (!_.isFunction(callback)) {
            throw new Error('A callback function should be provided');
        } else if (!_.isNumber(orgUnitId)) {
            return callback({'code': 400, 'msg': 'A valid orgUnitId should be provided'});
        } else if (includeSeries && !_.isBoolean(includeSeries)) {
            return callback({'code': 400, 'msg': 'A valid includeSeries should be provided'});
        }

        includeSeries = includeSeries || false;

        $.ajax({
            'url': '/api/orgunit/' + orgUnitId,
            'type': 'GET',
            'data': {
                'includeSeries': includeSeries
            },
            'success': function(data) {
                return callback(null, data);
            },
            'error': function(jqXHR, textStatus) {
                return callback({'code': jqXHR.status, 'msg': jqXHR.responseText});
            }
        });
    };

    /**
     * Get the organisational units in an app
     *
     * @param  {Number}            [appId]                 The ID of the app to get the organisational units for
     * @param  {Boolean}           [includeSeries]         Whether to include the event series associated to the oranisational units
     * @param  {Boolean|Number}    [includePermissions]    Whether to include if the current user can manage the organisational units/series and whether an organisational unit is locked. If a Number instead of a Boolean is provided the permissions for the specified user will be returned. Defaults to `false`
     * @param  {Number}            [parentId]              The ID of the parent to retrieve the organisational units for
     * @param  {String[]}          [type]                  The organisational unit type(s) to filter the organisational unit by
     * @param  {Function}          callback                Standard callback function
     * @param  {Object}            callback.err            Error object containing the error code and error message
     * @param  {Object}            callback.response       Object representing the organisational units in an app
     * @throws {Error}                                     A parameter validation error
     */
    var getOrgUnits = exports.getOrgUnits = function(appId, includeSeries, includePermissions, parentId, type, callback) {
        if (!_.isFunction(callback)) {
            throw new Error('A valid callback function should be provided');
        } else if (appId && !_.isNumber(appId)) {
            return callback({'code': 400, 'msg': 'A valid appId should be provided'});
        } else if (includeSeries && !_.isBoolean(includeSeries)) {
            return callback({'code': 400, 'msg': 'A valid includeSeries should be provided'});
        } else if (parentId && !_.isNumber(parentId)) {
            return callback({'code': 400, 'msg': 'A valid parentId should be provided'});
        } else if (type && !(_.isArray(type) || _.isString(type))) {
            return callback({'code': 400, 'msg': 'A valid type should be provided'});
        }

        var data = {};

        // Only add the optional parameters if they have been explicitly specified
        if (appId) {
            data['app'] = appId;
        }
        if (includeSeries) {
            data['includeSeries'] = includeSeries;
        }

        data['includePermissions'] = includePermissions || false;

        if (parentId) {
            data['parent'] = parentId;
        }
        if (type) {
            data['type'] = type;
        }

        $.ajax({
            'url': '/api/orgunit',
            'type': 'GET',
            'data': data,
            'success': function(data) {
                return callback(null, data);
            },
            'error': function(jqXHR, textStatus) {
                return callback({'code': jqXHR.status, 'msg': jqXHR.responseText});
            }
        });
    };

    /**
     * Get the upcoming events in an organisational unit
     *
     * @param  {Number}      orgUnitId            The ID of the organisational unit to get the upcoming events for
     * @param  {Number}      [limit]              The maximum number of results to retrieve
     * @param  {Number}      [offset]             The paging number of the results to retrieve
     * @param  {Function}    callback             Standard callback function
     * @param  {Object}      callback.err         Error object containing the error code and error message
     * @param  {Object}      callback.response    Object representing the upcoming events in an organisational unit
     * @throws {Error}                            A parameter validation error
     */
    var getOrgUnitUpcoming = exports.getOrgUnitUpcoming = function(orgUnitId, limit, offset, callback) {
        if (!_.isFunction(callback)) {
            throw new Error('A valid callback function should be provided');
        } else if (!_.isNumber(orgUnitId)) {
            return callback({'code': 400, 'msg': 'A valid orgUnitId should be provided'});
        } else if (limit && !_.isNumber(limit)) {
            return callback({'code': 400, 'msg': 'A valid limit should be provided'});
        } else if (offset && !_.isNumber(offset)) {
            return callback({'code': 400, 'msg': 'A valid offset should be provided'});
        }

        // Request options object
        var data = {};

        // Only add the parameters to the request object if they have been explicitly specified
        if (!_.isNull(limit)) {
            data['limit'] = limit;
        }
        if (!_.isNull(offset)) {
            data['offset'] = offset;
        }

        $.ajax({
            'url': '/api/orgunit/' + orgUnitId + '/upcoming',
            'type': 'GET',
            'data': data,
            'success': function(data) {
                return callback(null, data);
            },
            'error': function(jqXHR, textStatus) {
                return callback({'code': jqXHR.status, 'msg': jqXHR.responseText});
            }
        });
    };

    /**
     * Remove an event from an organisational unit
     *
     * @param  {Number}             orgUnitId              The ID of the organisational unit to remove an event from
     * @param  {Number[]|Number}    eventId                The ID of the event to remove from the organisational unit
     * @param  {Function}           [callback]             Standard callback function
     * @param  {Object}             [callback.err]         Error object containing the error code and error message
     * @param  {Object}             [callback.response]    Object representing the removed event
     * @throws {Error}                                     A parameter validation error
     */
    var deleteOrgUnitEvent = exports.deleteOrgUnitEvent = function(orgUnitId, eventId, callback) {
        if (callback && !_.isFunction(callback)) {
            throw new Error('A valid callback function should be provided');
        } else if (!_.isNumber(orgUnitId)) {
            return callback({'code': 400, 'msg': 'A valid orgUnitId should be provided'});
        } else if (!_.isArray(eventId) && !_.isNumber(eventId)) {
            return callback({'code': 400, 'msg': 'A valid eventId should be provided'});
        }

        // Set a default callback function in case no callback function has been provided
        callback = callback || function() {};

        $.ajax({
            'url': '/api/orgunit/' + orgUnitId + '/events',
            'type': 'DELETE',
            'data': {
                'event': [eventId]
            },
            'success': function(data) {
                return callback(null, data);
            },
            'error': function(jqXHR, textStatus) {
                return callback({'code': jqXHR.status, 'msg': jqXHR.responseText});
            }
        });
    };

    /**
     * Remove an event series from an organisational unit
     *
     * @param  {Number}      orgUnitId              The ID of the organisational unit to remove an event series from
     * @param  {String[]}    serieId                The ID of the event series to remove from the organisational unit
     * @param  {Function}    [callback]             Standard callback function
     * @param  {Object}      [callback.err]         Error object containing the error code and error message
     * @param  {Object}      [callback.response]    Object representing the removed event series
     * @throws {Error}                              A parameter validation error
     */
    var deleteOrgUnitSeries = exports.deleteOrgUnitSeries = function(orgUnitId, serieId, callback) {
        if (callback && !_.isFunction(callback)) {
            throw new Error('A valid callback function should be provided');
        } else if (!_.isNumber(orgUnitId)) {
            return callback({'code': 400, 'msg': 'A valid orgUnitId should be provided'});
        } else if (!_.isNumber(serieId)) {
            return callback({'code': 400, 'msg': 'A valid serieId should be provided'});
        }

        // Set a default callback function in case no callback function has been provided
        callback = callback || function() {};

        $.ajax({
            'url': '/api/orgunit/' + orgUnitId + '/series',
            'type': 'DELETE',
            'data': {
                'serie': [serieId]
            },
            'success': function(data) {
                return callback(null, data);
            },
            'error': function(jqXHR, textStatus) {
                return callback({'code': jqXHR.status, 'msg': jqXHR.responseText});
            }
        });
    };

    /**
     * Subscribe to the event series and events in an organisational unit
     *
     * @param  {Number}      orgUnitId              The ID of the organisational unit to subscribe to the event series and events for
     * @param  {Function}    [callback]             Standard callback function
     * @param  {Object}      [callback.err]         Error object containing the error code and error message
     * @param  {Object}      [callback.response]    Object representing the subscribed to organisational unit
     * @throws {Error}                              A parameter validation error
     */
    var subscribeOrgUnit = exports.subscribeOrgUnit = function(orgUnitId, callback) {
        if (callback && !_.isFunction(callback)) {
            throw new Error('A valid callback function should be provided');
        } else if (!_.isNumber(orgUnitId)) {
            return callback({'code': 400, 'msg': 'A valid orgUnitId should be provided'});
        }

        // Set a default callback function in case no callback function has been provided
        callback = callback || function() {};

        $.ajax({
            'url': '/api/orgunit/' + orgUnitId + '/subscribe',
            'type': 'POST',
            'success': function(data) {
                return callback(null, data);
            },
            'error': function(jqXHR, textStatus) {
                return callback({'code': jqXHR.status, 'msg': jqXHR.responseText});
            }
        });
    };

    /**
     * Unsubscribe from the event series and events in an organisational unit
     *
     * @param  {Number}      orgUnitId              The ID of the organisational unit to unsubscribe from the event series and events for
     * @param  {Function}    [callback]             Standard callback function
     * @param  {Object}      [callback.err]         Error object containing the error code and error message
     * @param  {Object}      [callback.response]    Object representing the unsubscribed from organisational unit
     * @throws {Error}                              A parameter validation error
     */
    var unsubscribeOrgUnit = exports.unsubscribeOrgUnit = function(orgUnitId, callback) {
        if (callback && !_.isFunction(callback)) {
            throw new Error('A valid callback function should be provided');
        } else if (!_.isNumber(orgUnitId)) {
            return callback({'code': 400, 'msg': 'A valid orgUnitId should be provided'});
        }

        // Set a default callback function in case no callback function has been provided
        callback = callback || function() {};

        $.ajax({
            'url': '/api/orgunit/' + orgUnitId + '/unsubscribe',
            'type': 'POST',
            'success': function(data) {
                return callback(null, data);
            },
            'error': function(jqXHR, textStatus) {
                return callback({'code': jqXHR.status, 'msg': jqXHR.responseText});
            }
        });
    };

    /**
     * Update an organisational unit
     *
     * @param  {Number}      orgUnitId              The ID of the organisational unit to update
     * @param  {String}      [description]          The updated description of the organisational unit
     * @param  {String}      [displayName]          The updated display name of the organisational unit
     * @param  {Number}      [groupId]              The updated ID of the group that can manage the organisational unit
     * @param  {Number}      [parentId]             The updated ID of the parent organisational unit
     * @param  {String}      [type]                 The updated type of the organisational unit. e.g., `tripos`, `part`
     * @param  {Object}      [metadata]             The metadata of the organisational unit
     * @param  {String}      [published]            The published status of the organisational unit.
     * @param  {Function}    [callback]             Standard callback function
     * @param  {Object}      [callback.err]         Error object containing the error code and error message
     * @param  {Object}      [callback.response]    Object representing the updated organisational unit
     * @throws {Error}                              A parameter validation error
     */
    var updateOrgUnit = exports.updateOrgUnit = function(orgUnitId, description, displayName, groupId, parentId, type, metadata, published, callback) {
        if (callback && !_.isFunction(callback)) {
            throw new Error('A valid callback function should be provided');
        } else if (!_.isNumber(orgUnitId)) {
            return callback({'code': 400, 'msg': 'A valid orgUnitId should be provided'});
        } else if (description && !_.isString(description)) {
            return callback({'code': 400, 'msg': 'A valid description should be provided'});
        } else if (displayName && !_.isString(displayName)) {
            return callback({'code': 400, 'msg': 'A valid displayName should be provided'});
        } else if (groupId && !_.isNumber(groupId)) {
            return callback({'code': 400, 'msg': 'A valid groupId should be provided'});
        } else if (parentId && !_.isNumber(parentId)) {
            return callback({'code': 400, 'msg': 'A valid parentId should be provided'});
        } else if (type && !_.isString(type)) {
            return callback({'code': 400, 'msg': 'A valid type should be provided'});
        } else if (metadata && !_.isObject(metadata)) {
            return callback({'code': 400, 'msg': 'A valid value for metadata should be provided'});
        } else if (!_.isNull(published) && !_.isBoolean(published)) {
            return callback({'code': 400, 'msg': 'A valid value for published should be provided'});
        }

        // Set a default callback function in case no callback function has been provided
        callback = callback || function() {};

        // Request data object
        var data = {};

        // Only add the parameters to the request object if they have been explicitly specified
        if (description) {
            data['description'] = description;
        }
        if (displayName) {
            data['displayName'] = displayName;
        }
        if (groupId) {
            data['group'] = groupId;
        }
        if (parentId) {
            data['parent'] = parentId;
        }
        if (type) {
            data['type'] = type;
        }
        if (metadata) {
            data['metadata'] = metadata;
        }
        if (!_.isNull(published)) {
            data['published'] = published;
        }

        $.ajax({
            'url': '/api/orgunit/' + orgUnitId,
            'type': 'POST',
            'data': data,
            'success': function(data) {
                return callback(null, data);
            },
            'error': function(jqXHR, textStatus) {
                return callback({'code': jqXHR.status, 'msg': jqXHR.responseText});
            }
        });
    };
});
