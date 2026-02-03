import { describe, test, expect } from '@jest/globals';
import { SOCIAL_MEDIA_PRESETS, getPlatforms, getPresetsByPlatform } from '../src/config/presets.js';

describe('Presets Configuration', () => {
    describe('SOCIAL_MEDIA_PRESETS', () => {
        test('should have all required platforms', () => {
            const platforms = new Set();
            Object.values(SOCIAL_MEDIA_PRESETS).forEach(preset => {
                platforms.add(preset.platform);
            });

            expect(platforms.has('Instagram')).toBe(true);
            expect(platforms.has('YouTube')).toBe(true);
            expect(platforms.has('Twitter')).toBe(true);
            expect(platforms.has('Facebook')).toBe(true);
            expect(platforms.has('LinkedIn')).toBe(true);
        });

        test('should have valid dimensions for all presets', () => {
            Object.entries(SOCIAL_MEDIA_PRESETS).forEach(([key, preset]) => {
                expect(preset.width).toBeGreaterThan(0);
                expect(preset.height).toBeGreaterThan(0);
                expect(typeof preset.name).toBe('string');
                expect(preset.name.length).toBeGreaterThan(0);
            });
        });

        test('Instagram presets should have correct dimensions', () => {
            expect(SOCIAL_MEDIA_PRESETS.instagram_feed_square.width).toBe(1080);
            expect(SOCIAL_MEDIA_PRESETS.instagram_feed_square.height).toBe(1080);

            expect(SOCIAL_MEDIA_PRESETS.instagram_feed_vertical.width).toBe(1080);
            expect(SOCIAL_MEDIA_PRESETS.instagram_feed_vertical.height).toBe(1350);

            expect(SOCIAL_MEDIA_PRESETS.instagram_stories.width).toBe(1080);
            expect(SOCIAL_MEDIA_PRESETS.instagram_stories.height).toBe(1920);
        });

        test('YouTube presets should have correct dimensions', () => {
            expect(SOCIAL_MEDIA_PRESETS.youtube_thumbnail.width).toBe(1280);
            expect(SOCIAL_MEDIA_PRESETS.youtube_thumbnail.height).toBe(720);

            expect(SOCIAL_MEDIA_PRESETS.youtube_banner.width).toBe(2560);
            expect(SOCIAL_MEDIA_PRESETS.youtube_banner.height).toBe(1440);
        });
    });

    describe('getPlatforms', () => {
        test('should return array of unique platforms', () => {
            const platforms = getPlatforms();

            expect(Array.isArray(platforms)).toBe(true);
            expect(platforms.length).toBeGreaterThan(0);
            expect(new Set(platforms).size).toBe(platforms.length);
        });

        test('should include all major platforms', () => {
            const platforms = getPlatforms();

            expect(platforms).toContain('Instagram');
            expect(platforms).toContain('YouTube');
            expect(platforms).toContain('Twitter');
            expect(platforms).toContain('Facebook');
            expect(platforms).toContain('LinkedIn');
        });
    });

    describe('getPresetsByPlatform', () => {
        test('should return only Instagram presets', () => {
            const instagramPresets = getPresetsByPlatform('Instagram');

            Object.values(instagramPresets).forEach(preset => {
                expect(preset.platform).toBe('Instagram');
            });

            expect(Object.keys(instagramPresets).length).toBeGreaterThan(0);
        });

        test('should return only YouTube presets', () => {
            const youtubePresets = getPresetsByPlatform('YouTube');

            Object.values(youtubePresets).forEach(preset => {
                expect(preset.platform).toBe('YouTube');
            });

            expect(Object.keys(youtubePresets).length).toBe(2);
        });

        test('should return empty object for non-existent platform', () => {
            const presets = getPresetsByPlatform('InvalidPlatform');

            expect(Object.keys(presets).length).toBe(0);
        });
    });
});
