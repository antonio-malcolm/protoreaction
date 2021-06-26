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

require('./runTaskPreflightEngineCheck');

const CommonUtils = require('../util/CommonUtils');

const RunTaskMissingDependenciesException = function(missingDependencies = [], err) {
  console.error('ERROR! Tasks require the package dependencies be installed.');

  if (CommonUtils.isNonEmptyArray(missingDependencies)) {
    console.warn(
        `Missing Dependencies: ${CommonUtils.convertArrayToCommaDelimitedStringWithAndOr(missingDependencies)}`
      );
  }

  if (CommonUtils.isAssignedNotNull(err) && CommonUtils.isAssignedNotNull(err.message)) {
    console.warn(
       `Reason: ${err.name}: ${err.message}`
      );
  }

  console.log('');
  console.warn('Run: `$ pnpm install`, then try your task again.');
  console.log('');
  console.log('Exiting...');
};

let colors;
let parseArgs;

try {
  colors = require('colors');
  parseArgs = require('minimist');
} catch (err) {
  throw new RunTaskMissingDependenciesException(
      ['colors', 'minimist'],
      err
    );
}

const Tasks = require('./constant/Tasks');
const TaskArgDescriptions = require('./constant/TaskArgDescriptions');
const TaskArgSanitizer = require('./sanitizer/TaskArgSanitizer');
const TaskDescriptions = require('./constant/TaskDescriptions');
const CleanTaskScopes = require('./constant/CleanTaskScopes');
const TaskVarNames = require('./constant/TaskVarNames');
const TaskWorker = require('./worker/TaskWorker');

const getArgs = function(argKeys, shouldOmitUnnamed) {
  if (shouldOmitUnnamed !== true) {
    shouldOmitUnnamed = false;
  }

  let args = [];

  let parsedArgs = parseArgs(
      process.argv.slice(3),
      { 
        'string': [
          TaskVarNames.AUTHOR_EMAIL,
          TaskVarNames.AUTHOR_NAME,
          TaskVarNames.AUTHOR_URL,
          TaskVarNames.CLEAN_SCOPE,
          TaskVarNames.HOMEPAGE,
          TaskVarNames.LICENSE,
          TaskVarNames.NAME,
          TaskVarNames.REPO_TYPE,
          TaskVarNames.REPO_URL,
          TaskVarNames.VERSION
        ]
      }
    );

  // Non-keyed args...
  // https://github.com/substack/minimist
  if (!shouldOmitUnnamed) {
    args = [ ...parsedArgs['_'] ];
  }

  // If no args were provided, check environment variables...
  if (!CommonUtils.isNonEmptyObject(parsedArgs)) {
    parsedArgs[TaskVarNames.AUTHOR_EMAIL] = process.env[TaskVarNames.AUTHOR_EMAIL];
    parsedArgs[TaskVarNames.AUTHOR_NAME] = process.env[TaskVarNames.AUTHOR_NAME];
    parsedArgs[TaskVarNames.AUTHOR_URL] = process.env[TaskVarNames.AUTHOR_URL];
    parsedArgs[TaskVarNames.CLEAN_SCOPE] = process.env[TaskVarNames.CLEAN_SCOPE];
    parsedArgs[TaskVarNames.HOMEPAGE] = process.env[TaskVarNames.HOMEPAGE];
    parsedArgs[TaskVarNames.LICENSE] = process.env[TaskVarNames.LICENSE];
    parsedArgs[TaskVarNames.NAME] = process.env[TaskVarNames.NAME];
    parsedArgs[TaskVarNames.REPO_TYPE] = process.env[TaskVarNames.REPO_TYPE];
    parsedArgs[TaskVarNames.REPO_URL] = process.env[TaskVarNames.REPO_URL];
    parsedArgs[TaskVarNames.VERSION] = process.env[TaskVarNames.VERSION];
  }

  if (CommonUtils.isNonEmptyArray(argKeys)) {
    argKeys.forEach((key) => {
      switch (key) {
        default:
          args.push(
            parsedArgs[key]
          );
  
          return;
      }
    });
  }

  return args;
};

const logException = function(task, exception){
  let callerName;
  let message;
  let stacktrace;

  if (typeof exception.getMessage === 'function') {
    callerName = exception.getCallerName();
    message = exception.getMessage();
    stacktrace = exception.getStackTrace();
  } else {
    callerName = exception.name;
    message = exception.message;
    stacktrace = exception.stack;
  }

  console.log(
    colors.red.bold(
      `ERROR! An error occurred, during task: ${task}... `
    )
  );

  console.log(
    colors.magenta.bold('At: ') + colors.magenta(callerName)
  );

  console.log(
    colors.magenta.bold('Message: ') + colors.magenta(message)
  );

  console.log(
    colors.yellow.bold('Stack Trace: ') + colors.yellow(stacktrace)
  );
};

const clean = function(cleanScope) {
  console.log(
    colors.blue.bold.underline(
      `Starting task: ${Tasks.CLEAN}...`
    )
  );

  try {
    cleanScope = TaskArgSanitizer.sanitizeCleanTaskScopeArg(cleanScope, Tasks.CLEAN);
  } catch (ex) {
    logException(Tasks.CLEAN, ex);
    return;
  }

  try {
    TaskWorker.clean(cleanScope);

    console.log(
      colors.green.bold(
        `SUCCESS! Successfully completed task: ${Tasks.CLEAN}.`
      )
    );
  } catch (ex) {
    logException(Tasks.CLEAN, ex);
    return;
  }
};

