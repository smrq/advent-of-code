@echo off

for /F %%G in ('type %1') do set session=%%G
for /F %%G in ("%~dp2.") do set year=%%~nG
for /F "tokens=* delims=0" %%G in ("%~n2") do set day=%%G
set outfile=%2

curl -H Cookie:session=%session% https://adventofcode.com/%year%/day/%day%/input > "%outfile%"
