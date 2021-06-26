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

const CommonUtils = require('../../util/CommonUtils');

const CleanTaskScopes = require('../constant/CleanTaskScopes');
const TaskMessages = require('../constant/TaskMessages');
const TaskVarNames = require('../constant/TaskVarNames');

const TaskArgSanitizerException = require('./TaskArgSanitizerException');

const validateArgDefinedNonEmpty = function(
  arg,
  argName,
  callerName,
  shouldSkipArgDefinedCheck
) {
  if (shouldSkipArgDefinedCheck !== true) {
    shouldSkipArgDefinedCheck = false;
  }

  if (!CommonUtils.isNonEmptyString(callerName)) {
    callerName = 'validateArgDefinedNonEmpty';
  }

  if (!CommonUtils.isNonEmptyString(argName)) {
    argName = 'argument';
  }

  if (!shouldSkipArgDefinedCheck) {
    if (!CommonUtils.isNonEmptyString(arg, true)) {
      throw new TaskArgSanitizerException(
        `No ${argName} provided, for argument sanitation!`,
        callerName
      );
    }
  }
};

const sanitizeCleanTaskScopeArg = function(cleanTaskScopeArg, taskName) {
  validateArgDefinedNonEmpty(
    taskName,
    'task name',
    'santizeCleanTaskArg'
  );

  if (!CommonUtils.isNonEmptyString(cleanTaskScopeArg, true)) {
    console.log(
      `No clean task arg provided, for task "${taskName}" - defaulting, to "${CleanTaskScopes.ALL}".`
    );

    return CleanTaskScopes.ALL;
  }
  
  const cleanTaskScopeKey = cleanTaskScopeArg.toUpperCase().replace(/-/g, '_');
  
  if (!CleanTaskScopes.hasOwnProperty(cleanTaskScopeKey)) {
    throw new TaskArgSanitizerException(
      TaskMessages.templated.STATUS_ERROR(
        'protoreaction',
        taskName,
        (
          `No clean scope associated with arg: "${cleanTaskScopeArg}"! `
          + `Options are: ${CommonUtils.convertArrayToCommaDelimitedStringWithAndOr(Object.values(CleanTaskScopes))}.`
        )
      ),
      'santizeCleanTask',
    );
  }

  return CleanTaskScopes[cleanTaskScopeKey];
};

