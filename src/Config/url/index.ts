import _ from "lodash";

import DevSetting from './development';
import ProdSetting from './production';
import StagSetting from './staging';
import api from './localhost';

let defaultSetting = {
    api: {
        url: process.env.REACT_APP_API_URL,
        mode: 'cors'
    },
    socket: process.env.REACT_APP_SOCKET_URL
}

let siteSetting = defaultSetting;
switch (process.env.REACT_APP_ENV) {
    case "prod":
    case "production":
        siteSetting = _.extend(defaultSetting, ProdSetting);
        break;
    case "stag":
    case "staging":
        siteSetting = _.extend(defaultSetting, StagSetting);
        break;
    case "dev":
    case "development":
        siteSetting = _.extend(defaultSetting, DevSetting);
        break;
    case "local":
    case "localhost":
        siteSetting = _.extend(defaultSetting, api);
        break;
    default:
        siteSetting = _.extend(defaultSetting, api);
}

export default siteSetting;
