@echo off
echo ====================================================
echo   HERRAMIENTA DE PREPARACION - DRPHONE TECHNOLOGY
echo ====================================================
echo.
echo 1. Generando archivos optimizados para el hosting...
echo.

call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Hubo un problema al generar los archivos. 
    echo Asegurate de tener Node.js instalado correctamente.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo 2. ¡Exito! Tu pagina ha sido compilada.
echo.
echo ====================================================
echo   INSTRUCCIONES FINALES:
echo ====================================================
echo 1. Se abrira la carpeta "dist".
echo 2. Sube TODO el contenido de esa carpeta a tu hosting.
echo 3. Consulta el archivo GUIA_DESPLIEGUE.md para mas detalles.
echo ====================================================
echo.

explorer dist
pause

