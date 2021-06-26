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

const fs = require('fs');
const os = require('os');

const CommonUtils = require('../../util/CommonUtils');
const FileSystemUtils = require('../../util/FileSystemUtils');

const CleanTaskScopes = require('../constant/CleanTaskScopes');
const TaskMessages = require('../constant/TaskMessages');
const Tasks = require('../constant/Tasks');

const TaskWorkerException = require('./TaskWorkerException');

const templatePathRelative = 'zygote';
const draftPathRelative = 'incubator';

const packageJsonFileName = 'package.json';

const workspaces = Object.freeze({
  PREACT: 'preact',
  REACT: 'react'
});

const workspacePaths = Object.freeze({
  PREACT: `workspaces/${workspaces.PREACT}`,
  REACT: `workspaces/${workspaces.REACT}`
});

/**
 * Inrernal Methods...
 */

const performPostDraftCleanup = function(draftPathAbsolute, tmpDraftPathAbsolute, msgData) {
  let msgTxt = 'Performing post-draft cleanup...';

  if (CommonUtils.isNonEmptyObject(msgData)) {
    if (CommonUtils.isNonEmptyString(msgData.text)) {
      msgTxt = `${msgData.text}: ${msgTxt}`;
    }

    switch(msgData.type) {
      case 'error':
        console.error(msgTxt);
        break;

      case 'warn':
        console.warn(msgTxt);

      default:
        console.log(msgTxt);
        break;
    }
  } else {
    console.log(msgTxt);
  }

  try {
    FileSystemUtils.clearDirent(
        draftPathAbsolute,
        true
      );

    if (CommonUtils.isNonEmptyString(tmpDraftPathAbsolute, true)) {
      FileSystemUtils.clearDirent(
          tmpDraftPathAbsolute,
          true
        );
    }
  } catch (err) {
    console.error(`Cleanup failed, at path: ${draftPathAbsolute}`);
    console.warn('This issue should be considered rare, and is likely caused by a permissions issue or software update.');
    console.warn('Try manual cleanup, using the #clean command, or via the host operating system.');
    console.warn(`Reason: ${err.name}: ${err.message}`);
  }
};

/**
 * Exposed Methods...
 */

