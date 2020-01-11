REM drop all existing data
call mongo ds237669.mlab.com:37669/model-editor -u %1 -p %2 drop-data.js


REM import all of the data files
cd ./data/common
call import-data-mlab.bat %1 %2
cd ../40k-admech
call import-data-mlab.bat %1 %2
cd ../40k-admil
call import-data-mlab.bat %1 %2
cd ../40k-astartes
call import-data-mlab.bat %1 %2
cd ../40k-dguard
call import-data-mlab.bat %1 %2
cd ../40k-gcult
call import-data-mlab.bat %1 %2
cd ../40k-necronskw
call import-data-mlab.bat %1 %2
cd ../40k-orks
call import-data-mlab.bat %1 %2
cd ../40k-tsons
call import-data-mlab.bat %1 %2
cd ../40k-tyranids
call import-data-mlab.bat %1 %2
cd ../aos-stormcast
call import-data-mlab.bat %1 %2

REM return to the main directory
cd ../..

