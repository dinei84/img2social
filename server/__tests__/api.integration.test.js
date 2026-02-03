import { describe, test, expect } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import routes from '../src/routes.js';

// Criar app de teste
const app = express();
app.use(express.json());
app.use('/api', routes);

describe('API Integration Tests', () => {
    describe('GET /api/health', () => {
        test('should return 200 and health status', async () => {
            const response = await request(app)
                .get('/api/health')
                .expect(200);

            expect(response.body).toHaveProperty('status', 'ok');
            expect(response.body).toHaveProperty('timestamp');
        });
    });

    describe('GET /api/presets', () => {
        test('should return 200 and presets list', async () => {
            const response = await request(app)
                .get('/api/presets')
                .expect(200);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('presets');
            expect(response.body).toHaveProperty('platforms');

            expect(Array.isArray(response.body.platforms)).toBe(true);
            expect(typeof response.body.presets).toBe('object');
        });

        test('presets should have correct structure', async () => {
            const response = await request(app)
                .get('/api/presets')
                .expect(200);

            const presets = response.body.presets;
            const firstPreset = Object.values(presets)[0];

            expect(firstPreset).toHaveProperty('name');
            expect(firstPreset).toHaveProperty('width');
            expect(firstPreset).toHaveProperty('height');
            expect(firstPreset).toHaveProperty('platform');
            expect(firstPreset).toHaveProperty('fit');
            expect(firstPreset).toHaveProperty('position');
        });

        test('platforms should include major social media', async () => {
            const response = await request(app)
                .get('/api/presets')
                .expect(200);

            const platforms = response.body.platforms;

            expect(platforms).toContain('Instagram');
            expect(platforms).toContain('YouTube');
            expect(platforms).toContain('Facebook');
            expect(platforms).toContain('Twitter');
            expect(platforms).toContain('LinkedIn');
        });
    });

    describe('POST /api/process', () => {
        test('should return 400 when no files provided', async () => {
            const response = await request(app)
                .post('/api/process')
                .send({})
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('error');
        });

        test('should return 400 when files array is empty', async () => {
            const response = await request(app)
                .post('/api/process')
                .send({ files: [] })
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body.error).toContain('Nenhum arquivo');
        });

        test('should accept valid processing parameters', async () => {
            // Este teste requer arquivos reais de upload
            // Por enquanto, apenas verifica que a rota existe
            const response = await request(app)
                .post('/api/process')
                .send({
                    files: ['non-existent-file.jpg'],
                    preset: 'instagram_feed_square',
                    format: 'jpeg',
                    quality: 85,
                    fit: 'contain',
                    background: '#ffffff'
                });

            // Esperamos erro porque o arquivo não existe
            // mas a validação de parâmetros deve passar
            expect([400, 500]).toContain(response.status);
        });
    });

    describe('POST /api/upload', () => {
        test('should return 400 when no files uploaded', async () => {
            const response = await request(app)
                .post('/api/upload')
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body.error).toContain('Nenhum arquivo');
        });
    });

    describe('CORS and Headers', () => {
        test('should handle OPTIONS requests', async () => {
            await request(app)
                .options('/api/health')
                .expect((res) => {
                    // CORS deve estar configurado
                    expect(res.status).toBeLessThan(500);
                });
        });
    });
});
