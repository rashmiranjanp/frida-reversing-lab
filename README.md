🧪 Frida Reversing Lab
Welcome to the Frida Reversing Lab. This repository is a centralized workspace for mobile security research, storing dynamic instrumentation scripts and tools used to dissect Android applications.

The goal is to build a reusable toolkit for common mobile pentesting tasks. It documents real-world scenarios where static analysis fails (due to obfuscation or native code) and demonstrates how runtime manipulation can bypass security controls.

🔬 Research Modules
This lab is organized into different research areas:

🔐 Cryptography: Hooking JCA constructors (SecretKeySpec, PBEKeySpec) to extract keys, salts, and IVs from obfuscated apps.

🛡️ Integrity & Logic: Bypassing client-side checksums (HMAC/Hash) and manipulating API payloads in transit using Python.

🌐 Network Security: Scripts to bypass SSL Pinning and intercept traffic in apps using custom network stacks.

📱 Device Security: Bypassing Root detection, Emulator checks, and Debugger restrictions.

🛠️ Tech Stack
Frida: For hooking methods, changing arguments, and tracing execution flow.

Python: For automating exploits, payload generation, and server response decryption.

JavaScript: For the core instrumentation logic.
