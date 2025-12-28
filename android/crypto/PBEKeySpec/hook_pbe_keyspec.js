/**
 * Script: JCA PBEKeySpec Interceptor
 * Author: Akhil Rai
 * Description: Hooks the 'javax.crypto.spec.PBEKeySpec' constructor to intercept 
 * PBKDF2 parameters (Salt, Iterations, Password) at runtime.
 * Target: Android Java Cryptography Architecture (JCA)
 * Usage: frida -U -f com.target.app -l hook_pbe_keyspec.js
 */


for Java.perform(function () {
    console.log("[*] Hooking PBKDF2 Key Spec to capture Salt & Iterations...");

    var PBEKeySpec = Java.use("javax.crypto.spec.PBEKeySpec");
    var StringClass = Java.use("java.lang.String");
    var Arrays = Java.use("java.util.Arrays");
  
    PBEKeySpec.$init.overload('[C', '[B', 'int', 'int').implementation = function (pass, salt, iter, keyLen) {
        
        var payload = "UNKNOWN";
        var saltStr = "UNKNOWN";
        var saltArr = "UNKNOWN";

        // 1. Capture the JSON Payload (Password)
        try {
            if (pass !== null) {
                payload = StringClass.$new(pass);
            }
        } catch (e) {
            console.log("[!] Error reading payload: " + e);
        }

        // 2. Capture the Salt
        try {
            if (salt !== null) {
                // Version A: Try to read it as a normal string (Best if it's text)
                saltStr = StringClass.$new(salt);
                
                // Version B: Read it as a byte array (Best if it's binary data)
                saltArr = Arrays.toString(salt);
            }
        } catch (e) {
            console.log("[!] Error reading salt: " + e);
        }

        console.log("\n========================================");
        console.log("[+] CRITICAL CRYPTO DATA CAPTURED");
        console.log("========================================");
        console.log("[-] Iterations : " + iter);
        console.log("[-] Key Length : " + keyLen);
        console.log("[-] Salt (Str) : " + saltStr);  // <--- LOOK HERE FIRST
        console.log("[-] Salt (Arr) : " + saltArr);
        console.log("----------------------------------------");
        console.log("[-] JSON Input : " + payload); 
        console.log("========================================\n");

        // Let the app continue normally so it doesn't crash
        return this.$init(pass, salt, iter, keyLen);
    };
}); i want to post this give read me and title what i should