const createApp = function(
  appName,
  appVersion,
  authorName,
  authorEmail,
  authorUrl,
  homepage,
  license,
  repoType,
  repoUrl
) {
  console.log(
    colors.blue.bold.underline(
      `Starting task: ${Tasks.CREATE}...`
    )
  );

  const currWorkDir = process.cwd();

  console.log(
    colors.blue(
      `Sanitizing args...`
    )
  );

  try {
    appName = TaskArgSanitizer.sanitizeAppNameArg(appName, Tasks.CREATE);

    if (CommonUtils.isNonEmptyString(appVersion, true)) {
      appVersion = TaskArgSanitizer.sanitizeSemverArg(appVersion, Tasks.CREATE);
    }

    if (CommonUtils.isNonEmptyString(authorEmail, true)) {
      authorEmail = TaskArgSanitizer.sanitizeAuthorArg(
          authorName,
          authorEmail,
          TaskVarNames.AUTHOR_EMAIL,
          Tasks.CREATE
        );
    }

    if (CommonUtils.isNonEmptyString(authorUrl, true)) {
      authorUrl = TaskArgSanitizer.sanitizeAuthorArg(
          authorName,
          authorUrl,
          TaskVarNames.AUTHOR_EMAIL,
          Tasks.CREATE
        );
    }

    if (repoType === 'git') {
      repoUrl = TaskArgSanitizer.sanitizeGithubUrlArg(repoUrl, Tasks.CREATE);
    }
  } catch (ex) {
    logException(Tasks.CREATE, ex);
    return;
  }

  try {
    TaskWorker.createApp(
        appName,
        appVersion,
        authorName,
        authorEmail,
        authorUrl,
        homepage,
        license,
        repoType,
        repoUrl,
        currWorkDir
      );

    console.log(
      colors.green.bold(
        `SUCCESS! Successfully completed task: ${Tasks.CREATE}.`
      )
    );
  } catch (ex) {
    logException(Tasks.CREATE, ex);
    return;
  }
};

const task = process.argv[2];

switch (task) {
  case Tasks.CLEAN:
    clean(
      ...getArgs([
        TaskVarNames.CLEAN_SCOPE
      ])
    );

    break;

  case Tasks.CREATE:
    let appName = getArgs()[0];
    let appVersion = getArgs()[1];

    if (CommonUtils.isAssignedNotNull(appName)) {
      appName = new String(appName);
    }

    if (CommonUtils.isAssignedNotNull(appVersion)) {
      appVersion = new String(appVersion);
    }

    if (CommonUtils.isNonEmptyString(
      getArgs([TaskVarNames.NAME], true)[0],
      true
    )) {
      appName = getArgs([TaskVarNames.NAME], true)[0];
    }

    if (CommonUtils.isNonEmptyString(
      getArgs([TaskVarNames.VERSION], true)[0],
      true
    )) {
      appVersion = getArgs([TaskVarNames.VERSION], true)[0];
    }

    createApp(
      appName,
      appVersion,
      ...getArgs([
        TaskVarNames.AUTHOR_NAME,
        TaskVarNames.AUTHOR_EMAIL,
        TaskVarNames.AUTHOR_URL,
        TaskVarNames.HOMEPAGE,
        TaskVarNames.LICENSE,
        TaskVarNames.REPO_TYPE,
        TaskVarNames.REPO_URL
      ], true)
    );

    break;

  case Tasks.LIST:
    console.log(
      colors.blue.bold.underline(
        `The following tasks are available, for this project:`
      )
    );

    Object.values(Tasks).forEach((TASK) => {
      console.log(
        colors.green.bold(`${TASK}: `)
        + colors.blue(
          TaskDescriptions[TASK]
        )
      );

      const taskArgDescriptions = TaskArgDescriptions[TASK];

      if (CommonUtils.isNonEmptyObject(taskArgDescriptions)) {
        console.log(
          colors.blue.bold('  Available arguments:')
        );

        Object.keys(taskArgDescriptions).forEach((ARG_DESC_KEY) => {
          console.log(
            colors.green.bold(`    ${ARG_DESC_KEY}: `)
            + colors.blue(
              taskArgDescriptions[ARG_DESC_KEY]
            )
          );

          let acceptedValues = [];
          let acceptedValuesAreBoolean = false;

          switch (ARG_DESC_KEY) {
            case `--${TaskVarNames.CLEAN_SCOPE}`:
              acceptedValues = Object.values(CleanTaskScopes);
              break;
          }

          if (CommonUtils.isNonEmptyArray(acceptedValues)) {
            console.log(
              colors.blue.bold('      Accepted values:')
            );
  
            acceptedValues.forEach((VAL) => {
              console.log(
                colors.green.bold(`        ${VAL}`)
              );
            });
  
            if (acceptedValuesAreBoolean) {
              console.log(
                colors.blue('        (presence of arg, with no value, assumes true)')
              );
              console.log(
                colors.blue('        (absence of arg assumes false)')
              );
            }
          }
        });
      }

      console.log('');
    });

    break;

  default:
    console.log(
      colors.red.bold(
        `ERROR! No task: ${task} is registered, for execution!`
      )
    );

    console.log(
      colors.red.bold(
        `Exiting...`
      )
    );

    break;
}
