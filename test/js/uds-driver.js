/**
 * Created by pbathia on 3/12/15.
 */

require.config({
    paths: {
        jquery: 'js/jquery-1.11.0',
        jsUri: 'js/Uri',
        uds: '../uds'
    }
});
require(['uds'], function (uds) {

    'use strict';

    function onFailure(error, xhr, response, status) {
        console.log(error);
        console.log(response);
        console.log(status);
        console.log(xhr);
    }

    uds.fetchCaseDetails(
        function (response) {
            console.log(response);
        },
        onFailure,
        "1332755"
    );

    uds.fetchCaseComments(
        function (response) {
            console.log(response);
        },
        onFailure,
        "1332755"
    );

    uds.fetchUserDetails(
        function (response) {
            console.log(response);
        },
        onFailure,
        "rhn-support-rmanes"
    );
    uds.fetchCases(
        //sample query for getting owned cases based on roles
        function (response) {
            console.log(response);
        },
        onFailure,
        '(((ownerId is "005A0000002a7XZIAY" and (status is "Waiting on Red Hat" or internalStatus is "Waiting on Owner")) or (ftsRole like "%rmanes%" and status ne "Closed")) or ((internalStatus is "Waiting on Collaboration" and (status ne "Closed" and (sbrGroup is "Kernel" or sbrGroup is "Networking"))) and nnoSuperRegion is null) or (isFTS is true and (ftsRole is "" and (sbrGroup is "Kernel" or sbrGroup is "Networking"))) and requiresSecureHandling is false)&resourceProjection=Minimal'
    );
});
