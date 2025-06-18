import { errorMessage, successMessage } from "@/utils/texts";
import { useEffect, useState } from "react";

import { Collections } from "@/helpers/firestore/collections";
import useFirebase from "@/helpers/firestore/hooks/useFirebase";
import Campaign from "@/helpers/firestore/model/campaign/campaign";
import { Folders } from "@/helpers/storage/folders";
import useStorage from "@/helpers/storage/hooks/useStorage";
import { useCompressImage } from "@/hooks/useCompressImage";

export default function useCampaigns() {
  const { upload, remove: removeStorage } = useStorage(Folders.Campanhas);
  const { set, get, remove: removeFirebase } = useFirebase();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<Map<string, Campaign>>(new Map());

  const compress = useCompressImage();

  const collection = Collections.Campanhas;

  let data: Campaign[] = [];

  useEffect(() => {
    setError(null);
    setLoading(true);
    get({
      collection: collection,
      transformer: (data) => new Campaign(data.id, data.campaignDownloadUrl),
      onData: (campaigns: Campaign[]) => {
        const updatedCampaigns = new Map<string, Campaign>();
        campaigns.forEach((c) => updatedCampaigns.set(c.id, c));
        setCampaigns(updatedCampaigns);
        setLoading(false);
      },
      onError: () => {
        setError(errorMessage("ao obter as campanhas"));
        setLoading(false);
      },
    });
  }, [get, collection]);

  const deleteCampaign = async (id: string) => {
    setSuccess(null);
    setLoading(true);
    setError(null);

    return await removeStorage({
      id: id,
      onError: () => {
        setError(errorMessage("ao remover a campanha."));
        setLoading(false);
      },
      onSuccess: async () => {
        removeFirebase({
          id: id,
          onSuccess: () => {
            setSuccess(successMessage("Campanha removida"));
            setLoading(false);
          },
          onError: () => {
            setError(errorMessage("ao remover a campanha"));
            setLoading(false);
          },
          onData: () => {
            const updatedCampaigns = campaigns;
            updatedCampaigns.delete(id);
            setCampaigns(updatedCampaigns);
            data = [];
            campaigns.forEach((v, k) => data.push(v));
          },
          collection: collection,
          data: data,
        });
      },
    });
  };

  const save = async (id: string, file?: File) => {
    setSuccess(null);

    setLoading(true);
    setError(null);

    if (file !== undefined) {
      const compressedBlob = await compress(file);

      const compressedFile = new File([compressedBlob], file.name, {
        type: compressedBlob.type,
      });

      return await upload({
        id: id,
        file: compressedFile,
        onError: () => {
          setError(errorMessage("ao cadastrar campanha."));
          setLoading(false);
        },
        onSuccess: async (imagePath) => {
          set({
            onSuccess: () => {
              setSuccess(successMessage("Campanha cadastrada"));
              const updatedCampaigns = campaigns;
              updatedCampaigns.set(id, new Campaign(id, imagePath));
              setCampaigns(updatedCampaigns);
              setLoading(false);
            },
            onError: () => {
              setError(errorMessage("ao cadastrar a campanha"));
              setLoading(false);
            },
            collection,
            body: new Campaign(id, imagePath),
          });
        },
      });
    }
  };
  return { deleteCampaign, save, success, loading, error, campaigns };
}
