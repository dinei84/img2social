import fs from 'fs/promises';
import path from 'path';

/**
 * Remove um arquivo do sistema
 * @param {string} filePath - Caminho do arquivo
 */
export async function removeFile(filePath) {
    try {
        await fs.unlink(filePath);
    } catch (error) {
        console.error(`Erro ao remover arquivo ${filePath}:`, error.message);
    }
}

/**
 * Remove múltiplos arquivos
 * @param {Array<string>} filePaths - Array de caminhos de arquivos
 */
export async function removeFiles(filePaths) {
    await Promise.all(filePaths.map(removeFile));
}

/**
 * Remove todos os arquivos de um diretório
 * @param {string} dirPath - Caminho do diretório
 */
export async function cleanDirectory(dirPath) {
    try {
        const files = await fs.readdir(dirPath);
        const filePaths = files.map(file => path.join(dirPath, file));
        await removeFiles(filePaths);
    } catch (error) {
        console.error(`Erro ao limpar diretório ${dirPath}:`, error.message);
    }
}

/**
 * Remove arquivos mais antigos que X minutos
 * @param {string} dirPath - Caminho do diretório
 * @param {number} maxAgeMinutes - Idade máxima em minutos
 */
export async function cleanOldFiles(dirPath, maxAgeMinutes = 30) {
    try {
        const files = await fs.readdir(dirPath);
        const now = Date.now();
        const maxAge = maxAgeMinutes * 60 * 1000;

        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stats = await fs.stat(filePath);
            const age = now - stats.mtimeMs;

            if (age > maxAge) {
                await removeFile(filePath);
            }
        }
    } catch (error) {
        console.error(`Erro ao limpar arquivos antigos de ${dirPath}:`, error.message);
    }
}

/**
 * Garante que um diretório existe
 * @param {string} dirPath - Caminho do diretório
 */
export async function ensureDir(dirPath) {
    try {
        await fs.access(dirPath);
    } catch {
        await fs.mkdir(dirPath, { recursive: true });
    }
}
