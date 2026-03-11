/**
 * Asset registry: maps config string paths to static require() calls.
 * React Native requires static require() for bundled assets.
 * Run `npm run generate-registry` after adding/removing assets.
 */

const AssetRegistry: Record<string, any> = {
  // Characters - SARAH
  'characters/sarah/idle.png': require('./characters/sarah/idle.png'),
  'characters/sarah/battle.png': require('./characters/sarah/battle.png'),
  'characters/sarah/hot.png': require('./characters/sarah/hot.png'),
  'characters/sarah/awaken.png': require('./characters/sarah/awaken.png'),
  'characters/sarah/critical.png': require('./characters/sarah/critical.png'),
  'characters/sarah/fizzle.png': require('./characters/sarah/fizzle.png'),
  'characters/sarah/beast-chibi.png': require('./characters/sarah/beast-chibi.png'),
  'characters/sarah/beast-medium.png': require('./characters/sarah/beast-medium.png'),
  'characters/sarah/beast-large.png': require('./characters/sarah/beast-large.png'),
  'characters/sarah/beast-fullscreen.png': require('./characters/sarah/beast-fullscreen.png'),

  // Backgrounds
  'backgrounds/calm.png': require('./backgrounds/calm.png'),
  'backgrounds/sense.png': require('./backgrounds/sense.png'),
  'backgrounds/quickening.png': require('./backgrounds/quickening.png'),
  'backgrounds/clash.png': require('./backgrounds/clash.png'),
  'backgrounds/intense.png': require('./backgrounds/intense.png'),
  'backgrounds/awakening.png': require('./backgrounds/awakening.png'),
  'backgrounds/critical.png': require('./backgrounds/critical.png'),

  // Effects (Lottie)
  'effects/placeholder.json': require('./effects/placeholder.json'),
};

export function resolveAsset(path: string): any {
  const asset = AssetRegistry[path];
  if (!asset) {
    console.warn(`[AssetRegistry] Asset not found: ${path}`);
    return null;
  }
  return asset;
}

export default AssetRegistry;
