# CI / GitHub Actions — PROP+

Cómo está armada la integración continua de este proyecto y cómo usarla.

---

## Panorama

Hay **dos repos**:

| Repo | Qué tiene |
|---|---|
| [`bochita08/claudio`](https://github.com/bochita08/claudio) | la app PROP+ (Expo / React Native) |
| [`bochita08/propplus-e2e`](https://github.com/bochita08/propplus-e2e) | los tests E2E (Appium + WebdriverIO) |

`propplus-e2e` está incluido en este repo como **submódulo git** en la carpeta `e2e/`.

Y hay **tres workflows**:

| Workflow | Repo | Archivo | Cuándo corre | Dura |
|---|---|---|---|---|
| **CI** | claudio | `.github/workflows/ci.yml` | push a `master` + todo PR | ~2–4 min |
| **E2E Android** | claudio | `.github/workflows/e2e-android.yml` | manual + lunes 6:00 UTC | ~15–30 min |
| **Typecheck** | propplus-e2e | `.github/workflows/typecheck.yml` | push + PR en ese repo | ~1 min |

---

## Workflow 1 — CI (`ci.yml`)

El chequeo de todos los días. **No necesita emulador ni secrets.**

Corre, en un runner Ubuntu:

1. `npm ci` — instala dependencias con el lockfile
2. `npx tsc --noEmit` — chequeo de tipos de toda la app
3. `npx expo-doctor` — valida versiones de paquetes y config de Expo
4. `npx expo export --platform android` — arma el bundle JS; **si hay un import roto, falla acá**

### Cómo leer el resultado

- En cada PR aparece el check ✓ / ✗ abajo.
- Pestaña **Actions** → **CI** → elegís la corrida → ves cada step.
- El badge del README refleja el estado de `master`:

  ```markdown
  [![CI](https://github.com/bochita08/claudio/actions/workflows/ci.yml/badge.svg)](https://github.com/bochita08/claudio/actions/workflows/ci.yml)
  ```

### Si falla

| Step que falla | Qué mirar |
|---|---|
| `npm ci` | `package-lock.json` desincronizado → corré `npm install` local y commiteá el lock |
| `tsc --noEmit` | error de tipos → el log dice archivo y línea |
| `expo-doctor` | versión de un paquete fuera de rango → `npx expo install --fix` local |
| `expo export` | import que no resuelve, o error de sintaxis en un módulo |

---

## Workflow 2 — E2E Android (`e2e-android.yml`)

El pesado: prueba la app **de verdad**, en un emulador Android, con Appium.

### Triggers

- **Manual**: pestaña **Actions → E2E Android → Run workflow** (botón arriba a la derecha).
- **Programado**: todos los lunes 6:00 UTC.

No corre en cada push (tarda mucho). Si querés que gatee PRs, agregá al `on:`:

```yaml
pull_request:
  types: [labeled]   # y ponés el label "e2e" al PR
```

### Qué hace, paso a paso

1. **Checkout** de `claudio` **con el submódulo** (`submodules: true`) → baja también `e2e/`.
2. `setup-node` 20 + `setup-java` 17 (temurin).
3. **Habilita KVM** en el runner (acelera el emulador).
4. `npm ci` en la raíz (deps de la app).
5. **Buildea el APK release**:
   ```bash
   npx expo prebuild --platform android --no-install
   cd android && ./gradlew assembleRelease --no-daemon -PreactNativeArchitectures=x86_64
   ```
   → `android/app/build/outputs/apk/release/app-release.apk`
   (el bundle JS va adentro del APK, no necesita Metro).
6. `npm ci` dentro de `e2e/` (el driver uiautomator2 viene como dependencia, Appium 3 lo autodetecta).
7. **Levanta el emulador** (`reactivecircus/android-emulator-runner`, API 34, x86_64,
   google_apis) y adentro corre:
   ```bash
   cp ../android/app/build/outputs/apk/release/app-release.apk e2e/appium/apps/propplus.apk
   APPIUM_APP=appium/apps/propplus.apk npm test
   ```
8. Genera el reporte Allure y lo **sube como artifact**.

### Cómo leer el resultado

- **Actions → E2E Android →** la corrida → step "Correr E2E en el emulador":
  ahí se ve la salida narrada (`▸ Toco el botón Ingresar`, `✓ Visible: ...`).
- **Reporte visual**: en esa misma corrida, abajo del todo, **Artifacts →
  `allure-report`** → lo descargás (zip), lo descomprimís y abrís `index.html`.
  Tiene el % de éxito, cada test con sus pasos, y **screenshot automático de los
  que fallaron**.
- Si falla, hay un segundo artifact **`e2e-logs`** con `logs/` y `allure-results/`.

### Modo APK vs Expo Go

Los mismos tests corren de dos formas según la variable `APPIUM_APP`:

| | Local (vos) | CI |
|---|---|---|
| `APPIUM_APP` | sin setear | seteada al `.apk` |
| App objetivo | PROP+ dentro de **Expo Go** | **APK** `com.propplus.app` |
| Necesita Metro | sí (`npx expo start`) | no |
| Cómo abre la app | `mobile: deepLink` a `exp://…` | `mobile: activateApp` |

Esto está en `e2e/wdio.conf.ts` (elige capabilities) y `e2e/shared/app.ts`
(función `abrirApp`).

---

## El submódulo `e2e/`

`propplus-e2e` vive como submódulo. El repo `claudio` guarda **un puntero a un
commit** específico de ese repo (no una copia).

### Clonar el proyecto completo

```bash
git clone --recurse-submodules https://github.com/bochita08/claudio
```

Si ya clonaste sin `--recurse-submodules`:

```bash
git submodule update --init --recursive
```

### Actualizar los tests (cuando cambiás algo en propplus-e2e)

```bash
# 1) commiteás y pusheás en el repo de tests
cd e2e
git add -A && git commit -m "..." && git push

# 2) volvés a claudio y actualizás el puntero
cd ..
git add e2e
git commit -m "bump submodulo e2e"
git push
```

> Si te olvidás del paso 2, CI sigue usando la versión **vieja** de los tests.

### Trabajar dentro de `e2e/`

El submódulo suele quedar en "detached HEAD". Para editarlo:

```bash
cd e2e
git checkout master
# ... editás, commiteás, pusheás normalmente ...
```

---

## Correr los tests localmente (sin CI)

Ver **`e2e/README.md`**. Resumen:

```bash
# T1: emulador (Android Studio o el comando)
# T2: Metro
cd claudio && npx expo start
# T3:
adb reverse tcp:8081 tcp:8081
# T4:
cd claudio/e2e && npm test
cd claudio/e2e && npm run report   # reporte Allure
```

---

## Modificar / agregar workflows

Los archivos están en `.github/workflows/`. Cambios ahí se aplican en el
**siguiente push** (GitHub evalúa el YAML del commit que llega).

Para probar cambios de un workflow sin ensuciar `master`: hacé un PR — CI corre
sobre el PR, y E2E lo podés lanzar a mano eligiendo la rama en "Run workflow".

### Ideas para más adelante

- **Cache del emulador** (`avd-cache` en `android-emulator-runner`) → baja el E2E a ~8 min.
- **Publicar el reporte Allure en GitHub Pages** (con `actions/deploy-pages`) →
  URL fija en vez de descargar el artifact.
- **Lint**: sumar `npx expo lint` como step del CI.
- **EAS Build** en vez de gradle local, si algún día querés un APK firmado de verdad.
