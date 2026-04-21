import CryptoJS from "crypto-js";

/**
 * Decrypt AES-128-CBC encrypted base64 string with embedded IV.
 *
 * @param {string} encryptedData - base64 string containing IV + encrypted content
 * @param {string} encryptionKey - the encryption key (padded or trimmed to 16 bytes)
 * @returns {object} - Decrypted JSON object
 */
export function decryptWithAES128(encryptedData, encryptionKey) {
    try {
        if (!encryptedData || !encryptionKey) {
            throw new Error("Missing parameters");
        }

        // Decode base64
        const rawData = CryptoJS.enc.Base64.parse(encryptedData);

        // Extract IV (first 16 bytes) and encrypted content
        const iv = CryptoJS.lib.WordArray.create(rawData.words.slice(0, 4)); // 16 bytes = 4 words
        const ciphertext = CryptoJS.lib.WordArray.create(rawData.words.slice(4));

        // Prepare 16-byte key (pad with nulls if needed)
        let keyBytes = CryptoJS.enc.Utf8.parse(encryptionKey);
        if (keyBytes.sigBytes < 16) {
            keyBytes = CryptoJS.enc.Utf8.parse(
                encryptionKey.padEnd(16, '\0').substring(0, 16)
            );
        } else {
            keyBytes = CryptoJS.lib.WordArray.create(keyBytes.words.slice(0, 4)); // 16 bytes
        }

        // Decrypt
        const decrypted = CryptoJS.AES.decrypt(
            { ciphertext: ciphertext },
            keyBytes,
            { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
        );

        const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedText);
    } catch (error) {
        console.error("AES-128 Decryption failed:", error.message);
        throw new Error("Decryption failed");
    }
}








/**
 * Decrypt AES-256-GCM encrypted base64 string (nonce + ciphertext+tag)
 *
 * @param {string} encryptedData - base64 string (nonce + ciphertext + tag)
 * @param {string} encryptionKey - key (base64 | hex | utf-8 → must resolve to 32 bytes)
 * @returns {object} - Decrypted JSON object
 */
export async function decryptWithAES256(encryptedData, encryptionKey) {
    try {
        if (!encryptedData || !encryptionKey) {
            throw new Error("Missing parameters");
        }

        // ---- Normalize key (same logic as Python) ----
        function normalizeKey(key) {
            const cleaned = String(key).trim();
            const unquoted =
                (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
                (cleaned.startsWith("'") && cleaned.endsWith("'"))
                    ? cleaned.slice(1, -1)
                    : cleaned;

            const prefixed = unquoted.match(/^(base64|hex|utf8):(.+)$/i);
            const mode = prefixed ? prefixed[1].toLowerCase() : null;
            const rawKey = (prefixed ? prefixed[2] : unquoted).trim();

            const attempts = [];

            const tryBase64 = () => {
                const padded = rawKey + "=".repeat((4 - rawKey.length % 4) % 4);
                const base64 = padded.replace(/-/g, "+").replace(/_/g, "/");
                const binary = atob(base64);
                return new Uint8Array([...binary].map((c) => c.charCodeAt(0)));
            };

            const tryHex = () => {
                if (!/^[0-9a-fA-F]+$/.test(rawKey) || rawKey.length % 2 !== 0) {
                    throw new Error("Invalid hex key");
                }
                const bytes = [];
                for (let i = 0; i < rawKey.length; i += 2) {
                    bytes.push(parseInt(rawKey.slice(i, i + 2), 16));
                }
                return new Uint8Array(bytes);
            };

            const tryUtf8 = () => new TextEncoder().encode(rawKey);

            const collect = (name, fn) => {
                try {
                    const bytes = fn();
                    attempts.push({ name, bytes });
                } catch {
                    // Ignore failed parse strategy.
                }
            };

            if (mode === "base64") {
                collect("base64", tryBase64);
            } else if (mode === "hex") {
                collect("hex", tryHex);
            } else if (mode === "utf8") {
                collect("utf8", tryUtf8);
            } else {
                collect("base64", tryBase64);
                collect("hex", tryHex);
                collect("utf8", tryUtf8);
            }

            const exact = attempts.find((entry) => entry.bytes.length === 32);
            if (!exact) {
                const details = attempts.map((entry) => `${entry.name}:${entry.bytes.length}`).join(", ");
                throw new Error(`AES-256 key must resolve to exactly 32 bytes (${details || "no parse"})`);
            }

            return exact.bytes;
        }

        const keyBytes = normalizeKey(encryptionKey);

        // ---- Decode payload ----
        const raw = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));

        if (raw.length < 13) {
            throw new Error("Invalid encrypted payload");
        }

        // Python: nonce = first 12 bytes
        const nonce = raw.slice(0, 12);

        // Python: ciphertext includes auth tag already
        const ciphertext = raw.slice(12);

        // ---- Import key ----
        const cryptoKey = await crypto.subtle.importKey(
            "raw",
            keyBytes,
            { name: "AES-GCM" },
            false,
            ["decrypt"]
        );

        // ---- Decrypt ----
        const decryptedBuffer = await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: nonce,
                tagLength: 128
            },
            cryptoKey,
            ciphertext
        );

        const decryptedText = new TextDecoder().decode(decryptedBuffer);

        return JSON.parse(decryptedText);

    } catch (error) {
        console.error("AES-256-GCM Decryption failed:", error.message);
        throw new Error("Decryption failed");
    }
}