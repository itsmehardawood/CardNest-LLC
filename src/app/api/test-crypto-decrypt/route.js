import { NextResponse } from 'next/server';
import { createDecipheriv } from 'crypto';

function normalizeKey(inputKey) {
  if (!inputKey || typeof inputKey !== 'string') {
    throw new Error('Missing key');
  }

  const cleaned = inputKey.trim();
  const unquoted =
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
      ? cleaned.slice(1, -1)
      : cleaned;

  const prefixed = unquoted.match(/^(base64|hex|utf8):(.+)$/i);
  const mode = prefixed ? prefixed[1].toLowerCase() : null;
  const raw = (prefixed ? prefixed[2] : unquoted).trim();

  const attempts = [];

  const tryBase64 = () => {
    const padded = raw + '='.repeat((4 - raw.length % 4) % 4);
    const normalized = padded.replace(/-/g, '+').replace(/_/g, '/');
    return Buffer.from(normalized, 'base64');
  };

  const tryHex = () => {
    if (!/^[0-9a-fA-F]+$/.test(raw) || raw.length % 2 !== 0) {
      throw new Error('Invalid hex key');
    }
    return Buffer.from(raw, 'hex');
  };

  const tryUtf8 = () => Buffer.from(raw, 'utf8');

  const collect = (name, fn) => {
    try {
      const bytes = fn();
      attempts.push({ name, length: bytes.length, bytes });
    } catch {
      // Ignore failed parsing strategy.
    }
  };

  if (mode === 'base64') {
    collect('base64', tryBase64);
  } else if (mode === 'hex') {
    collect('hex', tryHex);
  } else if (mode === 'utf8') {
    collect('utf8', tryUtf8);
  } else {
    collect('base64', tryBase64);
    collect('hex', tryHex);
    collect('utf8', tryUtf8);
  }

  const exact = attempts.find((entry) => entry.length === 32);
  if (!exact) {
    return {
      ok: false,
      key: null,
      diagnostics: attempts.map((entry) => ({ method: entry.name, byteLength: entry.length })),
    };
  }

  return {
    ok: true,
    key: exact.bytes,
    diagnostics: attempts.map((entry) => ({ method: entry.name, byteLength: entry.length })),
    selectedMethod: exact.name,
  };
}

function decryptAes256Gcm(payloadBase64, keyBuffer) {
  const raw = Buffer.from(payloadBase64, 'base64');
  if (raw.length < 12 + 16 + 1) {
    throw new Error('Invalid payload length for AES-256-GCM');
  }

  const iv = raw.subarray(0, 12);
  const encryptedWithTag = raw.subarray(12);
  const tag = encryptedWithTag.subarray(encryptedWithTag.length - 16);
  const ciphertext = encryptedWithTag.subarray(0, encryptedWithTag.length - 16);

  const decipher = createDecipheriv('aes-256-gcm', keyBuffer, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  const text = decrypted.toString('utf8');

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const encryptedData = body?.encryptedData;
    const key = body?.key;

    if (!encryptedData || !key) {
      return NextResponse.json(
        {
          ok: false,
          error: 'encryptedData and key are required',
        },
        { status: 400 }
      );
    }

    const normalized = normalizeKey(key);

    if (!normalized.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Key does not resolve to 32 bytes',
          keyDiagnostics: normalized.diagnostics,
        },
        { status: 400 }
      );
    }

    const decrypted = decryptAes256Gcm(encryptedData, normalized.key);

    return NextResponse.json({
      ok: true,
      keyDiagnostics: normalized.diagnostics,
      selectedKeyMethod: normalized.selectedMethod,
      decrypted,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || 'Decryption failed',
      },
      { status: 500 }
    );
  }
}
