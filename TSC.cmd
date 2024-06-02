@echo off
chcp 65001
pushd %~dp0\react
npm run tsc
popd
