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
const path = require('path');

const CommonUtils = require('./CommonUtils');

const clearDirent = function(dirent, shouldRemove) {
  if (shouldRemove !== true) {
    shouldRemove = false;
  }

  if (fs.existsSync(dirent)) {
    if (fs.statSync(dirent).isDirectory()) {
      if (shouldRemove) {
        fs.rmSync(
            dirent,
            { force: true, recursive: true }
          );
      } else {
        fs.readdirSync(dirent).forEach((childDirent) => {
          fs.rmSync(
              `${dirent}/${childDirent}`,
              { force: true, recursive: true }
            );
        });
      }
    } else {
      fs.rmSync(
          dirent,
          { force: true, recursive: true }
        );
    }
  }
};

const copyDirectoryTree = function(src, dest, shouldMakeDestIfNotFound, shouldReplaceDestIfFound) {
  if (shouldMakeDestIfNotFound !== true) {
    shouldMakeDestIfNotFound = false;
  }

  if (shouldReplaceDestIfFound !== true) {
    shouldReplaceDestIfFound = false;
  }

  const copyDirTree = (src, dest) => {
    if (fs.statSync(src).isDirectory(src)) {
      let fsDirents = fs.readdirSync(
        src,
        { withFileTypes: true }
      );

      fsDirents.forEach((dirent) => {
        let currSrc = path.join(src, dirent.name);
        let currDest = path.join(dest, dirent.name);

        if (dirent.isDirectory()) {
          if (!fs.existsSync(currDest)) {
            fs.mkdirSync(currDest);
          }

          copyDirTree(currSrc, currDest);
        } else {
          fs.copyFileSync(currSrc, currDest);
        }
      });
    }
  };

  if (shouldReplaceDestIfFound) {
    if (fs.existsSync(dest) && fs.statSync(dest).isDirectory()) {
      fs.rmSync(
          dest,
          { force: true, recursive: true }
        );

      fs.mkdirSync(dest);
    }
  }

  if (shouldMakeDestIfNotFound || shouldReplaceDestIfFound) {
    if (!(fs.existsSync(dest) && fs.statSync(dest).isDirectory())) {
      fs.mkdirSync(dest);
    }
  }

  copyDirTree(src, dest);
};

const findFilePathsByNameInDirectoryTree = function(fileName, dirPath, depth, limit) {
  const filePaths = [];

  if (!CommonUtils.isNonEmptyString(fileName, true)) {
    return filePaths;
  }

  if (!CommonUtils.isNonEmptyString(dirPath, true)) {
    dirPath = path.dirname(require.main.filename);
  }

  /**
   * Setting depth to -1 means no limit to parent directory tree traversal.
   * Setting limit to -1 means no limit to found results.
   */

  if (!CommonUtils.isAssignedNotNull(depth)) {
    depth = -1;
  }

  if (!CommonUtils.isAssignedNotNull(limit)) {
    limit = -1;
  }

  let currDepth = 0;

  const findFilePathsByNameInDirTree = (fileName, dirPath, depth, limit) => {
    currDepth++;

    const filePath = path.resolve(dirPath, fileName);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      filePaths.push(filePath);

      if (limit > 0) {
        limit--;
      }
    }

    if (depth > -1) {
      if (currDepth === depth) {
        return;
      }
    }

    if (limit === 0) {
      return;
    }

    const parentDirPath = path.resolve(dirPath, '..');

    if (parentDirPath !== dirPath) {
      findFilePathsByNameInDirTree(fileName, parentDirPath, depth, limit);
    }
  }

  findFilePathsByNameInDirTree(fileName, dirPath, depth, limit);

  return filePaths;
};

module.exports = Object.freeze({
  clearDirent,
  copyDirectoryTree,
  findFilePathsByNameInDirectoryTree
});
