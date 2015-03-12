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
});
