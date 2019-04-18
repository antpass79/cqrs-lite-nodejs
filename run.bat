@ECHO GO TO DASHBOARD FOLDER
@ECHO.

@CD ./dashboard

@REM ###################################################################

@ECHO DOWNLOADING DASHBOARD PACKAGES...
@ECHO.

@CALL npm install
IF %ERRORLEVEL% NEQ 0 (
    ECHO "install dashboard error"
    EXIT /B 1
)

@ECHO DASHBOARD PACKAGES DOWNLOADED
@ECHO.

@REM ###################################################################

@ECHO BUILDING DASHBOARD BUNDLE...
@ECHO.

@CALL npm run build
IF %ERRORLEVEL% NEQ 0 (
    ECHO "build dashboard bundle error"
    EXIT /B 1
)

@ECHO DASHBOARD BUNDLE BUILT...
@ECHO.

@REM ###################################################################

@ECHO GO TO ROOT FOLDER
@ECHO.

@CD ..

@REM ###################################################################

@ECHO BUILDING IMAGES...
@ECHO.

@CALL docker-compose build
IF %ERRORLEVEL% NEQ 0 (
    ECHO "build images error"
    EXIT /B 1
)

@ECHO IMAGES BUILT...
@ECHO.

REM @REM ###################################################################

REM @ECHO BUILDING DASHBOARD IMAGE...
REM @ECHO.

REM @CALL docker build -t dashboard .
REM IF %ERRORLEVEL% NEQ 0 (
REM     ECHO "build dashboard image error"
REM     EXIT /B 1
REM )

REM @ECHO DASHBOARD IMAGE BUILT...
REM @ECHO.
