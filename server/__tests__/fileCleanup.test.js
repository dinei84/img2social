import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { removeFile, removeFiles, cleanDirectory, ensureDir } from '../src/utils/fileCleanup.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEST_DIR = path.join(__dirname, 'temp-cleanup');

describe('File Cleanup Utilities', () => {
    beforeEach(async () => {
        await ensureDir(TEST_DIR);
    });

    afterEach(async () => {
        try {
            const files = await fs.readdir(TEST_DIR);
            await Promise.all(
                files.map(file => fs.unlink(path.join(TEST_DIR, file)))
            );
            await fs.rmdir(TEST_DIR);
        } catch (error) {
            // Ignorar erros
        }
    });

    describe('ensureDir', () => {
        test('should create directory if it does not exist', async () => {
            const newDir = path.join(TEST_DIR, 'new-folder');

            await ensureDir(newDir);

            const stats = await fs.stat(newDir);
            expect(stats.isDirectory()).toBe(true);

            await fs.rmdir(newDir);
        });

        test('should not fail if directory already exists', async () => {
            await ensureDir(TEST_DIR);
            await ensureDir(TEST_DIR);

            const stats = await fs.stat(TEST_DIR);
            expect(stats.isDirectory()).toBe(true);
        });
    });

    describe('removeFile', () => {
        test('should remove existing file', async () => {
            const testFile = path.join(TEST_DIR, 'test.txt');
            await fs.writeFile(testFile, 'test content');

            await removeFile(testFile);

            await expect(fs.access(testFile)).rejects.toThrow();
        });

        test('should not throw error for non-existent file', async () => {
            await expect(
                removeFile(path.join(TEST_DIR, 'non-existent.txt'))
            ).resolves.not.toThrow();
        });
    });

    describe('removeFiles', () => {
        test('should remove multiple files', async () => {
            const file1 = path.join(TEST_DIR, 'file1.txt');
            const file2 = path.join(TEST_DIR, 'file2.txt');

            await fs.writeFile(file1, 'content 1');
            await fs.writeFile(file2, 'content 2');

            await removeFiles([file1, file2]);

            await expect(fs.access(file1)).rejects.toThrow();
            await expect(fs.access(file2)).rejects.toThrow();
        });

        test('should handle empty array', async () => {
            await expect(removeFiles([])).resolves.not.toThrow();
        });
    });

    describe('cleanDirectory', () => {
        test('should remove all files from directory', async () => {
            await fs.writeFile(path.join(TEST_DIR, 'file1.txt'), 'content');
            await fs.writeFile(path.join(TEST_DIR, 'file2.txt'), 'content');
            await fs.writeFile(path.join(TEST_DIR, 'file3.txt'), 'content');

            await cleanDirectory(TEST_DIR);

            const files = await fs.readdir(TEST_DIR);
            expect(files.length).toBe(0);
        });
    });
});
