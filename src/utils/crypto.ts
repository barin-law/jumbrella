/**
 * JuriMbrella Cryptographic Services
 * Utilizes standard Web Crypto API (SubtleCrypto) for SHA-256 integrity validation,
 * tamper-evident hash chaining, and non-repudiation manifests.
 */

import { AuditEvent } from '../types';

/**
 * Computes a standard SHA-256 hexadecimal hash using Web Crypto API.
 */
export async function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generates an initial genesis hash for an append-only audit trail.
 */
export const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

/**
 * Computes an audit event's cryptographic block hash based on its payload and previous hash.
 */
export async function computeAuditEventHash(
  prevHash: string,
  eventData: {
    timestamp: string;
    actorUid: string;
    action: string;
    resource: string;
    severity: string;
    ipAddress: string;
  }
): Promise<string> {
  const payload = `${prevHash}|${eventData.timestamp}|${eventData.actorUid}|${eventData.action}|${eventData.resource}|${eventData.severity}|${eventData.ipAddress}`;
  return sha256(payload);
}

/**
 * Verifies the integrity of an audit chain. Returns true if zero tampering detected.
 */
export async function verifyAuditChainIntegrity(events: AuditEvent[]): Promise<{
  isValid: boolean;
  tamperedIndex?: number;
  expectedHash?: string;
  actualHash?: string;
}> {
  if (!events || events.length === 0) {
    return { isValid: true };
  }

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const expectedPrevHash = i === 0 ? GENESIS_HASH : events[i - 1].hash;

    if (event.prevHash !== expectedPrevHash) {
      return {
        isValid: false,
        tamperedIndex: i,
        expectedHash: expectedPrevHash,
        actualHash: event.prevHash,
      };
    }

    const calculatedHash = await computeAuditEventHash(event.prevHash, {
      timestamp: event.timestamp,
      actorUid: event.actor.uid,
      action: event.action,
      resource: event.resource,
      severity: event.severity,
      ipAddress: event.ipAddress,
    });

    if (calculatedHash !== event.hash) {
      return {
        isValid: false,
        tamperedIndex: i,
        expectedHash: calculatedHash,
        actualHash: event.hash,
      };
    }
  }

  return { isValid: true };
}

/**
 * Generates an authoritative Philippine Notarial Reference Number.
 * Format: ENF-YYYYMMDD-XXXX
 */
export function generateReferenceNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ENF-${dateStr}-${rand}`;
}

/**
 * Masks sensitive government ID numbers for privacy (Data Privacy Act compliance).
 * e.g. "P1234567A" -> "P•••••567A"
 */
export function maskIdNumber(idStr: string): string {
  if (!idStr || idStr.length <= 4) return '••••';
  const prefix = idStr.slice(0, 1);
  const suffix = idStr.slice(-3);
  return `${prefix}••••••${suffix}`;
}

/**
 * Formats a long SHA-256 hash for display.
 * e.g. "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08" -> "9f86d081...0f00a08"
 */
export function truncateHash(hash: string, lead = 8, trail = 6): string {
  if (!hash || hash.length <= lead + trail) return hash;
  return `${hash.substring(0, lead)}...${hash.substring(hash.length - trail)}`;
}
