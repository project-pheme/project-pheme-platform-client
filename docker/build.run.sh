#!/bin/bash

set -e

SRC_PATH=${SRC_PATH:-/vols/src}
OUT_PATH=${OUT_PATH:-/vols/out}

# Ensure volume with source code is present
check_vols_src() {
  if [ ! -d ${SRC_PATH} ]; then
    echo "No ${SRC_PATH} with code"
    exit 1
  fi
}

# Ensure volume where we write the build result is present
check_vols_out() {
  if [ ! -d ${OUT_PATH} ]; then
    echo "No ${OUT_PATH} for output!"
    exit 1
  fi
}

# Sync from source code to the build directory, exclude any folders and file
# that are result of the build process
function sync {
  check_vols_src
  {
    echo "- .git"
    echo "- .bin"
    echo "- node_modules"
    echo "- tmp"
  } > /tmp/rsync_exclude
  rsync -ar --exclude-from=/tmp/rsync_exclude --delete-during ${SRC_PATH}/ ./
}

# Build the client
build() {
  npm install
  gulp i18n
  gulp build
  cp ./server/rewrite.htaccess ./server/www/
}

# Bundle the build into a tarball
bundle() {
  check_vols_out
  local version=${GITHUB_VERSION:-${CI_BRANCH:-v0.0.0}}
  gulp release --version-suffix=${version} --dest-dir=${OUT_PATH}
}

watch() {
  exec gulp watch
}

case "$1" in
  *)
    sync
    build
    bundle
    ;;
esac
