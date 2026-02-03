import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes.js';
import { ensureDir, cleanOldFiles } from './utils/fileCleanup.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Configuração de CORS
const corsOptions = {
    origin: function (origin, callback) {
        // Permitir requests sem origin (mobile apps, curl, etc)
        if (!origin) return callback(null, true);

        // Em desenvolvimento, permitir qualquer localhost
        if (NODE_ENV === 'development' && origin.includes('localhost')) {
            return callback(null, true);
        }

        // Em produção, verificar origin específica
        if (origin === FRONTEND_URL) {
            return callback(null, true);
        }

        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas da API
app.use('/api', routes);

// Rota raiz
app.get('/', (req, res) => {
    res.json({
        message: 'Image Processing API',
        version: '1.0.0',
        endpoints: {
            upload: 'POST /api/upload',
            process: 'POST /api/process',
            presets: 'GET /api/presets',
            health: 'GET /api/health'
        }
    });
});

// Inicializar servidor
async function startServer() {
    try {
        // Garantir que diretórios existem
        const uploadDir = path.join(__dirname, '../uploads');
        const processedDir = path.join(__dirname, '../processed');

        await ensureDir(uploadDir);
        await ensureDir(processedDir);

        // Limpar arquivos antigos ao iniciar
        await cleanOldFiles(uploadDir, 30);
        await cleanOldFiles(processedDir, 30);

        // Agendar limpeza periódica (a cada 10 minutos)
        setInterval(async () => {
            await cleanOldFiles(uploadDir, 30);
            await cleanOldFiles(processedDir, 30);
        }, 10 * 60 * 1000);

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
            console.log(`📁 Upload dir: ${uploadDir}`);
            console.log(`📁 Processed dir: ${processedDir}`);
            console.log(`🌐 API: http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Erro ao iniciar servidor:', error);
        process.exit(1);
    }
}

startServer();
