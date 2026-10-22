@echo off
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot"
set "PATH=%JAVA_HOME%\bin;%PATH%"
npx -y firebase-tools emulators:exec --only firestore "npx tsx tests/firestore-rules.test.ts"
