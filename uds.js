/**
 * Created by pbathia on 3/12/15.
 */

(function (root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define('uds', ['jquery', 'jsUri','bluebird'], factory);
    } else {
        root.uds = factory(root.$, root.Uri,root.Promise);
    }
}(this, function ($, Uri,Promise) {
    'use strict';

    var uds = {};

    var udsHostName = new Uri('https://unified-ds-qa.gsslab.pnq2.redhat.com/');

    if (window.location.hostname !== 'access.redhat.com' && window.location.hostname !== 'prod.foo.redhat.com') {
        udsHostName = new Uri('https://unified-ds-ci.gsslab.brq.redhat.com/');
    }

    if(localStorage && localStorage.getItem('udsHostname')) {
        udsHostName = localStorage.getItem('udsHostname');
    }

    var baseAjaxParams = {
        accepts: {
            jsonp: 'application/json, text/json'
        },
        crossDomain: true,
        type: 'GET',
        method: 'GET',
        //beforeSend: function(xhr) {
        //    xhr.setRequestHeader('X-Omit', 'WWW-Authenticate');
        //    //xhr.setRequestHeader('Authorization', 'Basic ' + window.btoa(unescape(encodeURIComponent('<username>' + ':' + '<password>'))))
        //},
        //headers: {
        //    Accept: 'application/json, text/json'
        //},
        xhrFields: {
            withCredentials: true
        },
        data: {},
        dataType: ''
    };

    var executeUdsAjaxCall=function(url,httpMethod)
    {
        var promise=  Promise.resolve($.ajax($.extend({}, baseAjaxParams,{
            url: url,
            type: httpMethod,
            method: httpMethod
        })));

        return promise;
    };

    var executeUdsAjaxCallWithData=function(url,data,httpMethod)
    {
        var promise=  Promise.resolve($.ajax($.extend({}, baseAjaxParams,{
            url: url,
            data: JSON.stringify(data),
            contentType: 'application/json',
            type: httpMethod,
            method: httpMethod,
            dataType: ''
        })));

        return promise;
    };


    uds.fetchCaseDetails = function (caseNumber) {
        var url =udsHostName.clone().setPath('/case/' + caseNumber);
        return executeUdsAjaxCall(url,'GET');
    };

    uds.fetchCaseComments = function ( caseNumber) {
        var url =udsHostName.clone().setPath('/case/' + caseNumber + "/comments");
        return executeUdsAjaxCall(url,'GET');
    };

    uds.fetchCaseAssociateDetails = function (userId,roleName) {
        var url =udsHostName.clone().setPath('/case/associates?where=roleName is "'+roleName+'" and userId is "'+userId+'"');
        return executeUdsAjaxCall(url,'GET');
    };

    //hold the lock on the case
    uds.getlock = function (caseNumber) {
        var url =udsHostName.clone().setPath('/case/' + caseNumber + "/lock");
        return executeUdsAjaxCall(url,'GET');
    };
    //release the lock on the case
    uds.releaselock = function (caseNumber) {
        var url =udsHostName.clone().setPath('/case/' + caseNumber + "/lock");
        return executeUdsAjaxCall(url,'DELETE');
    };

    uds.fetchAccountDetails = function (accountNumber, resourceProjection) {

        var url =udsHostName.clone().setPath('/account/' + accountNumber);
        if (resourceProjection != null) {
            url.addQueryParam('resourceProjection', resourceProjection);
        } else {
            url.addQueryParam('resourceProjection', 'Minimal');
        }
        return executeUdsAjaxCall(url,'GET');
    };

    uds.fetchAccountNotes = function (accountNumber) {
        var url =udsHostName.clone().setPath('/account/' + accountNumber+'/notes');
        return executeUdsAjaxCall(url,'GET');
    };

    uds.fetchUserDetails = function (ssoUsername) {
        var url =udsHostName.clone().setPath('/user/')+ssoUsername;
        return executeUdsAjaxCall(url,'GET');
    };
    uds.fetchUser = function (userUql) {
        var url =udsHostName.clone().setPath('/user').addQueryParam('where', userUql);
        return executeUdsAjaxCall(url,'GET');
    };
    uds.fetchCases = function (uql, resourceProjection, limit, sortOption, statusOnly) {
        var path = '/case'
        if(statusOnly){
            path = '/case/list-status-only'
        }
        var url =udsHostName.clone().setPath(path).addQueryParam('where', encodeURIComponent(uql));
        if (resourceProjection != null) {
            url.addQueryParam('resourceProjection', resourceProjection);
        } else {
            url.addQueryParam('resourceProjection', 'Minimal');
        }
        if (limit != null) {
            url.addQueryParam('limit', limit);
        }
        if(sortOption != null){
            url.addQueryParam('orderBy',sortOption);
        }
        return executeUdsAjaxCall(url,'GET');
    };

    uds.generateBomgarSessionKey=function( caseId) {
        var url =udsHostName.clone().setPath('/case/' + caseId + '/remote-session-key');
        return executeUdsAjaxCall(url,'GET');
    };

    uds.postPublicComments = function (caseNumber,caseComment) {
        var url = udsHostName.clone().setPath('/case/' + caseNumber + "/comments/public");
        return executeUdsAjaxCallWithData(url,caseComment,'POST');
    };
    uds.postPrivateComments = function (caseNumber,caseComment) {
        var url = udsHostName.clone().setPath('/case/' + caseNumber + "/comments/private");
        return executeUdsAjaxCallWithData( url, caseComment,'POST');
    };
    uds.updateCaseDetails = function( caseNumber,caseDetails){
        var url = udsHostName.clone().setPath('/case/' + caseNumber);
        return executeUdsAjaxCallWithData(url, caseDetails,'PUT');
    };

    uds.fetchCaseHistory = function ( caseNumber) {
        var url = udsHostName.clone().setPath('/case/' + caseNumber + "/history");
        return executeUdsAjaxCall(url,'GET');
    };

    uds.addAssociates = function (caseId,jsonAssociates) {
        var url = udsHostName.clone().setPath('/case/' + caseId + "/associate");
        return executeUdsAjaxCallWithData(url, jsonAssociates,'POST');
    };

    uds.getCQIQuestions = function (caseNumber) {
        var url = udsHostName.clone().setPath('/case/' + caseNumber + '/reviews/questions');
        return executeUdsAjaxCall(url,'GET');
    };

    uds.postCQIScore = function (caseNumber,reviewData) {
        var url = udsHostName.clone().setPath('/case/' + caseNumber + '/reviews');
        return executeUdsAjaxCallWithData(url,reviewData,'POST');
    };

    uds.getSolutionDetails = function (solutionNumber) {
        var url = udsHostName.clone().setPath('/documentation/solution/' + solutionNumber);
        return executeUdsAjaxCall(url,'GET');
    };

    uds.getSQIQuestions = function ( solutionNumber) {
        var url = udsHostName.clone().setPath('/documentation/solution/' + solutionNumber + '/reviews/questions');
        return executeUdsAjaxCall(url,'GET');
    };

    uds.postSQIScore = function ( solutionNumber,reviewData) {
        var url = udsHostName.clone().setPath('/documentation/solution/' + solutionNumber + '/reviews');
        return executeUdsAjaxCallWithData(url,reviewData,'POST');
    };
    
    

    return uds;
}));
