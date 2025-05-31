
# FitTracker Pro - Mobil Telepítés

## Előfeltételek

- Node.js (14+)
- Git
- Android Studio (Android fejlesztéshez)
- Xcode (iOS fejlesztéshez, csak macOS-en)

## Telepítési lépések

### 1. Projekt exportálás GitHub-ra
1. Kattints a "GitHub" gombra a Lovable felületén
2. Exportáld a projektet a saját GitHub repódba

### 2. Helyi fejlesztési környezet beállítása
```bash
# Repo klónozása
git clone [YOUR_GITHUB_REPO_URL]
cd track-n-thrive-app

# Függőségek telepítése
npm install

# iOS platform hozzáadása (csak macOS-en)
npx cap add ios

# Android platform hozzáadása
npx cap add android
```

### 3. Google OAuth beállítása

#### Google Cloud Console beállítása:
1. Menj a [Google Cloud Console](https://console.cloud.google.com/)-ra
2. Hozz létre új projektet vagy válassz egy meglévőt
3. Engedélyezd a Google Sheets API-t
4. Hozz létre OAuth 2.0 kliens azonosítókat:
   - Web alkalmazáshoz
   - Android alkalmazáshoz (ha szükséges)
   - iOS alkalmazáshoz (ha szükséges)

#### Konfigurációs fájlok frissítése:
1. Cseréld ki `YOUR_GOOGLE_CLIENT_ID`-t a valódi Client ID-re a következő fájlokban:
   - `capacitor.config.ts`
   - `src/services/googleAuthService.ts`

### 4. Build és szinkronizálás
```bash
# Projekt buildelése
npm run build

# Natív platformok frissítése
npx cap update ios    # iOS-hez
npx cap update android # Android-hez

# Szinkronizálás
npx cap sync
```

### 5. Futtatás

#### Android-on:
```bash
npx cap run android
```

#### iOS-en (csak macOS):
```bash
npx cap run ios
```

## Fontos megjegyzések

- Az iOS fejlesztéshez macOS és Xcode szükséges
- Android fejlesztéshez Android Studio telepítése szükséges
- A Google OAuth csak HTTPS-en működik, ezért használd a Capacitor live reload funkciót fejlesztés során
- A Google Sheets API kulcsokat soha ne add hozzá a verziókezeléshez

## Hibaelhárítás

Ha problémákat tapasztalsz:
1. Ellenőrizd, hogy minden függőség telepítve van
2. Győződj meg róla, hogy a Google Cloud OAuth beállítások helyesek
3. Használd a `npx cap doctor` parancsot a környezet ellenőrzésére
