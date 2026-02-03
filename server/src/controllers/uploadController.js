import { getImageInfo } from '../services/imageService.js';

/**
 * Controller para upload de imagens
 * Recebe os arquivos via Multer e retorna informações básicas
 */
export async function uploadImages(req, res) {
    try {
        // Verificar se arquivos foram enviados
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Nenhum arquivo foi enviado'
            });
        }

        // Processar informações dos arquivos
        const filesInfo = await Promise.all(
            req.files.map(async (file) => {
                try {
                    const info = await getImageInfo(file.path);
                    return {
                        id: file.filename,
                        originalName: file.originalname,
                        path: file.path,
                        size: file.size,
                        mimeType: file.mimetype,
                        ...info
                    };
                } catch (error) {
                    console.error(`Erro ao processar ${file.originalname}:`, error);
                    return {
                        id: file.filename,
                        originalName: file.originalname,
                        error: 'Não foi possível processar esta imagem'
                    };
                }
            })
        );

        res.json({
            success: true,
            files: filesInfo,
            count: filesInfo.length
        });

    } catch (error) {
        console.error('Erro no upload:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao processar upload'
        });
    }
}
