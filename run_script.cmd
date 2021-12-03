@echo off

for /F "tokens=*" %%G in ('node %1') do (
	echo %%G
	set line=%%G
)
echo %line% | clip
