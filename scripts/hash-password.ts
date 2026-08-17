import bcrypt from 'bcryptjs';

async function readHidden(prompt: string): Promise<string> {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error('hash-password requires an interactive terminal');
  }
  process.stdout.write(prompt);
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding('utf8');

  return new Promise((resolve, reject) => {
    let value = '';
    const cleanup = () => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdin.removeListener('data', onData);
    };
    const onData = (chunk: string) => {
      if (chunk === '\u0003') {
        cleanup();
        reject(new Error('cancelled'));
        return;
      }
      if (chunk === '\r' || chunk === '\n') {
        cleanup();
        process.stdout.write('\n');
        resolve(value);
        return;
      }
      if (chunk === '\u007f') {
        value = value.slice(0, -1);
        return;
      }
      value += chunk;
    };
    process.stdin.on('data', onData);
  });
}

try {
  const raw = await readHidden('New admin password: ');
  if (!raw) throw new Error('password must not be empty');
  const hash = await bcrypt.hash(raw, 12);
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
} catch (error) {
  process.stdin.isTTY && process.stdin.setRawMode(false);
  console.error(`[hash-password] ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
