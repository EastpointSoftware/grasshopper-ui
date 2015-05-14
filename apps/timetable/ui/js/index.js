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

define(['gh.core', 'gh.constants', 'validator', 'gh.calendar', 'gh.header', 'gh.student.listview'], function(gh, constants) {

    /**
     * Display the appropriate view depending on the state of the selected part
     *
     * @param  {Object}    evt     The dispatched jQuery event
     * @param  {Object}    data    Object containing the module data
     * @private
     */
    var onPartSelected = function(evt, data) {
        if (!data.modules.results.length) {

            // Request the organisational units for the selected part
            gh.api.orgunitAPI.getOrgUnit(data.partId, true, function(err, data) {

                // Render the 'empty-timetable' template
                gh.utils.renderTemplate('empty-timetable', {
                    'data': {
                        'gh': gh,
                        'record': data
                    }
                }, $('#gh-empty'));

                // Show/hide components when an empty timetable was selected
                $('#gh-left-container').addClass('gh-minimised');
                $('#gh-main').hide();
                $('#gh-empty').show();

                // Track the user selecting an empty part
                gh.utils.trackEvent(['Navigation', 'Draft timetable page shown']);
            });

        // Show/hide components when a timetable was selected
        } else {
            $('#gh-left-container').removeClass('gh-minimised');
            $('#gh-empty').hide();
            $('#gh-main').show();
        }
    };

    /**
     * Fetch the tripos data
     *
     * @param  {Function}    callback               Standard callback function
     * @param  {Object}      callback.triposData    Object containing the tripos data
     * @private
     */
    var fetchTriposData = function(callback) {
        gh.utils.getTriposStructure(null, false, function(err, data) {
            if (err) {
                return gh.utils.notification('Could not fetch triposes', constants.messaging.default.error, 'error');
            }

            return callback(data);
        });
    };


    ///////////////
    //  BINDING  //
    ///////////////

    /**
     * Add bindings to various elements on the page
     *
     * @private
     */
    var addBinding = function() {
        $(document).on('gh.part.selected', onPartSelected);
    };


    //////////////////////
    //  INITIALISATION  //
    //////////////////////

    /**
     * Initialise the student UI
     *
     * @private
     */
    var initialise = function() {

        // Add binding to various components
        addBinding();

        // Fetch the tripos data before initialising the header and the calendar
        fetchTriposData(function(triposData) {

            // Set up the header
            $(document).trigger('gh.header.init', {
                'includeLoginForm': true,
                'isGlobalAdminUI': false,
                'triposData': triposData
            });

            // Set up the calendar
            $(document).trigger('gh.calendar.init', {
                'triposData': triposData,
                'view': 'student',
                'target': '#gh-main'
            });
        });
    };

    initialise();
});
