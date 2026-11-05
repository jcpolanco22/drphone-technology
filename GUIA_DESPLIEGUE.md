# 🚀 Guía de Despliegue para DrPhone Technology

Esta guía te ayudará a convertir el código de tu sitio web en una página real publicada en internet y conectada a tu dominio.

## 1. Preparar los archivos (El "Build")

Como tu página usa **React**, los navegadores no pueden leer el código fuente directamente. Debes generar una carpeta llamada `dist` que contenga la versión optimizada.

> [!TIP]
> He creado un archivo llamado `preparar_para_hosting.bat` en la carpeta raíz. Simplemente hazle **doble clic** y él se encargará de todo. Al finalizar, verás una carpeta llamada `dist`. **Esos son los archivos que debes subir al hosting.**

---

## 2. Dónde subir la página (Hosting)

Tienes tres opciones principales recomendadas:

### Opción A: Netlify o Vercel (Gratis y Profesional) — *RECOMENDADO*
Ideales para React. Son muy rápidos y fáciles de usar.
1. Crea una cuenta en [Netlify](https://www.netlify.com/) o [Vercel](https://vercel.com/).
2. Arrastra la carpeta `dist` directamente a su panel de control.
3. ¡Tu página estará en línea en segundos!

### Opción B: Hostinger / Bluehost / Bluehost (Hosting Tradicional con cPanel)
1. Entra al **Administrador de Archivos** de tu hosting.
2. Ve a la carpeta `public_html`.
3. Sube todo el contenido que está **dentro** de la carpeta `dist`.
4. Asegúrate de que el archivo `.htaccess` también se haya subido.

---

## 3. Conectar tu Dominio

Una vez subida la página, sigue estos pasos en tu proveedor de dominio (donde compraste el nombre):

1. **Si usas Netlify/Vercel**: Ellos te darán unos registros "DNS" (tipo NS). Solo cópialos en la configuración de nombres de tu proveedor de dominio.
2. **Si usas Hosting Tradicional**:
   - Crea un **Registro A** que apunte a la dirección IP de tu servidor.
   - Crea un **Registro CNAME** para `www` que apunte a tu dominio principal.

---

## 4. Notas Importantes

> [!IMPORTANT]
> **Persistencia de Datos**: Actualmente, los productos y configuraciones se guardan en el navegador (localStorage). Esto significa que si editas algo en el admin desde tu PC, no se verá en otros PCs automáticamente. 
> 
> Si deseas sincronizar los datos de forma global y permanente, el siguiente paso sería conectar una base de datos real como **Firebase** o **Supabase**. ¡Dime si quieres que te ayude con eso!

---

¡Felicidades! Tu negocio **DrPhone Technology** está listo para conquistar el mercado digital. 📱✨
