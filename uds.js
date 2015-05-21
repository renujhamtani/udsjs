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

    var uds = {},
        fetchCaseDetails,
        fetchCaseComments,
        fetchUserDetails,
        fetchCases;
    var udsHostName = new Uri('http://unified-ds.gsslab.rdu2.redhat.com:9100');

    //if (window.location.hostname !== 'access.redhat.com') {
    //    udsHostName = new Uri('http://unified-ds-qa.gsslab.pnq.redhat.com:9100/');
    //}

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
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + window.btoa(unescape(encodeURIComponent('skesharigit' + ':' + 'Magarpatta13%'))))
        },
        headers: {
            Accept: 'application/json, text/json'
        },
        xhrFields: {
            withCredentials: false
        },
        data: {},
        dataType: 'json'
    };

    uds.fetchCaseDetails = function (onSuccess, onFailure, caseNumber) {
        //1332755
        if (!$.isFunction(onSuccess)) { throw 'onSuccess callback must be a function'; }
        if (!$.isFunction(onFailure)) { throw 'onFailure callback must be a function'; }

        var url =udsHostName.clone().setPath('/case/' + caseNumber);

        fetchCaseDetails = $.extend({}, baseAjaxParams, {
            url: url,
            success: function (response) {
                if (response.resource !== undefined) {
                    onSuccess(response);
                } else {
                    onSuccess([]);
                }
            },
            error: function (xhr, response, status) {
                onFailure('Error ' + xhr.status + ' ' + xhr.statusText, xhr, response, status);
            }
        });
        $.ajax(fetchCaseDetails);
    };

    uds.fetchCaseComments = function (onSuccess, onFailure, caseNumber) {
        //1332755
        if (!$.isFunction(onSuccess)) { throw 'onSuccess callback must be a function'; }
        if (!$.isFunction(onFailure)) { throw 'onFailure callback must be a function'; }

        var url =udsHostName.clone().setPath('/case/' + caseNumber + "/comments");

        fetchCaseComments = $.extend({}, baseAjaxParams, {
            url: url,
            success: function (response) {
                if (response !== undefined) {
                    onSuccess(response);
                } else {
                    onSuccess([]);
                }
            },
            error: function (xhr, response, status) {
                onFailure('Error ' + xhr.status + ' ' + xhr.statusText, xhr, response, status);
            }
        });
        $.ajax(fetchCaseComments);
    };

    uds.fetchUserDetails = function (onSuccess, onFailure, ssoUsername) {
        if (!$.isFunction(onSuccess)) { throw 'onSuccess callback must be a function'; }
        if (!$.isFunction(onFailure)) { throw 'onFailure callback must be a function'; }

        //var url =udsHostName.clone().setPath('/user').setQuery('where=' +  "SSO is \"" + ssoUsername + "\"");
        var url =udsHostName.clone().setPath('/user/')+ssoUsername;

        fetchUserDetails = $.extend({}, baseAjaxParams, {
            url: url,
            success: function (response) {
                if (response !== undefined) {
                    onSuccess(response);
                } else {
                    onSuccess([]);
                }
            },
            error: function (xhr, response, status) {
                onFailure('Error ' + xhr.status + ' ' + xhr.statusText, xhr, response, status);
            }
        });
        $.ajax(fetchUserDetails);
    };
    uds.fetchUser = function (onSuccess, onFailure, userUql) {
        if (!$.isFunction(onSuccess)) { throw 'onSuccess callback must be a function'; }
        if (!$.isFunction(onFailure)) { throw 'onFailure callback must be a function'; }

        var url =udsHostName.clone().setPath('/user').addQueryParam('where', userUql);

        fetchCases = $.extend({}, baseAjaxParams, {
            url: url,
            success: function (response) {
                if (response !== undefined) {
                    onSuccess(response);
                } else {
                    onSuccess([]);
                }
            },
            error: function (xhr, response, status) {
                onFailure('Error ' + xhr.status + ' ' + xhr.statusText, xhr, response, status);
            }
        });
        $.ajax(fetchCases);
    };
    uds.fetchCases = function (onSuccess, onFailure, uql) {
        if (!$.isFunction(onSuccess)) { throw 'onSuccess callback must be a function'; }
        if (!$.isFunction(onFailure)) { throw 'onFailure callback must be a function'; }

        var url =udsHostName.clone().setPath('/case').addQueryParam('where', uql);

        fetchCases = $.extend({}, baseAjaxParams, {
            url: url,
            success: function (response) {
                if (response !== undefined) {
                    onSuccess(response);
                } else {
                    onSuccess([]);
                }
            },
            error: function (xhr, response, status) {
                onFailure('Error ' + xhr.status + ' ' + xhr.statusText, xhr, response, status);
            }
        });
        $.ajax(fetchCases);
    };
    return uds;
}));
