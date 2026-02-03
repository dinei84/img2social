import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { SOCIAL_MEDIA_PRESETS } from '../config/presets.js';

/**
 * Processa uma imagem com base nos parâmetros fornecidos
 * @param {Object} options - Opções de processamento
 * @param {string} options.inputPath - Caminho da imagem de entrada
 * @param {string} options.outputDir - Diretório de saída
 * @param {string} options.preset - ID do preset (opcional)
 * @param {number} options.width - Largura customizada (opcional)
 * @param {number} options.height - Altura customizada (opcional)
 * @param {string} options.format - Formato de saída (jpeg, png, webp, avif)
 * @param {number} options.quality - Qualidade (0-100)
 * @param {string} options.fit - Estratégia de fit (cover, contain, fill, inside, outside)
 * @param {string} options.background - Cor de fundo quando usar contain (hex, rgb, ou nome)
 * @returns {Promise<Object>} Informações da imagem processada
 */
export async function processImage(options) {
    const {
        inputPath,
        outputDir,
        preset,
        width,
        height,
        format = 'jpeg',
        quality = 85,
        fit = 'contain',
        background = '#ffffff'
    } = options;

    // Determinar dimensões e fit
    let targetWidth, targetHeight, targetFit, targetBackground;
    let presetInfo = null;

    if (preset && SOCIAL_MEDIA_PRESETS[preset]) {
        presetInfo = SOCIAL_MEDIA_PRESETS[preset];
        targetWidth = presetInfo.width;
        targetHeight = presetInfo.height;
        // Usar o fit passado pelo usuário ao invés do fit do preset
        targetFit = fit;
    } else {
        targetWidth = width;
        targetHeight = height;
        targetFit = fit;
    }

    targetBackground = background;

    // Gerar nome de arquivo único
    const outputFileName = `${uuidv4()}.${format}`;
    const outputPath = path.join(outputDir, outputFileName);

    // Processar imagem com Sharp
    let sharpInstance = sharp(inputPath);

    // Aplicar resize se dimensões foram fornecidas
    if (targetWidth || targetHeight) {
        const resizeOptions = {
            fit: targetFit,
            position: 'center'
        };

        // Se for 'contain', adicionar background para preencher espaços vazios
        if (targetFit === 'contain') {
            resizeOptions.background = targetBackground;
        }

        sharpInstance = sharpInstance.resize(targetWidth, targetHeight, resizeOptions);
    }

    // Aplicar formato e qualidade
    switch (format.toLowerCase()) {
        case 'jpeg':
        case 'jpg':
            // Para JPEG, garantir fundo branco se não for opaco
            if (targetFit === 'contain') {
                sharpInstance = sharpInstance.flatten({ background: targetBackground });
            }
            sharpInstance = sharpInstance.jpeg({ quality });
            break;
        case 'png':
            sharpInstance = sharpInstance.png({ quality });
            break;
        case 'webp':
            sharpInstance = sharpInstance.webp({ quality });
            break;
        case 'avif':
            sharpInstance = sharpInstance.avif({ quality });
            break;
        default:
            sharpInstance = sharpInstance.jpeg({ quality });
    }

    // Salvar arquivo
    await sharpInstance.toFile(outputPath);

    // Obter metadados da imagem processada
    const metadata = await sharp(outputPath).metadata();

    return {
        path: outputPath,
        fileName: outputFileName,
        format: metadata.format,
        width: metadata.width,
        height: metadata.height,
        size: metadata.size,
        preset: presetInfo ? presetInfo.name : null,
        platform: presetInfo ? presetInfo.platform : null
    };
}

/**
 * Processa múltiplas imagens em lote
 * @param {Array} files - Array de arquivos para processar
 * @param {string} outputDir - Diretório de saída
 * @param {Object} options - Opções de processamento
 * @returns {Promise<Array>} Array com resultados do processamento
 */
export async function processBatch(files, outputDir, options) {
    const results = await Promise.all(
        files.map(file =>
            processImage({
                inputPath: file.path,
                outputDir,
                ...options
            })
        )
    );

    return results;
}

/**
 * Valida se o formato é suportado
 * @param {string} format - Formato a validar
 * @returns {boolean}
 */
export function isSupportedFormat(format) {
    const supported = ['jpeg', 'jpg', 'png', 'webp', 'avif'];
    return supported.includes(format.toLowerCase());
}

/**
 * Obtém informações de uma imagem
 * @param {string} imagePath - Caminho da imagem
 * @returns {Promise<Object>} Metadados da imagem
 */
export async function getImageInfo(imagePath) {
    const metadata = await sharp(imagePath).metadata();
    return {
        format: metadata.format,
        width: metadata.width,
        height: metadata.height,
        size: metadata.size,
        space: metadata.space,
        channels: metadata.channels,
        hasAlpha: metadata.hasAlpha
    };
}
