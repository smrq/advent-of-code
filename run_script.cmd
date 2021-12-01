@echo off

for /F %%G in ('node "%1"') do set out=%%G
echo %out%
echo %out% | clip
