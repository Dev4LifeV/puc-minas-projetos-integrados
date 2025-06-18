import {
  deleteObject,
  getDownloadURL,
  getStorage,
  list,
  ref,
  uploadBytes,
} from "firebase/storage";

import { Folders } from "../folders";
import { app } from "@/firebase-config";

interface UploadParams {
  id: string;
  file?: File;
  onSuccess?: (fullPath?: string) => void;
  onError: () => void;
}

export default function useStorage(folder: Folders) {
  const storage = getStorage(app);

  storage.maxOperationRetryTime = 0;
  storage.maxUploadRetryTime = 0;

  const upload = async ({ file, id, onError, onSuccess }: UploadParams) => {
    try {
      if (!file) return;

      const fileType = file.name.split(".").pop();
      const storageRef = ref(storage, `${folder}${id}.${fileType}`);

      const res = await uploadBytes(storageRef, file);

      if (res.ref.fullPath.length > 0) {
        const downloadUrl = await getDownloadURL(storageRef);
        if (onSuccess !== undefined) return onSuccess(downloadUrl);
      }

      throw Error("An error occurred trying to upload the file.");
    } catch (error) {
      console.error(error);
      onError();
    }
  };

  const remove = async ({ id, onError, onSuccess }: UploadParams) => {
    try {
      const objects = await list(ref(storage, `${folder}`));

      objects.items.forEach(async (i) => {
        if (i.name.startsWith(id)) {
          await deleteObject(ref(storage, i.fullPath));
        }
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      onError();
    }
  };

  return { upload, remove };
}
