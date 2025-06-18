"use client";
import {
  container,
  imageContainer,
  loginContainer,
  loginContent,
  welcomeBackTitle,
} from "./style.css";

import GoogleButton from "@/components/basis/Button/GoogleButton";
import LinkButton from "@/components/basis/LinkButton";
import { Typography } from "@/components/basis/Typography";
import useAuth from "@/hooks/useAuth";
import useMediaQuery from "@/hooks/useMediaQuery";
import { viewPort } from "@/theme/constants";
import Image from "next/image";

export default function SignIn() {
  const matchMedia = useMediaQuery(viewPort.small);

  const { handleLogin } = useAuth();

  return (
    <main className={container}>
      {matchMedia ? null : (
        <Image
          className={imageContainer}
          alt="Logo ECO"
          src="/login_hero_image.png"
          height={0}
          width={2280}
          style={{
            objectFit: "cover",
            height: "100%",
            width: "100%",
          }}
          draggable={false}
          priority
        />
      )}

      <div className={loginContainer}>
        <div className={loginContent}>
          <Image
            alt="Logo ECO"
            src="/logo.png"
            draggable={false}
            width={128}
            height={128}
            priority
          />
          <Typography.TitleLight className={welcomeBackTitle}>
            Bem vindo de volta!
          </Typography.TitleLight>
          <Typography.TitleLight>
            É sempre bom vê-lo novamente.
          </Typography.TitleLight>
          <GoogleButton action={handleLogin} />
          <LinkButton href="https://wa.me/5551991672281?text=Preciso%20de%20ajuda%20com%20o%20Eco%20Delivery.">
            Precisa de ajuda?
          </LinkButton>
        </div>
      </div>
    </main>
  );
}
