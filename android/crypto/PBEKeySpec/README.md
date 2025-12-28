# 🔐 PBKDF2 Parameter Extraction Hook

This script targets the **Java Cryptography Architecture (JCA)** to intercept secrets used in Password-Based Key Derivation Functions (PBKDF2).

## 🎯 Purpose
Developers often obfuscate salts and API keys in the app's source code. However, these values must be restored to plain text before being passed to the Android system's crypto libraries. This script hooks the `PBEKeySpec` constructor to capture these values right before they are used.

## 🛠️ Technical Details
* **Class Hooked:** `javax.crypto.spec.PBEKeySpec`
* **Method:** Constructor (`$init`)
* **Signature:** `(char[] password, byte[] salt, int iterationCount, int keyLength)`

## 🚀 Usage

1. **Start Frida Server** on your Android device.
2. **Run the script** against your target app:

```bash

frida -U -f <TARGET_PACKAGE_NAME> -l hook_pbe_keyspec.js --no-pause

```

## 📊 Sample Output
When the script successfully hooks the constructor, you will see the extracted secrets in your console:

```text
[*] Hooking PBKDF2 Key Spec to capture Salt & Iterations...

========================================
[+] CRITICAL CRYPTO DATA CAPTURED
========================================
[-] Iterations : 1000
[-] Key Length : 256
[-] Salt (Str) : h@rdC0d3dS@lt
[-] Salt (Arr) : [104, 64, 114, 100, 67, 48, 100, 51, 100, 83, 64, 108, 116]
----------------------------------------
[-] JSON Input : {"user_id":"12345", "role":"admin"}
========================================
