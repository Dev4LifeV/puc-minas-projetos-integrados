"use client";

import { PropsWithChildren, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Collections } from "@/helpers/firestore/collections";
import { FirebaseError } from "firebase/app";
import { Typography } from "./Typography";
import { User } from "firebase/auth";
import { User as UserModel } from "@/helpers/firestore/model/admin/user";
import { auth } from "@/firebase-config";
import { loadingContainer } from "./LoadingContainer/style.css";
import toast from "react-hot-toast";
import { useAuthGuard } from "./AuthGuardProvider";
import useFirebase from "@/helpers/firestore/hooks/useFirebase";
import { useNetworkState } from "@uidotdev/usehooks";

export default function AuthGuard({ children }: PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();
  const { getBy } = useFirebase();

  const { setCurrentUser } = useAuthGuard();

  const { online } = useNetworkState();

  useEffect(() => {
    auth.beforeAuthStateChanged(async (user) => {
      if (user === null) {
        toast.dismiss();
        return;
      }

      await getBy({
        id: user?.email ?? "",
        collection: Collections.Usuarios,
        onData: (data?: User) => {
          console.log("User exists: ", data);
          if (!data) {
            toast.dismiss();
            toast.error("Usuário não possui permissão para acessar o sistema.");
            throw new FirebaseError("user-not-found", "User does not exist");
          }
        },
        onError: () => {
          throw new FirebaseError("user-not-found", "User does not exist");
        },
        transformer: (data) =>
          new UserModel(data?.id, data?.email, data?.userName, data?.isAdmin),
      });
    });
  }, [getBy]);

  useEffect(() => {
    let isMounted = true;

    console.log("AuthGuard Effect triggered. Pathname:", pathname);

    // With signInWithPopup, we primarily rely on onAuthStateChanged
    // to detect the user's state after the popup closes or on initial load.
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log(
        "AuthGuard: onAuthStateChanged triggered.",
        user?.uid || null
      );
      if (!isMounted) return;

      if (user && user.uid) {
        setCurrentUser(user);
        // User is signed in
        console.log("AuthGuard: User is signed in.");
        // If user is logged in and tries to access the login page, redirect them away
        if (pathname === "/") {
          console.log("AuthGuard: User on login page, redirecting to /home");
          router.push("/home");
        }
      } else {
        // User is signed out
        console.log("AuthGuard: User is signed out.");
        // If user is not logged in and not on the login page, redirect to login
        if (pathname !== "/") {
          console.log("AuthGuard: User not on login page, redirecting to /");
          router.push("/");
        }
      }
    });

    // Cleanup function
    return () => {
      console.log("AuthGuard unmounting or dependencies changed.");
      isMounted = false;
      unsubscribe();
    };
  }, [router, pathname, setCurrentUser]); // Dependencies remain the same
  // If not loading, render the children (protected content)
  // The redirection logic inside useEffect handles unauthorized access.

  return (
    <>
      {online ? (
        children
      ) : (
        <div className={loadingContainer}>
          <Typography.TitleBold>
            Você está sem internet. Por favor, verifique sua conexão e tente
            novamente.
          </Typography.TitleBold>
        </div>
      )}
    </>
  );
}
