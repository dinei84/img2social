import path from 'path';
import archiver from 'archiver';
import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import { processImage, processBatch } from '../services/imageService.js';
import { removeFiles } from '../utils/fileCleanup.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Controller para processamento de imagens
 * Aplica presets, redimensionamento e conversão
 */
export async function processImages(req, res) {
    const uploadedFiles = [];
    const processedFiles = [];

    try {
        const {
            files: fileIds,
            preset,
            format = 'jpeg',
            quality = 85,
            width,
            height,
            fit = 'contain',
            background = '#ffffff'
        } = req.body;

        // Validar entrada
        if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Nenhum arquivo especificado para processamento'
            });
        }

        // Preparar diretórios
        const uploadDir = path.join(__dirname, '../../uploads');
        const processedDir = path.join(__dirname, '../../processed');

        // Buscar arquivos de upload
        const files = fileIds.map(id => ({
            path: path.join(uploadDir, id)
        }));

        uploadedFiles.push(...files.map(f => f.path));

        // Processar imagens
        const results = await processBatch(files, processedDir, {
            preset,
            format,
            quality: parseInt(quality),
            width: width ? parseInt(width) : undefined,
            height: height ? parseInt(height) : undefined,
            fit,
            background
        });

        processedFiles.push(...results.map(r => r.path));

        // Se for uma única imagem, retornar para download direto
        if (results.length === 1) {
            const result = results[0];
            res.download(result.path, result.fileName, async (err) => {
                // Limpar arquivos após download
                await removeFiles([...uploadedFiles, ...processedFiles]);
            });
            return;
        }

        // Se múltiplas imagens, criar ZIP
        const zipFileName = `images_${Date.now()}.zip`;
        const zipPath = path.join(processedDir, zipFileName);

        const output = createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        archive.pipe(output);

        // Adicionar arquivos ao ZIP
        for (const result of results) {
            archive.file(result.path, { name: result.fileName });
        }

        await archive.finalize();

        // Aguardar conclusão do ZIP
        await new Promise((resolve, reject) => {
            output.on('close', resolve);
            output.on('error', reject);
        });

        // Enviar ZIP
        res.download(zipPath, zipFileName, async (err) => {
            // Limpar todos os arquivos
            await removeFiles([...uploadedFiles, ...processedFiles, zipPath]);
        });

    } catch (error) {
        console.error('Erro ao processar imagens:', error);

        // Limpar arquivos em caso de erro
        await removeFiles([...uploadedFiles, ...processedFiles]);

        res.status(500).json({
            success: false,
            error: 'Erro ao processar imagens: ' + error.message
        });
    }
}

/**
 * Retorna informações sobre os presets disponíveis
 */
export async function getPresets(req, res) {
    const { SOCIAL_MEDIA_PRESETS, getPlatforms } = await import('../config/presets.js');

    res.json({
        success: true,
        presets: SOCIAL_MEDIA_PRESETS,
        platforms: getPlatforms()
    });
}