const sanitizeAppNameArg = function(appNameArg, taskName) {
  validateArgDefinedNonEmpty(
    taskName,
    'task name',
    'sanitizeAppNameArg',
    true
  );

  const exMessageDefault = ' App name is required, may not be an empty string, may not contain uppercase characters,'
    + ' may not begin with a symbol, must be less than 214 characters, in length, and may not begin or end with trailing whitespace.';

  if (!CommonUtils.isNonEmptyString(appNameArg, true)) {
    throw new TaskArgSanitizerException(
      TaskMessages.templated.STATUS_ERROR(
        'protoreaction',
        taskName,
        exMessageDefault
      ),
      'sanitizeAppNameArg'
    );
  } else {
    if (appNameArg.length > 214) {
      throw new TaskArgSanitizerException(
        TaskMessages.templated.STATUS_ERROR(
          'protoreaction',
          taskName,
          `App name length is greater than the allowed 214 characters, by a difference of: ${(appNameArg.length - 214)}`
        ),
        'sanitizeAppNameArg'
      );
    }

    let illegalChars = appNameArg.match(/^[^A-Za-z@]/);

    if (CommonUtils.isNonEmptyArray(illegalChars)) {
      throw new TaskArgSanitizerException(
        TaskMessages.templated.STATUS_ERROR(
          'protoreaction',
          taskName,
          `App name: "${appNameArg}" starts with illegal character: "${illegalChars[0]}". ${exMessageDefault}`
        ),
        'sanitizeAppNameArg'
      );
    }

    illegalChars = appNameArg.match(/^\./);

    if (CommonUtils.isNonEmptyArray(illegalChars)) {
      throw new TaskArgSanitizerException(
        TaskMessages.templated.STATUS_ERROR(
          'protoreaction',
          taskName,
          `App name "${appNameArg}" starts with illegal character: "${illegalChars[0]}". ${exMessageDefault}`
        ),
        'sanitizeAppNameArg'
      );
    }

    illegalChars = appNameArg.match(/[A-Z]/g);

    if (CommonUtils.isNonEmptyArray(illegalChars)) {
      throw new TaskArgSanitizerException(
        TaskMessages.templated.STATUS_ERROR(
          'protoreaction',
          taskName,
          `App name: "${appNameArg}" contains uppercase characters:`
          + ` "${CommonUtils.convertArrayToCommaDelimitedStringWithAndOr(illegalChars)}". ${exMessageDefault}`
        ),
        'sanitizeAppNameArg'
      );
    }

    const validChars = appNameArg.match(/^[a-z0-9._~()'!*:@,;+?-]*$/);

    if (!CommonUtils.isNonEmptyArray(validChars)) {
      throw new TaskArgSanitizerException(
        TaskMessages.templated.STATUS_ERROR(
          'protoreaction',
          taskName,
          `App name: "${appNameArg}" contains invalid characters.`
        ),
        'sanitizeAppNameArg'
      );
    }
  }

  return appNameArg;
};

const sanitizeAuthorArg = function(
  authorNameArg,
  secondaryAuthorInfoArg,
  secondaryAuthorInfoArgName,
  taskName
) {
  validateArgDefinedNonEmpty(
    secondaryAuthorInfoArg,
    taskName,
    'sanitizeAuthorArg'
  );

  if (!CommonUtils.isNonEmptyString(authorNameArg, true)) {
    throw new TaskArgSanitizerException(
      TaskMessages.templated.STATUS_ERROR(
        'protoreaction',
        taskName,
        `${TaskVarNames.AUTHOR_NAME} arg is required for secondary author arg: "${secondaryAuthorInfoArgName}:${secondaryAuthorInfoArg}".`
      ),
      'sanitizeAuthorArg'
    );
  }

  return secondaryAuthorInfoArg;
};

const sanitizeGithubUrlArg = function(githubUrlArg, taskName) {
  validateArgDefinedNonEmpty(
    taskName,
    'task name',
    'sanitizeGithubUrlArg',
    true
  );

  const isGithubUrl = CommonUtils.isNonEmptyArray(
      githubUrlArg.match(
        /(?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/
      )
    );

  if (!isGithubUrl) {
    throw new TaskArgSanitizerException(
      TaskMessages.templated.STATUS_ERROR(
        'protoreaction',
        taskName,
        `Github URL: "${githubUrlArg}" is invalid.`
      ),
      'sanitizeGithubUrlArg'
    );
  }

  return githubUrlArg;
};

const sanitizeSemverArg = function(semverArg, taskName) {
  validateArgDefinedNonEmpty(
    taskName,
    'task name',
    'sanitizeSemverArg',
    true
  );

  // https://github.com/semver/semver/issues/232
  const isSemverArg = CommonUtils.isNonEmptyArray(
      semverArg.match(
        /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(-(0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(\.(0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*)?(\+[0-9a-zA-Z-]+(\.[0-9a-zA-Z-]+)*)?$/
      )
    );

  if (!isSemverArg) {
    throw new TaskArgSanitizerException(
      TaskMessages.templated.STATUS_ERROR(
        'protoreaction',
        taskName,
        `Semver version: "${semverArg}" is invalid.`
      ),
      'sanitizeSemverArg'
    );
  }

  return semverArg;
};

module.exports = Object.freeze({
  sanitizeAppNameArg,
  sanitizeAuthorArg,
  sanitizeCleanTaskScopeArg,
  sanitizeGithubUrlArg,
  sanitizeSemverArg,
  validateArgDefinedNonEmpty
});
