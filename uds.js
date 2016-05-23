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

    var udsHostName = new Uri('https://unified-ds-ci.gsslab.brq.redhat.com/');


    if (window.location.hostname === 'access.redhat.com' || window.location.hostname === 'prod.foo.redhat.com' || window.location.hostname === 'fooprod.redhat.com'){
        udsHostName = new Uri('https://unified-ds.gsslab.rdu2.redhat.com/');
    }
    else
    {
      if (window.location.hostname === 'access.qa.redhat.com' || window.location.hostname === 'qa.foo.redhat.com' || window.location.hostname === 'fooqa.redhat.com') {
          udsHostName = new Uri('https://unified-ds-qa.gsslab.pnq2.redhat.com/');
      }
      else
      {
         if (window.location.hostname === 'access.devgssci.devlab.phx1.redhat.com' || window.location.hostname === 'ci.foo.redhat.com' || window.location.hostname === 'fooci.redhat.com') {
                udsHostName = new Uri('https://unified-ds-ci.gsslab.brq.redhat.com/');
         }
         else
               {
                  if (window.location.hostname === 'access.stage.redhat.com' || window.location.hostname === 'stage.foo.redhat.com' || window.location.hostname === 'foostage.redhat.com') {
                         udsHostName = new Uri('https://unified-ds-stage.gsslab.pnq2.redhat.com/');
                  }
               }
      }
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
        var promise=Promise.resolve($.ajax($.extend({}, baseAjaxParams,{
            url: url,
            type: httpMethod,
            method: httpMethod
        })));
        return promise;
    };

    var executeUdsAjaxCallWithData=function(url,data,httpMethod)
    {
        var promise=Promise.resolve($.ajax($.extend({}, baseAjaxParams,{
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

    uds.fetchCaseAssociateDetails = function (uql) {
            var url =udsHostName.clone().setPath('/case/associates').addQueryParam('where', encodeURIComponent(uql));
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
    uds.fetchUser = function (userUql, resourceProjection) {
        var url =udsHostName.clone().setPath('/user').addQueryParam('where', encodeURIComponent(userUql));
        if(resourceProjection != null) {
            url.addQueryParam('resourceProjection', resourceProjection);
        }
        return executeUdsAjaxCall(url,'GET');
    };
    uds.fetchCases = function (uql, resourceProjection, limit, sortOption, statusOnly) {
        var path = '/case';
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

    uds.postPublicComments = function (caseNumber,caseComment,hoursWorked) {
        if(hoursWorked===undefined){
            var url = udsHostName.clone().setPath('/case/' + caseNumber + "/comments/public");
        } else {
            var url = udsHostName.clone().setPath('/case/' + caseNumber + "/comments/public/hoursWorked/"+hoursWorked);
        }
        return executeUdsAjaxCallWithData(url,caseComment,'POST');
    };
    uds.postPrivateComments = function (caseNumber,caseComment,hoursWorked) {
        var url = udsHostName.clone().setPath('/case/' + caseNumber + "/comments/private");
        if(hoursWorked===undefined){
            var url = udsHostName.clone().setPath('/case/' + caseNumber + "/comments/private");
        } else {
            var url = udsHostName.clone().setPath('/case/' + caseNumber + "/comments/private/hoursWorked/"+hoursWorked);
        }
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

    uds.getSolutionDetails = function (solutionNumber, resourceProjection) {
        var url = udsHostName.clone().setPath('/documentation/solution/' + solutionNumber);
        if(resourceProjection !== undefined) {url.addQueryParam('resourceProjection', resourceProjection);}
        return executeUdsAjaxCall(url,'GET');
    };

    uds.getSQIQuestions = function ( solutionNumber) {
        var url = udsHostName.clone().setPath('/documentation/solution/' + solutionNumber + '/reviews/questions');
        return executeUdsAjaxCall(url,'GET');
    };

    uds.postSQIScore = function (solutionNumber,reviewData) {
        var url = udsHostName.clone().setPath('/documentation/solution/' + solutionNumber + '/reviews');
        return executeUdsAjaxCallWithData(url,reviewData,'POST');
    };


    uds.getSbrList = function (resourceProjection,query) {
        var url = udsHostName.clone().setPath('/user/metadata/sbrs');
        url.addQueryParam('resourceProjection',resourceProjection);
        url.addQueryParam('where',encodeURIComponent(query));
        return executeUdsAjaxCall(url,'GET');
    };

    uds.fetchCaseSbrs = function () {
        var url =udsHostName.clone().setPath('/case/sbrs');
        return executeUdsAjaxCall(url,'GET');
    };

    uds.pinSolutionToCase = function( caseNumber,solutionJson){
        var url = udsHostName.clone().setPath('/case/' + caseNumber);
        return executeUdsAjaxCallWithData(url, solutionJson ,'PUT');
    };

    uds.removeUserSbr = function (userId, query) {
        var url = udsHostName.clone().setPath('/user/' + userId + '/sbr').addQueryParam('where', encodeURIComponent(query));
        return executeUdsAjaxCall(url, 'DELETE');
    };


    uds.getRoleList = function (query) {
        var url = udsHostName.clone().setPath('/user/metadata/roles');
        url.addQueryParam('where', encodeURIComponent(query));
        return executeUdsAjaxCall( url, 'GET');
    };

    uds.getRoleDetails = function (roleId) {
        var url = udsHostName.clone().setPath('/user/metadata/roles/'+roleId);
        return executeUdsAjaxCall( url, 'GET');
    };

    uds.removeUserRole = function (userId, query) {
        var url = udsHostName.clone().setPath('/user/' + userId + '/role').addQueryParam('where', query);
        return executeUdsAjaxCall(url, 'DELETE');
    };

    uds.postAddUsersToSBR = function ( userId, uql, data) {
        if (uql == null || uql == undefined || uql === '') {
            throw 'User Query is mandatory';
        }
        var url = udsHostName.clone().setPath('/user/' + userId + '/sbr').addQueryParam('where', encodeURIComponent(uql));
        return executeUdsAjaxCallWithData(url, data, 'POST');
    };

    uds.postAddUsersToRole = function ( userId, uql, data) {
        if (uql == null || uql == undefined || uql === '') {
            throw 'User Query is mandatory';
        }
        var url = udsHostName.clone().setPath('/user/' + userId + '/role').addQueryParam('where', uql);
            return executeUdsAjaxCallWithData(url, data, 'POST');
    };

    uds.getOpenCasesForAccount = function (uql) {
        var path = '/case';
        var url =udsHostName.clone().setPath(path).addQueryParam('where', encodeURIComponent(uql));
        url.addQueryParam('resourceProjection', 'Minimal');
        return executeUdsAjaxCall(url,'GET');
    };

    uds.getCallLogsForCase = function (caseNumber) {
        var url =udsHostName.clone().setPath('/case/' + caseNumber + "/calls");
        return executeUdsAjaxCall(url,'GET');
    };

    uds.getQuestionDependencies = function () {
        var path = '/case/ktquestions';
        var url =udsHostName.clone().setPath(path);
        return executeUdsAjaxCall(url,'GET');
    };

    uds.postRoleLevel = function(userId,roleName,roleLevel) {
        var url = udsHostName.clone().setPath('/user/' + userId + "/role-level/"+roleName);
        return executeUdsAjaxCallWithData( url, roleLevel,'PUT');
    };
    
    uds.postEditPrivateComments = function (caseNumber,caseComment,caseCommentId,draft) {
        var url = udsHostName.clone().setPath('/case/' + caseNumber + "/comments/"+ caseCommentId+"/private");
        url.addQueryParam('draft', draft);
        return executeUdsAjaxCallWithData(url,caseComment,'PUT');
    };

    uds.createCaseNep = function(caseNumber, nep) {
        var url = udsHostName.clone().setPath('/case/' + caseNumber + "/nep");
        return executeUdsAjaxCallWithData( url, nep,'POST');
    };

    uds.updateCaseNep = function(caseNumber, nep) {
        var url = udsHostName.clone().setPath('/case/' + caseNumber + "/nep");
        return executeUdsAjaxCallWithData( url, nep,'PUT');
    };

    uds.removeCaseNep = function(caseNumber) {
        var url = udsHostName.clone().setPath('/case/' + caseNumber + "/nep");
        return executeUdsAjaxCall( url ,'DELETE');
    };

    uds.getAvgCSATForAccount = function(uql) {
        var url = udsHostName.clone().setPath('/metrics/CsatAccountAvg').addQueryParam('where', encodeURIComponent(uql));
        return executeUdsAjaxCall(url,'GET');
    };

    uds.getCaseContactsForAccount = function(accountNumber){
        var url = udsHostName.clone().setPath('/account/' + accountNumber + "/contacts");
        return executeUdsAjaxCall(url,'GET');
    };

    uds.getCaseGroupsForContact = function(contactSSO){
        var url = udsHostName.clone().setPath('/case/casegroups/user/' + contactSSO);
        return executeUdsAjaxCall(url,'GET');
    };

    uds.getRMECountForAccount = function(uql){
        var url = udsHostName.clone().setPath('/case/history').addQueryParam('where', encodeURIComponent(uql));
        return executeUdsAjaxCall(url,'GET');
    };

    uds.deleteAssociates = function(caseId,associateId){
        var url = udsHostName.clone().setPath('/case/' + caseId + '/associate/' + associateId);
        return executeUdsAjaxCall(url,'DELETE');
    };

    uds.updateCaseAssociate = function(caseId,jsonAssociates){
        var url = udsHostName.clone().setPath('/case/' + caseId + "/associate");
        return executeUdsAjaxCallWithData(url, jsonAssociates,'PUT');
    };

    uds.fetchSolutionDetails = function(solutionIdQuery){
        var url = udsHostName.clone().setPath('/documentation/solution').addQueryParam('where', encodeURIComponent(solutionIdQuery));
        url.addQueryParam('resourceProjection', 'Minimal');
        return executeUdsAjaxCall(url,'GET');
    };

    uds.setHandlingSystem = function(caseNumber,handlingSystemArray){
        var url = udsHostName.clone().setPath('/case/' + caseNumber + "/handlingsystems");
        return executeUdsAjaxCallWithData(url, handlingSystemArray,'PUT');
    };

    uds.fetchSolr = function function_name(query) {
      if(query.q === undefined || query.q === null || query.q === '') throw 'SOLR Query is mandatory';

      var url = udsHostName.clone().setPath('/solr');
      url.addQueryParam('wt', 'json');
      url.addQueryParam('q', query.q);
      if(query.fq !== undefined && query.fq !== '') {
        url.addQueryParam('fq', query.fq);
      }
      if(query.start !== undefined) {
        url.addQueryParam('start', query.start);
      }
      if(query.rows !== undefined) {
        url.addQueryParam('rows', query.rows);
      }
      if(query.sort !== undefined && query.sort !== '') {
        url.addQueryParam('sort', query.sort);
      }

      return executeUdsAjaxCall(url, 'GET');
    };

    uds.addCaseSbrs = function(caseNumber,sbrArray){
        var url = udsHostName.clone().setPath('/case/' + caseNumber + "/sbrs");
        return executeUdsAjaxCallWithData(url, sbrArray,'PUT');
    };

    uds.removeCaseSbrs = function(caseNumber,sbrArray){
        var url = udsHostName.clone().setPath('/case/' + caseNumber + "/sbrs");
        return executeUdsAjaxCallWithData(url, sbrArray,'DELETE');
    };

    uds.getAllRolesList = function(query){
        var url = udsHostName.clone().setPath('/user/metadata/roles/query');
        url.addQueryParam('where', encodeURIComponent(query));
        return executeUdsAjaxCall( url, 'GET');
    };

    uds.createRole = function(roleDetails){
        var url = udsHostName.clone().setPath('/user/metadata/roles/add');
        return executeUdsAjaxCallWithData(url, roleDetails,'POST');
    };

    uds.updateRole = function(roleId,rolePayload){
        var url = udsHostName.clone().setPath('/user/metadata/roles/'+roleId);
        return executeUdsAjaxCallWithData(url, rolePayload,'PUT');
    };

    uds.deleteRole = function(roleId){
        var url = udsHostName.clone().setPath('/user/metadata/roles/'+roleId);
        return executeUdsAjaxCall(url,'DELETE');
    };

    uds.getAdditionalContacts = function(caseNumber){
        var url = udsHostName.clone().setPath('/case/' + caseNumber + "/contacts");
        return executeUdsAjaxCall(url,'GET');
    };

    uds.removeAdditionalContacts = function(caseNumber,contacts){
        var url = udsHostName.clone().setPath('/case/' + caseNumber + "/contacts");
        return executeUdsAjaxCallWithData(url,contacts,'DELETE');
    };

    uds.addAdditionalContacts = function(caseNumber,contacts){
        var url = udsHostName.clone().setPath('/case/' + caseNumber + "/contacts");
        return executeUdsAjaxCallWithData(url,contacts,'PUT');
    };

    uds.fetchBrmsSolrQuery = function(jsonObject){
        var url = udsHostName.clone().setPath('/brms');
        return executeUdsAjaxCallWithData(url, jsonObject,'POST');
    };

    uds.fetchTopCasesFromSolr = function(queryString){
        var url = udsHostName.clone().setPath('/solr?'+queryString);
        return executeUdsAjaxCall(url,'GET');
    };

    return uds;
}));
