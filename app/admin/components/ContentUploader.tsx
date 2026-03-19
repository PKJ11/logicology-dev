'use client';

import * as React from 'react';
import { useEdgeStore } from '@/app/lib/edgestore';
import { FileUploader } from '@/components/upload/multi-file';
import { SingleImageDropzone } from '@/components/upload/single-image';
import {
  UploaderProvider,
  type UploadFn,
} from '@/components/upload/uploader-provider';
import { UploadedFile } from '@/app/types/subscription';

interface ContentUploaderProps {
  contentType: 'worksheet' | 'mindstamp' | 'assessment' | 'game' | 'wordwall' | 'image';
  onUploadComplete: (urls: string[], files: UploadedFile[]) => void;
  maxFiles?: number;
}

export function ContentUploader({ contentType, onUploadComplete, maxFiles = 5 }: ContentUploaderProps) {
  const { edgestore } = useEdgeStore();
  const [uploadedUrls, setUploadedUrls] = React.useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([]);

  // Determine which bucket to use based on content type
  const getBucket = () => {
    switch (contentType) {
      case 'worksheet':
        return edgestore.worksheets;
      case 'mindstamp':
        return edgestore.videos;
      case 'assessment':
        return edgestore.assessments;
      case 'game':
      case 'wordwall':
        return edgestore.games;
      case 'image':
        return edgestore.images;
      default:
        return edgestore.publicFiles;
    }
  };

  const bucket = getBucket();

  const uploadFn: UploadFn = React.useCallback(
    async ({ file, onProgressChange, signal }) => {
      try {
        const res = await bucket.upload({
          file,
          signal,
          onProgressChange,
          options: {
            temporary: false,
          },
        });

        // Store the URL and file info
        setUploadedUrls(prev => [...prev, res.url]);
        
        const fileInfo: UploadedFile = {
          url: res.url,
          name: file.name,
          size: file.size,
          type: file.type,
        };
        
        setUploadedFiles(prev => [...prev, fileInfo]);

        // Call the callback with all uploaded URLs and files
        const newUrls = [...uploadedUrls, res.url];
        const newFiles = [...uploadedFiles, fileInfo];
        
        onUploadComplete(newUrls, newFiles);

        console.log('Upload successful:', res);
        return res;
      } catch (error) {
        console.error('Upload failed:', error);
        throw error;
      }
    },
    [bucket, uploadedUrls, uploadedFiles, onUploadComplete]
  );

  // For single image upload (thumbnails, etc.)
  if (contentType === 'image') {
    return (
      <UploaderProvider uploadFn={uploadFn} autoUpload>
        <SingleImageDropzone
          height={200}
          width={200}
          dropzoneOptions={{
            maxSize: 1024 * 1024 * 10, // 10MB
          }}
        />
      </UploaderProvider>
    );
  }

  // For multiple file upload (worksheets, videos, etc.)
  return (
    <UploaderProvider uploadFn={uploadFn} autoUpload>
      <FileUploader
        maxFiles={maxFiles}
        maxSize={
          contentType === 'mindstamp' ? 1024 * 1024 * 500 : // 500MB for videos
          contentType === 'worksheet' ? 1024 * 1024 * 50 :  // 50MB for PDFs
          1024 * 1024 * 100 // 100MB default
        }
        accept={
          contentType === 'worksheet' ? { 'application/pdf': ['.pdf'] } :
          contentType === 'mindstamp' ? { 'video/*': ['.mp4', '.webm', '.mov'] } :
          contentType === 'assessment' ? { 
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
          } :
          contentType === 'game' ? {
            'application/zip': ['.zip'],
            'application/json': ['.json'],
            'image/*': ['.png', '.jpg', '.jpeg']
          } :
          { '*/*': [] } // Accept all for other types
        }
      />
    </UploaderProvider>
  );
}