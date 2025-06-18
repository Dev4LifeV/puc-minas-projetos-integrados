import { User } from "firebase/auth";
import { auth } from "@/firebase-config";
import { useAppCheck } from "@/components/basis/AppCheckProvider";

type CompressionErrorResponse = {
  error?: string;
  message?: string;
};

export function useCompressImage() {
  const { appCheck } = useAppCheck();

  const compress = async (file: File): Promise<Blob> => {
    const user: User | null = auth.currentUser;

    if (!user) throw new Error("Not authenticated");

    try {
      const idToken = await user.getIdToken();

      const formData: FormData = new FormData();
      formData.append("file", file);

      const response: Response = await fetch("/api/compress-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData: CompressionErrorResponse = await response.json();
        throw new Error(
          errorData.error ||
            errorData.message ||
            `HTTP error! status: ${response.status}`
        );
      }

      return await response.blob();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Image compression failed: ${error.message}`);
      }
      throw new Error("Unknown error occurred during image compression");
    }
  };

  return compress;
}
