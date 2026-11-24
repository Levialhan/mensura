import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// Generates a short metronome "click" WAV (1 kHz sine with fast decay).
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'assets', 'click.wav');

const sampleRate = 44100;
const duration = 0.04;
const n = Math.floor(sampleRate * duration);
const samples = new Int16Array(n);
for (let i = 0; i < n; i++) {
  const t = i / sampleRate;
  const env = Math.exp(-t * 130);
  samples[i] = Math.round(Math.sin(2 * Math.PI * 1000 * t) * env * 32767 * 0.85);
}

const dataSize = samples.length * 2;
const buf = Buffer.alloc(44 + dataSize);
buf.write('RIFF', 0);
buf.writeUInt32LE(36 + dataSize, 4);
buf.write('WAVE', 8);
buf.write('fmt ', 12);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20); // PCM
buf.writeUInt16LE(1, 22); // mono
buf.writeUInt32LE(sampleRate, 24);
buf.writeUInt32LE(sampleRate * 2, 28);
buf.writeUInt16LE(2, 32); // block align
buf.writeUInt16LE(16, 34); // bits per sample
buf.write('data', 36);
buf.writeUInt32LE(dataSize, 40);
for (let i = 0; i < n; i++) buf.writeInt16LE(samples[i], 44 + i * 2);

writeFileSync(out, buf);
console.log('wrote assets/click.wav');
