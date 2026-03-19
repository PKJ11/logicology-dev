import { initEdgeStore } from '@edgestore/server';
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';

const es = initEdgeStore.create();

/**
 * This is the main router for the EdgeStore buckets.
 * Define all your content type buckets here
 */
const edgeStoreRouter = es.router({
  // For PDF worksheets
  worksheets: es.fileBucket(),
  
  // For images and thumbnails  
  images: es.imageBucket(),
  
  // For videos (Mindstamp, etc.)
  videos: es.fileBucket(),
  
  // For assessments and documents
  assessments: es.fileBucket(),
  
  // For game assets
  games: es.fileBucket(),
  
  // For general public files
  publicFiles: es.fileBucket(),
});

const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
});

export { handler as GET, handler as POST };

/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = typeof edgeStoreRouter;