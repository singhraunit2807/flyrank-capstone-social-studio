import { mkdir } from 'node:fs/promises';
import { generateAllPlatformImages } from '../src/imageGenerator.js';

const sourcePath = process.argv[2] || 'assets/source-social.svg';
const outputDir = process.argv[3] || 'generated-images';

await mkdir(outputDir, { recursive: true });
const results = await generateAllPlatformImages(sourcePath, outputDir);
console.log(JSON.stringify(results, null, 2));
