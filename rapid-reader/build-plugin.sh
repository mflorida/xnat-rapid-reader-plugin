#!/usr/bin/env bash

# This little helper script will run after the React build
# to copy the compiled React app to the proper folder for
# usage as part of the XNAT plugin.

BUILD_DIR=./build
PLUGIN_DIR=../src/main/resources/META-INF/resources/read

# create a new PLUGIN_DIR if necessary
mkdir -p ${PLUGIN_DIR}

# delete old files if PLUGIN_DIR was created previously
rm -rf ${PLUGIN_DIR:?}/*

# copy the compiled React app to the correct folder in the XNAT plugin
cp -rf ${BUILD_DIR}/* ${PLUGIN_DIR}

# make sure we're all executable (may not be necessary but doesn't hurt)
chmod -Rf +x ${PLUGIN_DIR}

# uncomment the line below to skip the XNAT plugin build (useful for development)
#exit;

# run the gradle build
cd ../
./gradlew clean slimJar
cd - || exit
