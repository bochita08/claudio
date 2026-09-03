# PROP+

[![CI](https://github.com/bochita08/claudio/actions/workflows/ci.yml/badge.svg)](https://github.com/bochita08/claudio/actions/workflows/ci.yml)
[![E2E Android](https://github.com/bochita08/claudio/actions/workflows/e2e-android.yml/badge.svg)](https://github.com/bochita08/claudio/actions/workflows/e2e-android.yml)

App mobile de prueba hecha con **Expo SDK 54 + React Native 0.81 + TypeScript**.
Incluye autenticacion (mock), listado de propiedades con filtros, mapa con
OpenStreetMap, detalle con carta de agente, panel de estadisticas y edicion de
perfil. Todos los formularios tienen validaciones con mensaje de error debajo de
cada input.

## Requisitos

- **Node.js 18 o superior** — https://nodejs.org (instalar el LTS: Next / Next / Finish)
- Para verlo en el celular: la app **Expo Go** (Play Store / App Store)
- Para verlo en la compu: **Android Studio** (ver Opción B)

---

## Opción A — en tu celular (lo más rápido)

```bash
npm install
npm start
```

Aparece un QR en la terminal:

- **Android**: abrí **Expo Go** → *Scan QR code* → escaneá.
- **iPhone**: abrí la **cámara** → apuntá al QR → tocá la notificación.

> El celu y la PC tienen que estar en la **misma red WiFi**. Si no anda:
> `npx expo start --tunnel` (más lento, funciona en cualquier red).

---

## Opción B — en un emulador de Android (paso a paso, sin saber nada de Android Studio)

### B1. Instalar Android Studio

1. Descargá de **https://developer.android.com/studio** e instalá con todo por defecto.
2. La primera vez que abre aparece un **Setup Wizard**: elegí **Standard** → Next → Finish.
   Descarga el SDK de Android (varios GB, tarda). Dejalo terminar.

### B2. Crear un teléfono virtual

1. En la ventana de bienvenida: **More Actions → Virtual Device Manager**.
   (si tenés un proyecto abierto: menú **Tools → Device Manager**)
2. Botón **Create device** (o el `+`).
3. Elegí **Pixel 7** (o cualquier "Pixel") → **Next**.
4. En **System Image**: elegí una fila que diga **API 34** o **35**. Si tiene un
   ícono de descarga **⬇** al lado, hacé clic ahí y esperá que baje → **Next**.
5. **Finish**.

### B3. Arrancar el emulador

1. En el Device Manager, al lado de tu teléfono, hacé clic en el **▶ (play)**.
2. Esperá 1–2 min hasta ver la **pantalla de inicio de Android** (como un celu prendido).
3. **Dejá esa ventana abierta.**

### B4. Dejar `adb` accesible (una sola vez)

`adb` habla con el emulador. Viene con Android Studio pero no está en el PATH.
Agregalo — en **PowerShell**:

```powershell
[Environment]::SetEnvironmentVariable('Path', [Environment]::GetEnvironmentVariable('Path','User') + ";$env:LOCALAPPDATA\Android\Sdk\platform-tools", 'User')
```

**Cerrá y reabrí la terminal.** Probá:

```bash
adb devices
```

Tiene que aparecer `emulator-5554   device`. Si sale eso, seguí.

> Si no querés tocar el PATH: en los comandos de abajo reemplazá `adb` por
> `"$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"`.

### B5. Correr la app

En la terminal, dentro de la carpeta del proyecto:

```bash
npm install
npm start
```

Cuando dice *"Waiting on http://localhost:8081"*, **apretá la tecla `a`** en esa
misma terminal.

- Instala **Expo Go** en el emulador solo.
- Si pregunta *"Expo Go X.X.X is recommended... Install?"* → escribí **`Y`** + Enter.
- Abre la app. La primera vez tarda ~1 min; después recarga sola al guardar.

### B6. Si la tecla `a` se cuelga o no hace nada

Con el emulador y `npm start` abiertos, en **otra** terminal:

```bash
adb reverse tcp:8081 tcp:8081
adb shell am start -a android.intent.action.VIEW -d "exp://10.0.2.2:8081" host.exp.exponent
```

(asume que Expo Go ya está en el emulador; si no, corré `npm run android` una vez
o instalálo desde la Play Store del emulador buscando "Expo Go")

### Errores comunes

| Qué ves | Qué hacer |
|---|---|
| `adb : El término 'adb' no se reconoce` | Hacé el paso **B4** y reabrí la terminal |
| `adb devices` no lista nada | El emulador no terminó de arrancar → esperá. Si sigue, reinicialo desde el Device Manager |
| Emulador en pantalla negra mucho rato | Cerralo y abrilo de nuevo. Si insiste: Device Manager → flecha `▾` → **Wipe Data** |
| `Something went wrong` en Expo Go | Metro se cortó o se perdió el `adb reverse` → `npm start` + `adb reverse tcp:8081 tcp:8081` |
| El QR del celu no funciona | Otra red → usá el emulador, o `npx expo start --tunnel` |
| Avisos de versión de paquetes | `npx expo install --fix` |

### Ubicación GPS en el emulador (para el mapa)

El botón "mi ubicación" del mapa necesita una posición fija:

- Android Studio → en el emulador, barra lateral → **`...` (Extended controls) → Location**
  → poné un punto → **Set Location**.
- O por consola: `adb emu geo fix -58.3816 -34.6037` (Buenos Aires).

---

## Opción C — en el navegador

```bash
npm run web
```

Abre `http://localhost:8081`. Sirve para revisar flujos y validaciones rápido
(el mapa puede verse distinto que en móvil).

## Cuenta demo

```
email:    demo@propplus.com
password: Demo1234
```

Tambien podes crear una cuenta nueva desde "Crear cuenta". Los usuarios se
guardan en el dispositivo con AsyncStorage.

## Pantallas

| Pantalla | Que hace |
|---|---|
| Iniciar sesion | Email + contrasena. Valida formato de email y contrasena requerida. Mensaje de error de credenciales. |
| Crear cuenta | Nombre y apellido (solo letras), email (con @ y dominio), telefono (solo numeros 7-15 digitos), contrasena fuerte y confirmacion. Error debajo de cada input. |
| Recuperar contrasena | Valida email. Muestra mensaje de exito sin revelar si el email existe. |
| Propiedades | 5 cartas, cada una con carrusel de 3 fotos, direccion, precio, tags (dormitorios, banos, m2) y un **corazon para marcar favorito**. Filtro por tipo, orden por precio / m2 / dormitorios / banos, y un toggle "Favoritos" para ver solo los guardados. |
| Detalle | Carrusel, precio, caracteristicas, descripcion expandible, comodidades, mini mapa, **boton de favorito** (corazon flotante + boton "Agregar / Quitar de favoritos") y **carta del agente** (telefono + email, botones Llamar / Enviar email). |
| Mapa | OpenStreetMap con un pin de casa por propiedad. Al tocarlo se abre una carta con el resumen, corazon de favorito y boton "Ver detalle". Pide permiso de ubicacion (con mensaje si se niega). |
| Estadisticas | Propiedades vistas, **favoritos (contador real)**, busquedas, agentes contactados, presupuesto promedio, **lista "Tus favoritos"** (tocable para ir al detalle), grafico de vistas por mes y distribucion por tipo. |
| Perfil | Foto circular (o iniciales), bienvenida con nombre, email, ID y fecha de registro. Botones "Editar informacion" y "Cerrar sesion". |
| Ajustes | Mismos campos y validaciones que el registro. El boton **Guardar** arranca bloqueado y se habilita solo al modificar algo. Mensaje de exito al guardar y de error debajo de los inputs. |

## Estructura

```
src/
  components/     UI reutilizable (FormInput, Button, Banner, ImageCarousel, LeafletMap, ...)
  context/        AuthContext (sesion, login, registro, update de perfil)
  data/           Datos mock: propiedades, agentes, usuario demo
  hooks/          useForm (valores, touched, submit, errores)
  i18n/           Todos los textos en espanol, centralizados
  navigation/     Stacks de auth + tabs de la app
  screens/        Pantallas
  services/       Capa de datos (hoy mock + AsyncStorage, lista para enchufar API)
  theme/          Colores, spacing, tipografia
  utils/          validation.ts (todas las validaciones), format.ts
```

## Validaciones (resumen)

- **Nombre / Apellido**: obligatorio, solo letras (acentos y enie permitidos), 2 a 40 caracteres. El input filtra caracteres no validos mientras escribis.
- **Email**: obligatorio, sin espacios, debe tener `@`, dominio con punto y formato general valido.
- **Telefono**: obligatorio, **solo numeros**, entre 7 y 15 digitos. El input no deja escribir letras.
- **Contrasena** (registro / ajustes): minimo 8 caracteres, una mayuscula, una minuscula y un numero.
- **Confirmar contrasena**: debe coincidir.
- **Login**: email valido + contrasena no vacia (no se revela la politica).

## Mapa: cambiar a Google Maps (opcional)

El proyecto usa **OpenStreetMap** dentro de un WebView (`src/components/LeafletMap.tsx`):
gratis, sin API key, funciona en Expo Go.

Si mas adelante queres Google Maps:

1. `npx expo install react-native-maps`
2. En `app.json`, dentro de `expo`, agrega:
   ```json
   "ios":     { "config": { "googleMapsApiKey": "TU_API_KEY" } },
   "android": { "config": { "googleMaps": { "apiKey": "TU_API_KEY" } } }
   ```
3. En Google Cloud Console (proyecto con billing activado) habilita
   **Maps SDK for Android** y **Maps SDK for iOS**, crea una **API key** y
   restringela por API y por package `com.propplus.app`.
4. Reescribe `MapScreen` / el preview del detalle usando `<MapView>` de `react-native-maps`.
5. Google Maps con provider propio necesita un **development build**
   (`npx expo run:android`), no corre en Expo Go.

> Nota: mostrar el mapa en el SDK nativo movil de Google no tiene costo por uso,
> pero Google igual exige una tarjeta cargada para activar la key.

## CI / GitHub Actions

| Workflow | Archivo | Cuándo corre | Qué hace |
|---|---|---|---|
| **CI** | `.github/workflows/ci.yml` | cada push a `master` y cada PR | `npm ci` + `tsc --noEmit` + `expo-doctor` + `expo export` (bundle) |
| **E2E Android** | `.github/workflows/e2e-android.yml` | manual (**Actions → E2E Android → Run workflow**) y lunes 6:00 UTC | levanta un emulador, buildea el APK release, corre los tests Appium del submódulo `e2e/` y sube el reporte Allure como artifact |

Los tests E2E viven en el repo aparte **[propplus-e2e](https://github.com/bochita08/propplus-e2e)**,
incluido acá como submódulo git en `e2e/`. Para clonar con todo:

```bash
git clone --recurse-submodules https://github.com/bochita08/claudio
```

El reporte de la última corrida E2E: **Actions → E2E Android → (última run) → Artifacts → `allure-report`**.

> **Detalle completo de CI/CD, workflows, submódulo y troubleshooting: [`CI.md`](CI.md).**

### Ver el reporte Allure descargado de CI

El artifact `allure-report` es HTML pero **no se abre con doble clic** (Allure
carga los datos con `fetch()` y el navegador lo bloquea en `file://`). Hay que
servir la carpeta:

1. En la corrida → **Artifacts → `allure-report`** → descargar y descomprimir.
2. Servir la carpeta descomprimida (sirve el `index.html` de adentro):

   ```bash
   npx http-server "C:\ruta\allure-report" -o
   ```

   `-o` abre el navegador solo en `http://localhost:8080` (que ya carga
   `index.html`). `Ctrl+C` para cerrar el server.

   Alternativa sin `http-server`:

   ```bash
   cd "C:\ruta\allure-report"
   python -m http.server 8000
   ```

   y abrís `http://localhost:8000`.

Si en vez de `allure-report` bajaste `e2e-logs` (tiene `allure-results/`):

```bash
npx allure serve "C:\ruta\allure-results"
```

genera y abre el reporte en un solo comando.

## Nota

Es un proyecto de prueba: no hay backend. Los tests E2E están en `propplus-e2e/`.
La capa `src/services/` está escrita como si fuera un cliente HTTP (funciones
async, errores tipados, latencia simulada) para que reemplazar el mock por una
API real sea directo.
