/**
 * Copyrighht 2021 to present, Antonio Malcolm.
 * All rights reserved.
 *
 * This source code file is a part of protoreaction (A.K.A., "protoReaction").
 *
 * This source code is licensed under the BSD 3-Clause license,
 * and is subject to the terms of the BSD 3-Clause license,
 * found in the LICENSE file, in the root directory of this project.
 * If a copy of the BSD 3-Clause license cannot be found,
 * as part of this project, you can obtain one, at:
 * https://opensource.org/licenses/BSD-3-Clause
 */

'use strict';

const Tasks = require('./Tasks.js');
const TaskVarNames = require('./TaskVarNames.js');

const TaskArgDescriptions = Object.freeze({
  [Tasks.CLEAN]: {
    [`--${TaskVarNames.CLEAN_SCOPE}`]: 'Clear files and directories for the specified scope'
  },
  [Tasks.CREATE]: {
    '[NAME]': 'Name of your project (REQUIRED) (will be used in auto-configuration of package.json)',
    [`--${TaskVarNames.NAME}`]: 'Name of your project (REQUIRED) (will be used in auto-configuration of package.json)',
    [`--${TaskVarNames.VERSION}`]: 'Version (semver) of your project (will be used in auto-configuration of package.json)',
    [`--${TaskVarNames.AUTHOR_NAME}`]: 'Name of your project author (will be used in auto-configuration of package.json)',
    [`--${TaskVarNames.AUTHOR_EMAIL}`]: 'Email address of your project author (will be used in auto-configuration of package.json)',
    [`--${TaskVarNames.AUTHOR_URL}`]: 'Website URL of your project author (will be used in auto-configuration of package.json)',
    [`--${TaskVarNames.HOMEPAGE}`]: 'Website URL for your project (will be used in auto-configuration of package.json)',
    [`--${TaskVarNames.LICENSE}`]: 'License for your project (will be used in auto-configuration of package.json)',
    [`--${TaskVarNames.REPO_TYPE}`]: 'Repository type for your project (will be used in auto-configuration of package.json)',
    [`--${TaskVarNames.REPO_URL}`]: 'Repository URL for your project (will be used in auto-configuration of package.json)'
  }
});

module.exports = TaskArgDescriptions;
