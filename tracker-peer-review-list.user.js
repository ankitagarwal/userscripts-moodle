// ==UserScript==
// @name        MDK Tracker Peer review check list
// @description Helper to populate peer-review check list
// @include     http://tracker.moodle.org/browse/MDL-*
// @include     https://tracker.moodle.org/browse/MDL-*
// @match       http://tracker.moodle.org/browse/MDL-*
// @match       https://tracker.moodle.org/browse/MDL-*
// @grant       none
// @author      Ankit Agarwal
// @version     0.10
// ==/UserScript==

var mdkTrackerReviewChecklist = {

    // Settings.
    settings: {
        // Peer-Review checklist.
        reviewchecklist: "\n[] Syntax\n[] Whitespace\n[] Output\n[] Language\n[] Databases\n[] Testing (instructions and automated tests)\
            \n[] Security\n[] Documentation\n[] Git\n[] Third party code\n[] Sanity check",

        // Settings functions.
        get: function(name) {
            return this[name];
        },
        load: function(settings) {
            for (var key in settings) {
                this.set(key, settings[key]);
            }
        },
        set: function(name, setting) {
            this[name] = setting;
        }
    },

    fields: {
        comment: 'comment',
        submitbutton: 'issue-comment-add-submit'
    },

    init: function() {
        this.add_button();
    },

    add_checklist: function(scope) {
        var commentnode = document.getElementById(scope.fields.comment);
        commentnode.value = commentnode.value + scope.settings.get('reviewchecklist');
    },

    add_button: function() {
        var scope = this;
        var e, field;
        var btn = document.createElement('input');
        btn.type = 'button';
        btn.className = 'button';
        btn.value = 'Add peer review checklist';

        // Add button right before the fields.
        e = document.getElementById(this.fields.submitbutton);
        if (e) {
            var f = btn.cloneNode(true);
            f.onclick = function() { scope.add_checklist(scope); return false; };

            e = e.parentNode;
            e.appendChild(f);
        }
    },
};

var self = self || undefined;
var chrome = chrome || undefined;
if (self && self.port && self.port.on) {
    // Firefox extension specific.
    self.port.on("loadConfig", function(options) {
        mdkTrackerReviewChecklist.settings.load(options);
        mdkTrackerReviewChecklist.init();
    });
} else if (chrome && chrome.extension && chrome.extension.sendMessage) {
    // Chrome extension specific.
    chrome.extension.sendMessage({ action: 'getConfig', module: 'mdk_tracker_pull_branches'}, function(response) {
        mdkTrackerReviewChecklist.settings.load(response);
        mdkTrackerReviewChecklist.init();
    });
} else {
    // Greasemonkey fallback.
    mdkTrackerReviewChecklist.init();
}
