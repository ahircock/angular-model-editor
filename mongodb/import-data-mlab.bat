REM drop all existing data
call mongo ds237669.mlab.com:37669/model-editor -u %1 -p %2 drop-data.js


REM import all of the data files
cd ./data
call import-data-local.bat
cd ./40k-admech %1 %2
call import-data-local.bat
cd ../40k-admil %1 %2
call import-data-local.bat
cd ../40k-astartes %1 %2
call import-data-local.bat
cd ../40k-dguard %1 %2
call import-data-local.bat
cd ../40k-gcult %1 %2
call import-data-local.bat
cd ../40k-necrons %1 %2
call import-data-local.bat
cd ../40k-orks %1 %2
call import-data-local.bat
cd ../40k-tyranids %1 %2
call import-data-local.bat

REM return to the main directory
cd ../..

