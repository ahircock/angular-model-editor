REM drop all existing data
call mongo model-editor drop-data.js

REM import all of the data files
cd ./data
call import-data-local.bat
cd ./40k-admech
call import-data-local.bat
cd ../40k-admil
call import-data-local.bat
cd ../40k-astartes
call import-data-local.bat
cd ../40k-dguard
call import-data-local.bat
cd ../40k-gcult
call import-data-local.bat
cd ../40k-necrons
call import-data-local.bat
cd ../40k-orks
call import-data-local.bat
cd ../40k-tsons
call import-data-local.bat
cd ../40k-tyranids
call import-data-local.bat

REM return to the main directory
cd ../..

