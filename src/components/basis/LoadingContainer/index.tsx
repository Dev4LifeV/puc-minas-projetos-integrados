import Loading from "../Loading";
import { PropsWithChildren } from "react";
import { Typography } from "../Typography";
import { loadingContainer } from "./style.css";

interface LoadingContainerProps {
  error: boolean;
  loading: boolean;
  isEmpty?: boolean;
  emptyComponent?: React.ReactNode;
  emptyMessage?: string;
}
export default function LoadingContainer({
  error,
  loading,
  isEmpty = false,
  emptyComponent,
  emptyMessage,
  children,
}: PropsWithChildren<LoadingContainerProps>) {
  if (loading && !error) {
    return (
      <div className={loadingContainer}>
        <Loading />
      </div>
    );
  }

  if (!loading && error) {
    return (
      <div className={loadingContainer}>
        <Typography.TitleBold>
          Desculpe-nos, parece que algo de errado aconteceu. Por favor,
          recarregue a página e tente novamente. Se o erro persistir, contate o
          suporte.
        </Typography.TitleBold>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          gap: "2rem",
        }}
      >
        {emptyMessage}
        {emptyComponent}
      </div>
    );
  }

  return children;
}
