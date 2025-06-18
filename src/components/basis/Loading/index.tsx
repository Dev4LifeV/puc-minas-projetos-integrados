import dynamic from "next/dynamic";
import animationData from "../../../../public/loading.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Lottie
        style={{ width: "10rem", height: "10rem" }}
        animationData={animationData}
      />
    </div>
  );
}
