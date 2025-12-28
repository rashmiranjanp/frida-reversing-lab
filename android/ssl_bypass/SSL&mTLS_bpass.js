/* Universal mTLS & SSL Pinning Bypass for Android
   Author: akhilrai0903
   Description: Bypasses client-side certificate authentication (mTLS), 
   server-side SSL pinning, and hostname verification.
*/

console.log("[🔥] COMPLETE mTLS BYPASS SCRIPT LOADED!");

Java.perform(function() {
    console.log("[+] Java VM Hooked Successfully!");

    // --- 1. BYPASS TRUST MANAGERS (The Core of mTLS Bypass) ---
    var X509TrustManager = Java.use("javax.net.ssl.X509TrustManager");
    var SSLContext = Java.use("javax.net.ssl.SSLContext");

    // Create a custom TrustManager that trusts EVERYTHING
    var TrustAllManager = Java.registerClass({
        name: 'com.bypass.TrustAllManager',
        implements: [X509TrustManager],
        methods: {
            checkClientTrusted: function(chain, authType) {
                console.log("[✅] TrustAll: Client certificate ACCEPTED (mTLS Bypass)");
            },
            checkServerTrusted: function(chain, authType) {
                console.log("[✅] TrustAll: Server certificate ACCEPTED");
            },
            getAcceptedIssuers: function() {
                return [];
            }
        }
    });

    // --- 2. HOOK SSL CONTEXT INIT ---
    // This injects our permissive TrustManager into the app's SSLContext
    var TrustManagers = [TrustAllManager.$new()];
    
    SSLContext.init.overload('[Ljavax.net.ssl.KeyManager;', '[Ljavax.net.ssl.TrustManager;', 'java.security.SecureRandom').implementation = function(keyManagers, trustManagers, secureRandom) {
        console.log("[✅] SSLContext.init HOOKED - Injecting TrustAll Manager");
        // We ignore the app's original trustManagers and pass our own
        return this.init(keyManagers, TrustManagers, secureRandom);
    };

    // --- 3. BYPASS HOSTNAME VERIFICATION ---
    var HostnameVerifier = Java.use("javax.net.ssl.HostnameVerifier");
    HostnameVerifier.verify.implementation = function(hostname, session) {
        console.log("[✅] Hostname Verification BYPASSED for: " + hostname);
        return true;
    };

    // --- 4. BYPASS OKHTTP CERTIFICATE PINNING ---
    try {
        var CertificatePinner = Java.use("okhttp3.CertificatePinner");
        CertificatePinner.check.overload('java.lang.String', 'java.util.List').implementation = function(hostname, pins) {
            console.log("[✅] OkHttp Certificate Pinning BYPASSED: " + hostname);
            // Return nothing = Validation success
        };
    } catch(e) {
        console.log("[-] OkHttp pinning not found (This is normal for some apps)");
    }

    // --- 5. BYPASS NETWORK SECURITY CONFIG (Android 7+) ---
    try {
        var NetworkSecurityPolicy = Java.use("android.security.NetworkSecurityPolicy");
        NetworkSecurityPolicy.getInstanceForApplication.implementation = function() {
            var instance = this.getInstanceForApplication();
            console.log("[✅] Network Security Policy Hooked");
            return instance;
        };
        NetworkSecurityPolicy.isCleartextTrafficPermitted.overload().implementation = function() {
            return true;
        };
    } catch(e) {}

    // --- 6. LOGGING & MONITORING ---
    // Monitor HTTP Requests to verify the bypass works
    var URL = Java.use("java.net.URL");
    URL.openConnection.overload().implementation = function() {
        var url = this.toString();
        
        try {
            var connection = this.openConnection.overload().call(this);
            if (url.startsWith("https")) {
                console.log("[🔓] HTTPS Connection Initiated: " + url);
            }
            return connection;
        } catch(e) {
            return this.openConnection.overload().call(this);
        }
    };

    console.log("\n[🎯] ALL mTLS BYPASSES ACTIVE!");
});
