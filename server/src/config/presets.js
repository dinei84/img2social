/**
 * Presets de dimensões para redes sociais
 * Cada preset define largura, altura e estratégia de fit
 */

export const SOCIAL_MEDIA_PRESETS = {
  // Instagram
  instagram_feed_square: {
    name: 'Instagram - Feed Quadrado',
    width: 1080,
    height: 1080,
    fit: 'cover',
    position: 'center',
    platform: 'Instagram'
  },
  instagram_feed_vertical: {
    name: 'Instagram - Feed Vertical',
    width: 1080,
    height: 1350,
    fit: 'cover',
    position: 'center',
    platform: 'Instagram'
  },
  instagram_stories: {
    name: 'Instagram - Stories/Reels',
    width: 1080,
    height: 1920,
    fit: 'cover',
    position: 'center',
    platform: 'Instagram'
  },

  // YouTube
  youtube_thumbnail: {
    name: 'YouTube - Thumbnail',
    width: 1280,
    height: 720,
    fit: 'cover',
    position: 'center',
    platform: 'YouTube'
  },
  youtube_banner: {
    name: 'YouTube - Banner de Canal',
    width: 2560,
    height: 1440,
    fit: 'cover',
    position: 'center',
    platform: 'YouTube'
  },

  // Twitter/X
  twitter_post: {
    name: 'Twitter - Post Padrão',
    width: 1200,
    height: 675,
    fit: 'cover',
    position: 'center',
    platform: 'Twitter'
  },
  twitter_header: {
    name: 'Twitter - Header',
    width: 1500,
    height: 500,
    fit: 'cover',
    position: 'center',
    platform: 'Twitter'
  },

  // Facebook
  facebook_post: {
    name: 'Facebook - Post',
    width: 1200,
    height: 630,
    fit: 'cover',
    position: 'center',
    platform: 'Facebook'
  },
  facebook_cover: {
    name: 'Facebook - Capa',
    width: 820,
    height: 312,
    fit: 'cover',
    position: 'center',
    platform: 'Facebook'
  },

  // LinkedIn
  linkedin_post: {
    name: 'LinkedIn - Post',
    width: 1200,
    height: 627,
    fit: 'cover',
    position: 'center',
    platform: 'LinkedIn'
  },
  linkedin_banner: {
    name: 'LinkedIn - Banner',
    width: 1584,
    height: 396,
    fit: 'cover',
    position: 'center',
    platform: 'LinkedIn'
  }
};

/**
 * Retorna lista de plataformas únicas
 */
export function getPlatforms() {
  const platforms = new Set();
  Object.values(SOCIAL_MEDIA_PRESETS).forEach(preset => {
    platforms.add(preset.platform);
  });
  return Array.from(platforms);
}

/**
 * Retorna presets filtrados por plataforma
 */
export function getPresetsByPlatform(platform) {
  return Object.entries(SOCIAL_MEDIA_PRESETS)
    .filter(([, preset]) => preset.platform === platform)
    .reduce((acc, [key, preset]) => {
      acc[key] = preset;
      return acc;
    }, {});
}
