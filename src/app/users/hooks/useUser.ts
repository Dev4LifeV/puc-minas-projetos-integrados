import { errorMessage, successMessage } from "@/utils/texts";
import { useCallback, useEffect, useState } from "react";

import { Collections } from "@/helpers/firestore/collections";
import { User } from "@/helpers/firestore/model/admin/user";
import { useAuthGuard } from "@/components/basis/AuthGuardProvider";
import useFirebase from "@/helpers/firestore/hooks/useFirebase";

export default function useUser() {
  const { set, get, remove } = useFirebase();
  const { currentUser: loggedUser } = useAuthGuard();

  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const collection = Collections.Usuarios;

  const getUser = useCallback(async () => {
    setError(null);
    await get({
      collection: collection,
      transformer: (data) =>
        new User(data.id, data.email, data.name, data.isAdmin),
      onData: (users) => {
        setUsers(users);
        setCurrentUser(
          users.filter(({ email }: User) => email === loggedUser?.email)[0]
        );
        setLoading(false);
      },
      onError: () => {
        setError(errorMessage("ao obter os usuários"));
        setLoading(false);
      },
    });
  }, [collection, get, loggedUser?.email]);

  useEffect(() => {
    if (loggedUser) {
      getUser();
    }
  }, [getUser, loggedUser]);

  const setUser = useCallback(
    async (user: User) => {
      {
        setError(null);
        await set({
          collection: collection,
          onError: () => {
            setError(errorMessage("ao adicionar o usuário"));
            setLoading(false);
          },
          onSuccess: () => {
            setSuccess(successMessage("Usuário adicionado"));
            setUsers((u) => [...u, user]);
            setLoading(false);
          },
          body: user,
        });
      }
    },
    [collection, set]
  );

  const removeUser = useCallback(
    async (id: string) => {
      setError(null);
      await remove({
        collection: collection,
        id,
        data: users,
        onData: setUsers,
        onError: () => {
          setError(errorMessage("ao remover o usuário"));
          setLoading(false);
        },
        onSuccess: () => {
          setSuccess(successMessage("Usuário removido"));
          setLoading(false);
        },
      });
    },
    [collection, remove, users]
  );

  return {
    setUser,
    removeUser,
    loading,
    error,
    success,
    users,
    currentUser,
  };
}
