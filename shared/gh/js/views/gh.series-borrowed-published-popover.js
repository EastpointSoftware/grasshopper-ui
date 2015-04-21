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

define(['gh.utils', 'clickover'], function(utils) {


    ///////////////
    //  POPOVER  //
    ///////////////

    /**
     * Set up and show the popover window
     *
     * @private
     */
    var setUpPopover = function() {
        var $trigger = $(this);
        var $content = $('.list-group-item .popover.published[data-id="' + $trigger.data('id') + '"]');

        var options = {
            'class_name': 'gh-series-popover gh-borrowed-published-popover',
            'container': 'body',
            'content': $content.html(),
            'global_close': true,
            'html': true
        };

        $trigger.clickover(options);
        $trigger.trigger('click');
    };

    /**
     * Dismiss the popover window
     *
     * @private
     */
    var dismissPopover = function() {
        var $trigger = $(this);
        // Only invoke a click when a popover is actually being shown
        if ($('.popover.in').length) {
            $trigger.trigger('click');
        }
    };


    /////////////
    // BINDING //
    /////////////

    /**
     * Add handlers to the popover triggers
     *
     * @private
     */
    var addBinding = function() {
        // Hide the popover window
        $('body').on('mouseout', '.gh-list-action .gh-disabled-overlay', dismissPopover);
        // set up and show the popover window
        $('body').on('mouseover', '.gh-list-action .gh-disabled-overlay', setUpPopover);
    };

    addBinding();
});