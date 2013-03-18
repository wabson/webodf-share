/**
 * @license
 * Copyright (C) 2012 KO GmbH <copyright@kogmbh.com>
 *
 * @licstart
 * The JavaScript code in this page is free software: you can redistribute it
 * and/or modify it under the terms of the GNU Affero General Public License
 * (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.  The code is distributed
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.
 *
 * As additional permission under GNU AGPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * As a special exception to the AGPL, any HTML file which merely makes function
 * calls to this code, and for that purpose includes it by reference shall be
 * deemed a separate work for copyright law purposes. In addition, the copyright
 * holders of this code give you permission to combine this code with free
 * software libraries that are released under the GNU LGPL. You may copy and
 * distribute such a system following the terms of the GNU AGPL for this code
 * and the LGPL for the libraries. If you modify this code, you may extend this
 * exception to your version of the code, but you are not obligated to do so.
 * If you do not wish to do so, delete this exception statement from your
 * version.
 *
 * This license applies to this entire compilation.
 * @licend
 * @source: http://www.webodf.org/
 * @source: http://gitorious.org/webodf/webodf/
 */
/*global runtime, ops*/

/**
 * @constructor
 * @implements ops.Operation
 */
ops.OpMoveCursor = function OpMoveCursor(session) {
    "use strict";

    var memberid, timestamp, number;

    this.init = function (data) {
        memberid = data.memberid;
        timestamp = data.timestamp;
        number = data.number;
    };

    this.execute = function (domroot) {
        var odtDocument = session.getOdtDocument(),
            cursor = odtDocument.getCursor(memberid),
            positionFilter = odtDocument.getPositionFilter(),
            stepCounter,
            steps;

        runtime.assert(cursor !== undefined,
            "cursor for [" + memberid + "] not found (MoveCursor).");

        stepCounter = cursor.getStepCounter();

        if (number > 0) {
            steps = stepCounter.countForwardSteps(number, positionFilter);
        } else if (number < 0) {
            steps = -stepCounter.countBackwardSteps(-number, positionFilter);
        } else {
            // nothing to do
            return;
        }
        runtime.log("Moving. moving, moving... walkableSteps " + steps);
        cursor.move(steps);
        session.emit(ops.SessionImplementation.signalCursorMoved, cursor);
    };

    this.spec = function () {
        return {
            optype: "MoveCursor",
            memberid: memberid,
            timestamp: timestamp,
            number: number
        };
    };

};