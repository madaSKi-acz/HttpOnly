"use client";

import api from './api';
import { bufferToBase64, base64ToBuffer } from '@/app/lib/utils';

interface ServerWebAuthnRegisterOptions {
  challenge: string;
  rp: { name: string; id: string };
  user: {
    id: string;
    name: string;
    displayName: string;
  };
  pubKeyCredParams: Array<{ type: 'public-key'; alg: number }>;
  timeout?: number;
  attestation?: string;
}

export async function registerWebAuthn(): Promise<void> {
  try {
    const optionsResponse = await api.post<ServerWebAuthnRegisterOptions>(
      '/api/webauthn/register/options'
    );

    // FIX: Use .data directly (no .data.data)
    const serverOptions = optionsResponse.data;

    const publicKey: PublicKeyCredentialCreationOptions = {
      challenge: base64ToBuffer(serverOptions.challenge),
      rp: serverOptions.rp,
      user: {
        id: base64ToBuffer(serverOptions.user.id),
        name: serverOptions.user.name,
        displayName: serverOptions.user.displayName,
      },
      pubKeyCredParams: serverOptions.pubKeyCredParams,
      timeout: serverOptions.timeout ?? 60000,
      ...(serverOptions.attestation && {
        attestation: serverOptions.attestation as AttestationConveyancePreference,
      }),
    };

    const credential = (await navigator.credentials.create({
      publicKey,
    })) as PublicKeyCredential | null;

    if (!credential) {
      throw new Error('WebAuthn registration was cancelled by the user.');
    }

    const response = credential.response as AuthenticatorAttestationResponse;

    await api.post('/api/webauthn/register/verify', {
      id: credential.id,
      rawId: bufferToBase64(credential.rawId),
      type: credential.type,
      response: {
        attestationObject: bufferToBase64(response.attestationObject),
        clientDataJSON: bufferToBase64(response.clientDataJSON),
      },
    });

    console.log('WebAuthn device registered successfully!');
  } catch (error) {
    console.error('WebAuthn registration failed:', error);

    if ((error as Error)?.name === 'NotAllowedError') {
      throw new Error('Registration cancelled or blocked. Please allow the browser prompt.');
    }

    throw new Error('Failed to register your device. Please refresh and try again.');
  }
}