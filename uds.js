/**
 * Created by pbathia on 3/12/15.
 */

(function (root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define('uds', ['jquery', 'jsUri'], factory);
    } else {
        root.uds = factory(root.$, root.Uri);
    }
}(this, function ($, Uri) {
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

    var executeUdsAjaxCall=function(onSuccess,onFailure,url,httpMethod)
    {
        var defer = $.Deferred();
        var promise=$.ajax($.extend({}, baseAjaxParams,{
            url: url,
            type: httpMethod,
            method: httpMethod
        }));
        promise.done(function(response) {
            if (response !== undefined) {
                onSuccess(response);
            } else {
                onSuccess([]); //not sure whether every call would need the response to be typecasted to []
            }
        });
        promise.fail(function(xhr, response, status) {
            onFailure('Error ' + xhr.status + ' ' + xhr.statusText, xhr, response, status);//not sure of this error for everything
        });
        return defer.promise;
    };

    var executeUdsAjaxCallWithData=function(onSuccess,onFailure,url,data,httpMethod)
    {
        var defer = $.Deferred();
        var promise=$.ajax($.extend({}, baseAjaxParams,{
            url: url,
            data: JSON.stringify(data),
            contentType: 'application/json',
            type: httpMethod,
            method: httpMethod,
            dataType: ''
        }));
        promise.done(function(response) {
            if (response !== undefined) {
                onSuccess(response);
            } else {
                onSuccess([]);
            }
        });
        promise.fail(function(xhr, response, status) {
            onFailure('Error ' + xhr.status + ' ' + xhr.statusText, xhr, response, status);
        });
        return defer.promise;
    };


    uds.fetchCaseDetails = function (onSuccess, onFailure,caseNumber) {
        if (!$.isFunction(onSuccess)) { throw 'onSuccess callback must be a function'; }
        if (!$.isFunction(onFailure)) { throw 'onFailure callback must be a function'; }
        var url =udsHostName.clone().setPath('/case/' + caseNumber);
        return executeUdsAjaxCall(onSuccess,onFailure,url,'GET');

    };

    uds.fetchCaseComments = function (onSuccess, onFailure, caseNumber) {
        if (!$.isFunction(onSuccess)) { throw 'onSuccess callback must be a function'; }
        if (!$.isFunction(onFailure)) { throw 'onFailure callback must be a function'; }
        var url =udsHostName.clone().setPath('/case/' + caseNumber + "/comments");
        return executeUdsAjaxCall(onSuccess,onFailure,url,'GET');
    };

    uds.fetchCaseAssociateDetails = function (onSuccess, onFailure, userId,roleName) {
        if (!$.isFunction(onSuccess)) { throw 'onSuccess callback must be a function'; }
        if (!$.isFunction(onFailure)) { throw 'onFailure callback must be a function'; }
        var url =udsHostName.clone().setPath('/case/associates?where=roleName is "'+roleName+'" and userId is "'+userId+'"');
        return executeUdsAjaxCall(onSuccess,onFailure,url,'GET');
    };

    //hold the lock on the case
    uds.getlock = function (onSuccess, onFailure, caseNumber) {
        if (!$.isFunction(onSuccess)) { throw 'onSuccess callback must be a function'; }
        if (!$.isFunction(onFailure)) { throw 'onFailure callback must be a function'; }
        var url =udsHostName.clone().setPath('/case/' + caseNumber + "/lock");
        return executeUdsAjaxCall(onSuccess,onFailure,url,'GET');
    };
    //release the lock on the case
    uds.releaselock = function (onSuccess, onFailure, caseNumber) {
        if (!$.isFunction(onSuccess)) { throw 'onSuccess callback must be a function'; }
        if (!$.isFunction(onFailure)) { throw 'onFailure callback must be a function'; }
        var url =udsHostName.clone().setPath('/case/' + caseNumber + "/lock");
        return executeUdsAjaxCall(onSuccess,onFailure,url,'DELETE');
    };

    uds.fetchAccountDetails = function (onSuccess, onFailure,accountNumber, resourceProjection) {
        if (!$.isFunction(onSuccess)) { throw 'onSuccess callback must be a function'; }
        if (!$.isFunction(onFailure)) { throw 'onFailure callback must be a function'; }
        var url =udsHostName.clone().setPath('/account/' + accountNumber);
        if (resourceProjection != null) {
            url.addQueryParam('resourceProjection', resourceProjection);
        } else {
            url.addQueryParam('resourceProjection', 'Minimal');
        }
        return executeUdsAjaxCall(onSuccess,onFailure,url,'GET');
    };

    uds.fetchAccountNotes = function (onSuccess, onFailure,accountNumber) {
        if (!$.isFunction(onSuccess)) { throw 'onSuccess callback must be a function'; }
        if (!$.isFunction(onFailure)) { throw 'onFailure callback must be a function'; }
        var url =udsHostName.clone().setPath('/account/' + accountNumber+'/notes');
        return executeUdsAjaxCall(onSuccess,onFailure,url,'GET');
    };

    uds.fetchUserDetails = function (onSuccess, onFailure, ssoUsername) {
        if (!$.isFunction(onSuccess)) { throw 'onSuccess callback must be a function'; }
        if (!$.isFunction(onFailure)) { throw 'onFailure callback must be a function'; }
        var url =udsHostName.clone().setPath('/user/')+ssoUsername;
        return executeUdsAjaxCall(onSuccess,onFailure,url,'GET');
    };
    uds.fetchUser = function (onSuccess, onFailure, userUql) {
        if (!$.isFunction(onSuccess)) { throw 'onSuccess callback must be a function'; }
        if (!$.isFunction(onFailure)) { throw 'onFailure callback must be a function'; }
        var url =udsHostName.clone().setPath('/user').addQueryParam('where', userUql);
        return executeUdsAjaxCall(onSuccess,onFailure,url,'GET');
    };
    uds.fetchCases = function (onSuccess, onFailure, uql, resourceProjection, limit, sortOption, statusOnly) {
        if (!$.isFunction(onSuccess)) { throw 'onSuccess callback must be a function'; }
        if (!$.isFunction(onFailure)) { throw 'onFailure callback must be a function'; }
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
        return executeUdsAjaxCall(onSuccess,onFailure,url,'GET');
    };

    uds.generateBomgarSessionKey=function(onSuccess, onFailure, caseId) {
        if (!$.isFunction(onSuccess)) { throw 'onSuccess callback must be a function'; }
        if (!$.isFunction(onFailure)) { throw 'onFailure callback must be a function'; }
        var url =udsHostName.clone().setPath('/case/' + caseId + '/remote-session-key');
        return executeUdsAjaxCall(onSuccess,onFailure,url,'GET');
    };

    uds.postPublicComments = function (onSuccess, onFailure, caseNumber,caseComment) {
        if (!$.isFunction(onSuccess)) { throw 'onSuccess callback must be a function'; }
        if (!$.isFunction(onFailure)) { throw 'onFailure callback must be a function'; }
        var url = udsHostName.clone().setPath('/case/' + caseNumber + "/comments/public");
        return executeUdsAjaxCallWithData(onSuccess,onFailure,url,caseComment,'POST');
    };
    uds.postPrivateComments = function (onSuccess, onFailure, caseNumber,caseComment) {
        if (!$.isFunction(onSuccess)) {
            throw 'onSuccess callback must be a function';
        }
        if (!$.isFunction(onFailure)) {
            throw 'onFailure callback must be a function';
        }
        var url = udsHostName.clone().setPath('/case/' + caseNumber + "/comments/private");
        return executeUdsAjaxCallWithData(onSuccess, onFailure, url, caseComment,'POST');
    };
    uds.updateCaseDetails = function(onSuccess, onFailure, caseNumber,caseDetails){
        if (!$.isFunction(onSuccess)) {
            throw 'onSuccess callback must be a function';
        }
        if (!$.isFunction(onFailure)) {
            throw 'onFailure callback must be a function';
        }
        var url = udsHostName.clone().setPath('/case/' + caseNumber);
        return executeUdsAjaxCallWithData(onSuccess, onFailure, url, caseDetails,'PUT');
    };

    uds.fetchCaseHistory = function (onSuccess, onFailure, caseNumber) {
        if (!$.isFunction(onSuccess)) { throw 'onSuccess callback must be a function'; }
        if (!$.isFunction(onFailure)) { throw 'onFailure callback must be a function'; }
        var url = udsHostName.clone().setPath('/case/' + caseNumber + "/history");
        return executeUdsAjaxCall(onSuccess,onFailure,url,'GET');
    };

    uds.addAssociates = function (onSuccess, onFailure, caseId,jsonAssociates) {
        if (!$.isFunction(onSuccess)) {
            throw 'onSuccess callback must be a function';
        }
        if (!$.isFunction(onFailure)) {
            throw 'onFailure callback must be a function';
        }
        var url = udsHostName.clone().setPath('/case/' + caseId + "/associate");
        return executeUdsAjaxCallWithData(onSuccess, onFailure, url, jsonAssociates,'POST');
    };

    return uds;
}));
