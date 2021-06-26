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

const TaskDescriptions = Object.freeze({
  [Tasks.CREATE]: 'Creates a new, fully-configured, ready-to-run React + Preact project, from the project zygote',
  [Tasks.CLEAN]: 'Clears files and directories in the drafts directory',
  [Tasks.DEPLOY]: 'deploy',
  [Tasks.LIST]: 'Displays this list of available commands and descriptions'
});

module.exports = TaskDescriptions;