const clean = function(cleanTaskScope) {
  console.log(`Running task: ${Tasks.CLEAN}...`);

  try {
    switch (cleanTaskScope) {
      case CleanTaskScopes.ALL:
        FileSystemUtils.clearDirent(draftPathRelative);
        FileSystemUtils.clearDirent('node_modules', true);
        FileSystemUtils.clearDirent('npm-debug.log');
        FileSystemUtils.clearDirent('pnpm-debug.log');
        FileSystemUtils.clearDirent('.pnpm-debug.log');

        break;
        
      case CleanTaskScopes.DEPENDENCIES:
        FileSystemUtils.clearDirent('node_modules', true);
        FileSystemUtils.clearDirent('npm-debug.log');
        FileSystemUtils.clearDirent('pnpm-debug.log');
        FileSystemUtils.clearDirent('.pnpm-debug.log');

        break;
        
      case CleanTaskScopes.DEPENDENCY_LOCKS:
        FileSystemUtils.clearDirent('package-lock.json');
        FileSystemUtils.clearDirent('pnpm-lock.yaml');

        break;
        
      case CleanTaskScopes.DRAFT:
        FileSystemUtils.clearDirent(draftPathRelative);

        break;
    }

    console.log(
      TaskMessages.preset.CLEAN_STATUS_SUCCESS
    );
  } catch (err) {
    throw new TaskWorkerException(
      TaskMessages.templated.STATUS_ERROR(
        'protoreaction',
        Tasks.CLEAN,
        `${err.name}: ${err.message}`
      ),
      Tasks.CLEAN
    );
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
  repoUrl,
  workDir
) {
  console.log(`Running task: ${Tasks.CREATE}...`);

  console.log(`Copying contents, of: ./${templatePathRelative}, to: ./${draftPathRelative}...`);
  console.log(`Checking contents of: ./${templatePathRelative}...`);

  const projTemplateRootPackageJsonFilePath = FileSystemUtils.findFilePathsByNameInDirectoryTree(
      `${templatePathRelative}/${packageJsonFileName}`,
      __dirname,
      3,
      1
    )[0];

  if (!CommonUtils.isNonEmptyString(projTemplateRootPackageJsonFilePath, true)) {
    throw new TaskWorkerException(
      TaskMessages.templated.STATUS_ERROR(
        'protoreaction',
        Tasks.CREATE,
        `No ${packageJsonFileName} file found in path: ./${templatePathRelative}/${packageJsonFileName}`
      ),
      Tasks.CREATE
    );
  }

  const contextPathAbsolute = projTemplateRootPackageJsonFilePath.replace(`/${templatePathRelative}/${packageJsonFileName}`, '');
  const templatePathAbsolute = projTemplateRootPackageJsonFilePath.replace(`/${packageJsonFileName}`, '');

  const projTemplateWorkspacePreactPackageJsonFilePath = `${templatePathAbsolute}/${workspacePaths.PREACT}/${packageJsonFileName}`;

  if (!CommonUtils.isNonEmptyString(projTemplateWorkspacePreactPackageJsonFilePath, true)) {
    throw new TaskWorkerException(
      TaskMessages.templated.STATUS_ERROR(
        'protoreaction',
        Tasks.CREATE,
        `No ${packageJsonFileName} file found in path: ./${templatePathRelative}/${workspacePaths.PREACT}`
      ),
      Tasks.CREATE
    );
  }

  const projTemplateWorkspaceReactPackageJsonFilePath = `${templatePathAbsolute}/${workspacePaths.REACT}/${packageJsonFileName}`;

  if (!CommonUtils.isNonEmptyString(projTemplateWorkspaceReactPackageJsonFilePath, true)) {
    throw new TaskWorkerException(
      TaskMessages.templated.STATUS_ERROR(
        'protoreaction',
        Tasks.CREATE,
        `No ${packageJsonFileName} file found in path: ./${templatePathRelative}/${workspacePaths.REACT}`
      ),
      Tasks.CREATE
    );
  }

  const osTmpDir = os.tmpdir();
  let draftPathAbsolute = `${contextPathAbsolute}/${draftPathRelative}`;
  let tmpDraftPathAbsolute;

  try {
    tmpDraftPathAbsolute = fs.mkdtempSync(`${osTmpDir}/protoreaction-`);
    fs.mkdirSync(`${tmpDraftPathAbsolute}/${draftPathRelative}`);
    draftPathAbsolute = `${tmpDraftPathAbsolute}/${draftPathRelative}`;
  } catch (err) {
    console.warn(`Could not write the draft directory to the operating system's temporary directory, at: ${osTmpDir}`);
    console.warn(`Falling back, to the project's internal draft directory, at: ./${draftPathRelative}...`);
    console.warn(`Reason: ${err.name}: ${err.message}`);
  }

  try {
    FileSystemUtils.copyDirectoryTree(
        templatePathAbsolute,
        draftPathAbsolute,
        true,
        true
      );
  } catch (err) {
    throw new TaskWorkerException(
      TaskMessages.templated.STATUS_ERROR(
        'protoreaction',
        Tasks.CREATE,
        `${err.name}: ${err.message}`
      ),
      Tasks.CREATE
    );
  }

  console.log(`Confirming copy of contents, to: ./${draftPathRelative}`);

  const projDraftRootPackageJsonFilePath = `${draftPathAbsolute}/${packageJsonFileName}`;

  if (!CommonUtils.isNonEmptyString(projDraftRootPackageJsonFilePath, true)) {
     performPostDraftCleanup(
      draftPathAbsolute,
      tmpDraftPathAbsolute,
      {
        text: 'An error was encountered',
        type: 'error'
      }
    );
 
    throw new TaskWorkerException(
      TaskMessages.templated.STATUS_ERROR(
        'protoreaction',
        Tasks.CREATE,
        `No ${packageJsonFileName} file found in path: ./${draftPathRelative}/${packageJsonFileName}`
      ),
      Tasks.CREATE
    );
  }

  const projDraftWorkspacePreactPackageJsonFilePath = `${draftPathAbsolute}/${workspacePaths.PREACT}/${packageJsonFileName}`;

  if (!CommonUtils.isNonEmptyString(projDraftWorkspacePreactPackageJsonFilePath, true)) {
    performPostDraftCleanup(
      draftPathAbsolute,
      tmpDraftPathAbsolute,
      {
        text: 'An error was encountered',
        type: 'error'
      }
    );

    throw new TaskWorkerException(
      TaskMessages.templated.STATUS_ERROR(
        'protoreaction',
        Tasks.CREATE,
        `No ${packageJsonFileName} file found in path: ./${draftPathRelative}/${workspacePaths.PREACT}`
      ),
      Tasks.CREATE
    );
  }

  const projDraftWorkspaceReactPackageJsonFilePath = `${draftPathAbsolute}/${workspacePaths.REACT}/${packageJsonFileName}`;

  if (!CommonUtils.isNonEmptyString(projDraftWorkspaceReactPackageJsonFilePath, true)) {
    performPostDraftCleanup(
      draftPathAbsolute,
      tmpDraftPathAbsolute,
      {
        text: 'An error was encountered',
        type: 'error'
      }
    );

    throw new TaskWorkerException(
      TaskMessages.templated.STATUS_ERROR(
        'protoreaction',
        Tasks.CREATE,
        `No ${packageJsonFileName} file found in path: ./${draftPathRelative}/${workspacePaths.REACT}`
      ),
      Tasks.CREATE
    );
  }

  let projDraftRootPackageJson;
  let projDraftWorkspacePreactPackageJson;
  let projDraftWorkspaceReactPackageJson;

  try {
    projDraftRootPackageJson = require(projDraftRootPackageJsonFilePath);
  } catch (err) {
    performPostDraftCleanup(
      draftPathAbsolute,
      tmpDraftPathAbsolute,
      {
        text: 'An error was encountered',
        type: 'error'
      }
    );

    throw new TaskWorkerException(
      TaskMessages.templated.STATUS_ERROR(
        'protoreaction',
        Tasks.CREATE,
        `${err.name}: ${err.message}`
      ),
      Tasks.CREATE
    );
  }

  try {
    projDraftWorkspacePreactPackageJson = require(projDraftWorkspacePreactPackageJsonFilePath);
  } catch (err) {
    performPostDraftCleanup(
      draftPathAbsolute,
      tmpDraftPathAbsolute,
      {
        text: 'An error was encountered',
        type: 'error'
      }
    );

    throw new TaskWorkerException(
      TaskMessages.templated.STATUS_ERROR(
        'protoreaction',
        Tasks.CREATE,
        `${err.name}: ${err.message}`
      ),
      Tasks.CREATE
    );
  }

  try {
    projDraftWorkspaceReactPackageJson = require(projDraftWorkspaceReactPackageJsonFilePath);
  } catch (err) {
    performPostDraftCleanup(
      draftPathAbsolute,
      tmpDraftPathAbsolute,
      {
        text: 'An error was encountered',
        type: 'error'
      }
    );

    throw new TaskWorkerException(
      TaskMessages.templated.STATUS_ERROR(
        'protoreaction',
        Tasks.CREATE,
        `${err.name}: ${err.message}`
      ),
      Tasks.CREATE
    );
  }

  delete projDraftRootPackageJson.author;
  delete projDraftRootPackageJson.homepage;
  delete projDraftRootPackageJson.license;
  delete projDraftRootPackageJson.repository;

  delete projDraftWorkspacePreactPackageJson.author;
  delete projDraftWorkspacePreactPackageJson.homepage;
  delete projDraftWorkspacePreactPackageJson.license;
  delete projDraftWorkspacePreactPackageJson.repository;

  delete projDraftWorkspaceReactPackageJson.author;
  delete projDraftWorkspaceReactPackageJson.homepage;
  delete projDraftWorkspaceReactPackageJson.license;
  delete projDraftWorkspaceReactPackageJson.repository;

  projDraftRootPackageJson.name = appName;
  projDraftWorkspacePreactPackageJson.name = `${appName}-${workspaces.PREACT}`;
  projDraftWorkspaceReactPackageJson.name = `${appName}-${workspaces.REACT}`;

  if (CommonUtils.isNonEmptyString(appVersion, true)) {
    projDraftRootPackageJson.version = appVersion;
    projDraftWorkspacePreactPackageJson.version = appVersion;
    projDraftWorkspaceReactPackageJson.version = appVersion;
  } else {
    projDraftRootPackageJson.version = '0.1.0';
    projDraftWorkspacePreactPackageJson.version = '0.1.0';
    projDraftWorkspaceReactPackageJson.version = '0.1.0';
  }

  const defaultDescription = 'Built using protoreaction, by Antonio Malcolm';

  projDraftRootPackageJson.description = defaultDescription;
  projDraftWorkspacePreactPackageJson.description = defaultDescription;
  projDraftWorkspaceReactPackageJson.description = defaultDescription;

  if (CommonUtils.isNonEmptyString(authorName, true)) {
    let author = authorName;

    if (CommonUtils.isNonEmptyString(authorEmail, true)) {
      author = {
        name: authorName,
        email: authorEmail
      };
    }

    if (CommonUtils.isAssignedNotNull(authorUrl, true)) {
      if (CommonUtils.isNonEmptyObject(author)) {
        author.url = authorUrl;
      } else {
        author = {
          name: authorName,
          url: authorUrl
        };
      }
    }

    projDraftRootPackageJson.author = author;
    projDraftWorkspacePreactPackageJson.author = author;
    projDraftWorkspaceReactPackageJson.author = author;
  }

  if (CommonUtils.isNonEmptyString(homepage, true)) {
    projDraftRootPackageJson.homepage = homepage;
    projDraftWorkspacePreactPackageJson.homepage = homepage;
    projDraftWorkspaceReactPackageJson.homepage = homepage;
  }

  if (CommonUtils.isNonEmptyString(license, true)) {
    projDraftRootPackageJson.license = license;
    projDraftWorkspacePreactPackageJson.license = license;
    projDraftWorkspaceReactPackageJson.license = license;
  }

  if (CommonUtils.isNonEmptyString(repoUrl, true)) {
    let repository = { url: repoUrl };

    if (CommonUtils.isNonEmptyString(repoType, true)) {
      repository.type = repoType;
    }

    projDraftRootPackageJson.repository = repository;

    projDraftWorkspacePreactPackageJson.repository = {
        ...repository,
        directory: workspacePaths.PREACT
      };

    projDraftWorkspaceReactPackageJson.repository = {
        ...repository,
        directory: workspacePaths.REACT
      };
  }

  console.log(
    `Updating ${packageJsonFileName} files, for project ${appName},`
    + ` in draft directories: ./${draftPathRelative} and: ./${draftPathRelative}/workspaces`
  );

  try {
    fs.writeFileSync(
        projDraftRootPackageJsonFilePath,
        JSON.stringify(
          projDraftRootPackageJson,
          null,
          2
        ).concat('\n')
      );

    fs.writeFileSync(
        projDraftWorkspacePreactPackageJsonFilePath,
        JSON.stringify(
          projDraftWorkspacePreactPackageJson,
          null,
          2
        ).concat('\n')
      );

    fs.writeFileSync(
        projDraftWorkspaceReactPackageJsonFilePath,
        JSON.stringify(
          projDraftWorkspaceReactPackageJson,
          null,
          2
        ).concat('\n')
      );
  } catch (err) {
    performPostDraftCleanup(
      draftPathAbsolute,
      tmpDraftPathAbsolute,
      {
        text: 'An error was encountered',
        type: 'error'
      }
    );

    throw new TaskWorkerException(
      TaskMessages.templated.STATUS_ERROR(
        'protoreaction',
        Tasks.CREATE,
        `${err.name}: ${err.message}`
      ),
      Tasks.CREATE
    );
  }

  console.log(`Writing new project: ${appName}, to ${workDir}/${appName}...`);

  try {
    FileSystemUtils.copyDirectoryTree(
        draftPathAbsolute,
        `${workDir}/${appName}`,
        true,
        true
      );
  } catch (err) {
    throw new TaskWorkerException(
      TaskMessages.templated.STATUS_ERROR(
        'protoreaction',
        Tasks.CREATE,
        `${err.name}: ${err.message}`
      ),
      Tasks.CREATE
    );
  } finally {
    performPostDraftCleanup(
      draftPathAbsolute,
      tmpDraftPathAbsolute
    );
  }
};

module.exports = Object.freeze({
  clean,
  createApp
});
