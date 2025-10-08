// Anime.js wrapper using global CDN version
declare global {
  interface Window {
    anime: any;
  }
}

// Use the globally loaded anime.js from CDN
const anime = (window as any).anime || (() => {
  console.warn('Anime.js not loaded. Make sure the CDN script is included.');
  return () => {};
});

export default anime;
