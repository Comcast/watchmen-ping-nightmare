[![Build Status](https://travis-ci.org/Comcast/watchmen-ping-nightmare.svg?branch=master)](https://travis-ci.org/Comcast/watchmen-ping-nightmare)

# :watch::horse: NightmareJS Plugin for Watchmen
## Allows Nightmare scripts to be executed by a Watchmen instance

* [nightmare (@:octocat:)][nightmare]
* [watchmen (@:octocat:)][watchmen]

Feed a nightmare script to Watchmen to run synthetic monitoring.

In your Watchmen directory:
`npm install nightmare --save`
`npm install watchmen-ping-nightmare --save`


### How To Use:
- Create a nightmare script with a `.js` extension
```javascript
var Nightmare = require('nightmare');

Nightmare
  .goto('https://xfinity.com')
  .type('#main-search-field', 'puppies')
  .click('.search-button')
  .evaluate(function() {
    if (window.location.host === 'my.xfinity.com') {
      return window.location.host;
    }
  })
  .end()
  .then(function(result) {
    console.log('success', result);
  })
  .catch(function(err) {
    console.log('error!', err);
  });
```

- Copy your `.js` file to a directory on your Watchmen instance
- After uploaded - click add new service and select ping service `nightmare`
![add servce][add-service]
![select ping service][select-ping-service]
- In Ping options `scriptPath` put full file path and file name
![script path][script-file-path]
- Click `Save` and you'll be on your way!

Please read `CONTRIBUTING.md` for how to contribute to the project.

Any issues/comments/questions, please file an issue and we'll respond.

---

Copyright 2017 Comcast Cable Communications Management, LLC
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

[nightmare]: https://github.com/segmentio/nightmare
[watchmen]: https://github.com/iloire/watchmen

[add-service]: docs/add-new-service.png
[select-ping-service]: docs/select-ping-service.png
[script-file-path]: docs/script-file-path.png
