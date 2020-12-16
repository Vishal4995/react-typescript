import {NotificationManager} from 'react-notifications'
import {history} from '../App'
import _ from 'lodash';

function ResponseFilter(response) {
    var serverResponseStatus = !_.isEmpty(response) ? response.status : null
    var serverResponseData = (!_.isEmpty(response) && typeof response.data != 'undefined')
        ? response.data
        : ((!_.isEmpty(response) && typeof response.error != 'undefined') ? response.error : null);
    if (!_.isEmpty(serverResponseData)) {
        if (serverResponseData.status === 0) {
            if (serverResponseData.error.errorCode === 2 && !localStorage.getItem('collaboratorToken')) {
                history.push('/');
                localStorage.clear();
                setTimeout(
                    function () {
                        return {
                            serverResponseStatus,
                            serverResponseData
                        }
                    }
                        .bind(this),
                    2000
                );
            }
        }
    }

    return {
        serverResponseStatus,
        serverResponseData
    }
}

function ResponseUnauthorize() {
    NotificationManager.error('You are not authorized to perform this action', 'Unauthorized Request', 4000, () => {
    });
}

function ResponseProblem() {
    NotificationManager.error('Please try after some time', 'Problem Occured', 4000, () => {
    });
}

function ResponseSuccess(serverResponseData) {
    NotificationManager.success(serverResponseData.response.message, "Success", 4000, () => {
    });
}

function ResponseError(serverResponseData) {
    if (serverResponseData) {
        if (typeof serverResponseData.error.errors != 'undefined') {
            let serverError = serverResponseData.error.errors;
            if (typeof serverError == 'object') {
                if (serverError.length) {
                    (serverError).map(function (value, index) {
                        NotificationManager.error(
                            value.message,
                            "Problem occured", 4000,
                            () => {
                            }
                        );
                    });

                    return;
                } else {
                    return NotificationManager.error(
                        serverError.message,
                        "Problem occured", 4000,
                        () => {
                        }
                    );
                }
            } else {
                serverError = serverResponseData.error;
                return NotificationManager.error(
                    serverError.message,
                    serverError.errors, 4000,
                    () => {
                    }
                );
            }
        }

        if (typeof serverResponseData.error.message != 'undefined') {
            return NotificationManager.error(
                serverResponseData.error.message,
                "Problem occured", 4000,
                () => {
                }
            );
        }
    } else {
        return ResponseProblem();
    }
}

function ResponseSuccessNotification(serverResponseData) {
    NotificationManager.success(
        serverResponseData.message,
        "Successfully Processed",
        4000,
        () => {
        }
    );
}

function ResponseErrorNotificaiton(serverResponseData) {
    if (typeof serverResponseData.errors == 'object') {
        _.each(serverResponseData.errors, function (value, index) {
            NotificationManager.error(
                value,
                serverResponseData.errorTitle,
                4000,
                () => {
                }
            );
        })
    } else {
        NotificationManager.error(
            serverResponseData.message,
            serverResponseData.errorTitle,
            4000,
            () => {
            }
        );
    }


}

function IsErrorResponse(serverResponseData) {
    return ((typeof serverResponseData.error != 'undefined')
        && (serverResponseData.error.errorCode));
}


function SetServerError(errors) {
    let errorList = {};

    if (errors) {
        if (typeof errors.title == 'undefined') {
            _.forEach(errors, function (value, index) {
                if (value) {
                    if (typeof value.fieldName != 'undefined')
                        errorList[value.fieldName] = value.message;

                    if (typeof value.title != 'undefined')
                        errorList[value.title] = value.message;
                }
            });
        } else {
            errorList = errors;
        }
    }


    return errorList;
}


function IsResponseFieldExist(serverResponseData, field) {
    return (typeof serverResponseData.response == 'object' && typeof serverResponseData.response[field] != 'undefined');
}


function handleRoute(url, data) {
    history.push({
        pathname: '/signup',
        search: "?planId=5a741c3d452cad1552829d0e&planType=monthly",
        state: data
    })

}

function HandleServerResponse(response, states, otherData = []) {
    if (typeof states != 'object') {
        states = {rejected: 'rejected', success: 'success'}
    }

    let {serverResponseStatus, serverResponseData} = ResponseFilter(response);

    if (serverResponseStatus) {
        let otherDispatchData = {};

        if (otherData.length) {
            _.each(otherData, function (otherDataValue, otherDataIndex) {
                _.each(otherDataValue, function (value, index) {
                    if (IsResponseFieldExist(serverResponseData, value))
                        otherDispatchData[index] = serverResponseData.response[value];
                })
            })
        }

        if (IsErrorResponse(serverResponseData)) {
            let errorObject = {};
            if (typeof serverResponseData.error != 'undefined') {
                errorObject = {
                    type: states.rejected,
                    errorTitle: (typeof serverResponseData.error.title != 'undefined') ? serverResponseData.error.title : "Some Problem Occured",
                    errors: SetServerError(serverResponseData.error.errors),
                    message: (typeof serverResponseData.error.message != 'undefined') ? serverResponseData.error.message : "Problem Occured"
                }
            } else {
                errorObject = {
                    type: states.rejected,
                    errorTitle: "Some Problem Occured",
                    errors: [],
                    message: (typeof serverResponseData.error.message != 'undefined') ? serverResponseData.error.message : "Problem Occured"
                }
            }

            return _.extend(otherDispatchData, errorObject);
        } else {

            return _.extend(
                otherDispatchData, {
                    type: states.success,
                    success: true,
                    message: (typeof serverResponseData.response.message != 'undefined') ? serverResponseData.response.message : "Request has been processed"
                }
            );
        }
    } else {
        return {
            type: states.rejected,
            errorTitle: "Server Error",
            message: "Server not responding"
        };
    }
}


export {
    ResponseFilter,
    ResponseError,
    ResponseSuccess,
    ResponseSuccessNotification,
    ResponseErrorNotificaiton,
    ResponseProblem,
    ResponseUnauthorize,
    handleRoute,
    IsErrorResponse,
    SetServerError,
    HandleServerResponse
}
