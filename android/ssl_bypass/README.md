# 🔥 Android mTLS & SSL Pinning Bypass (Frida)

A comprehensive Frida script designed to bypass **Mutual TLS (mTLS)** authentication, **SSL Pinning**, and **Hostname Verification** in Android applications. 

This tool hooks into low-level Java `javax.net.ssl` classes to inject a permissive TrustManager, allowing you to intercept traffic from highly secure apps that require client-side certificates.

> ⚠️ **Disclaimer:** This tool is for **educational purposes and authorized security research only**. Do not use this on applications without explicit permission from the owner.

## 🚀 Features

* **mTLS Bypass:** Hooks `checkClientTrusted` to bypass client certificate validation.
* **SSL Pinning Bypass:** Hooks `checkServerTrusted` and `OkHttp CertificatePinner` to accept any server certificate (e.g., Burp Suite/Mitmproxy).
* **Trust Manager Injection:** Replaces the app's `SSLContext` TrustManagers with a custom "TrustAll" manager.
* **Hostname Verifier:** Forces `verify()` to return `true` for all hostnames.
* **Traffic Logging:** Intercepts `URL.openConnection` to log HTTPS requests in the console.

## 🛠️ Prerequisites

* **Rooted Android Device** or **Emulator** (e.g., Genymotion/AVD).
* **Frida** installed on your PC (`pip install frida-tools`).
* **Frida Server** running on the Android device.

## 📖 Usage

1.  **Connect your device** via ADB.
2.  **Start Frida Server** on the device.
3.  **Run the script** using the package name of the target app:

```bash
frida -U -f com.example.targetapp -l bypass.js
```

### 📊 Understanding the Output

When the script is running, the console logs will confirm which security protections are being dismantled in real-time:

* **`[✅] TrustAll: Client certificate ACCEPTED`**
    * **Meaning:** The app attempted to enforce Mutual TLS (mTLS) by requesting a client certificate. The script intercepted this request and forced the validation to succeed without a certificate.

* **`[✅] OkHttp Certificate Pinning BYPASSED`**
    * **Meaning:** The app attempted to verify the server's certificate hash (SSL Pinning) using the OkHttp library. The script neutralized the check, allowing it to accept your proxy's certificate.

* **`[🔓] HTTPS Connection Initiated`**
    * **Meaning:** The bypass was successful, and the app is now sending encrypted traffic through your proxy (e.g., Burp Suite) without crashing or throwing SSL errors.

---

## 🛡️ Technical Architecture

This tool leverages Frida to perform dynamic instrumentation on the Android Runtime (ART). It specifically hooks into the `javax.net.ssl` and `okhttp3` namespaces to disable security controls at four critical layers:

| Target Class | Hooked Method | Description of the Bypass |
| :--- | :--- | :--- |
| **`javax.net.ssl.SSLContext`** | `init()` | Overrides the initialization process to inject a custom **TrustAllManager**, ensuring the app trusts user-installed CA certificates. |
| **`javax.net.ssl.X509TrustManager`** | `checkClientTrusted` | Disables the verification of client-side certificates, effectively bypassing **mTLS** authentication. |
| **`javax.net.ssl.HostnameVerifier`** | `verify()` | Forces the application to accept any hostname, preventing errors when traffic is redirected to a local proxy IP. |
| **`okhttp3.CertificatePinner`** | `check()` | Neutralizes the strict certificate hash pinning logic used by the popular **OkHttp** networking library. |

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.


---

#### **File 3: `LICENSE`**
*Standard MIT License allows others to use your code freely.*

```text
MIT License

Copyright (c) 2025 Akhil Rai

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
