import { DocumentNode } from 'graphql';
import { useMutation } from '@apollo/react-hooks';
import { useState } from 'react';

export type UploadStatus = 'uploading' | 'success' | 'failure';

export const useUpload = (query: DocumentNode) => {
  const [progress, setProgress] = useState<number>();
  const [mutate] = useMutation(query);

  const [filesMap, setFiles] = useState(new Map<File, UploadStatus>());

  const updateFiles = (k: File, v: UploadStatus) => {
    setFiles(new Map(filesMap.set(k, v)));
  };

  const upload = (file: File) => {
    alert(1)
    updateFiles(file, 'uploading');
    // Array.from(file).forEach(f => updateFiles(f, 'uploading'));
    mutate({
      variables: { file: { image: file } },
      context: {
        fetchOptions: {
          onUploadProgress: (progress: number) => setProgress(progress)
        }
      }
    });
  };

  return { upload, progress, filesMap };
};
