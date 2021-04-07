import { history } from '../App'
import _ from 'lodash';

function ResponseFilter(response: any) {
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
                    ,
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




export {
    ResponseFilter,
}
