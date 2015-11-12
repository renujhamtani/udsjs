/**
 * Created by pbathia on 3/12/15.
 */

require.config({
    paths: {
        jquery: 'js/jquery-1.11.0',
        jsUri: 'js/Uri',
        uds: '../uds',
        bluebird: 'js/bluebird.min'
    }
});
require(['uds'], function (uds) {

    'use strict';



    uds.fetchCaseDetails(
        "1332755"
    );

    uds.fetchCaseComments(
        "01278378"
    );

    uds.fetchUserDetails(
        "rhn-support-rmanes"
    );
    uds.fetchUser(
        "SSO is \"rhn-support-rmanes\""
    );
    uds.fetchCases(        //sample query for getting owned cases based on roles

        '((((((ownerId is "005A0000000gPRIIA2" and (status is "Waiting on Red Hat" or internalStatus is "Waiting on Owner")) or (ftsRole like "%strataapi2%" and status ne "Closed"))) or ((internalStatus is "Waiting on Collaboration" and (status ne "Closed")) and nnoSuperRegion is null)) or (isFTS is true and (ftsRole is ""))) and requiresSecureHandling is false)',
        'Minimal',
        6
    );
    uds.updateCaseDetails(
        '01278378',
        '{"resource":{"caseSummary":{"resource":{"summary":"test"}}}}'
    );
    uds.fetchCaseAssociateDetails(
        '005A0000005n18tIAA','Contributor'
    )
});
