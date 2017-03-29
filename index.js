/**
 * Copyright 2017 Comcast Cable Communications Management, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const childProcess = require('child_process');
const fs = require('fs');
const serviceName = 'nightmare';

const getElapsedTime = (startTime) => {
  return +new Date() - startTime;
};

const isConfigValid = (service) => {
  // Make sure we have options we want
  let hasProperConfig = service.pingServiceOptions &&
    service.pingServiceOptions[serviceName] &&
    service.pingServiceOptions[serviceName].scriptPath;

  // Make sure the options are valid
  if (hasProperConfig) {
    let path = service.pingServiceOptions[serviceName].scriptPath.value;
    return fs.existsSync(path);
  }

  // Invalid by default
  return false;
};

const runScript = (scriptPath, errorCallback, successCallback) => {
  let errorMessage;
  let invoked = false;
  let process = childProcess.fork(scriptPath, [], {
    stdio: ['pipe', 'pipe', 'pipe', 'ipc']
  });

  let handleError = (err) => {
    if (!invoked) {
      invoked = true;
      errorCallback(err);
    }
  };

  process.on('error', handleError);

  process.on('exit', (code) => {
    if (code !== 0 ) {
      handleError(new Error(errorMessage));
    } else {
      successCallback('Success!');
    }
  });

  // Process stack trace if Error is thrown by child script
  process.stderr.on('data', (data) => {
    let keyphrase = "Error: ";

    errorMessage = `${data}`;
    errorMessage = errorMessage.slice(errorMessage.indexOf(keyphrase) + keyphrase.length);
    errorMessage = errorMessage.substr(0, errorMessage.indexOf('\n'));

    return errorMessage;
  });
};

function PingService() {};

exports = module.exports = PingService;

PingService.prototype.ping = (service, callback) => {
  if (!isConfigValid(service)) {
    // break immediately if not setup correctly
    callback(`${serviceName} - Plugin configuration is missing or incorrect`);
    return;
  }

  let scriptPath = service.pingServiceOptions[serviceName].scriptPath.value;
  let startTime = +new Date();

  let handleError = (err) => {
    let elapsedTime = getElapsedTime(startTime);
    let errorMessage = `${err.name}: ${err.message}`;

    callback(errorMessage, null, null, elapsedTime)
  };

  let handleSuccess = (msg) => {
    let elapsedTime = getElapsedTime(startTime);

    callback(null, msg, null, elapsedTime);
  };

  runScript(scriptPath, handleError, handleSuccess);
};

PingService.prototype.getDefaultOptions = () => {
  return {
    scriptPath: {
      descr: 'Relative path of the script to be run',
      required: true
    }
  };
};
