import {
  ChangeEvent,
  ComponentProps,
  useEffect,
  useRef,
  useState,
} from "react";
import { crossRemove, fileInput, picker, placeholderStyle } from "./style.css";

import { default as Image } from "next/image";
import { Typography } from "../Typography";

export default function ImagePicker({
  defaultImage,
  placeholder,
  onChange,
  onRemove,
  ...props
}: ComponentProps<"input"> & { defaultImage?: string; onRemove?: () => void }) {
  const [image, setImage] = useState<string | undefined>(defaultImage);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  useEffect(() => {
    setImage(defaultImage);
  }, [defaultImage]);

  return (
    <label className={picker}>
      {onRemove && image && image.length > 0 && (
        <a
          href=""
          onClick={(e) => {
            e.preventDefault();
            if (onRemove) onRemove();
          }}
          className={crossRemove}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#FFFFFF"
          >
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </svg>
        </a>
      )}
      {image && image !== null && image.length > 0 ? (
        <Image
          ref={imageRef}
          priority
          src={image!}
          alt="Imagem"
          height={400}
          width={400}
          style={{
            height: "25.9rem",
            width: "100%",
            objectFit: "contain",
          }}
        />
      ) : (
        <Typography.DisplayMediumBold className={placeholderStyle}>
          {placeholder}
        </Typography.DisplayMediumBold>
      )}
      <input
        {...props}
        className={fileInput}
        type="file"
        accept=".jpeg,.jpg,.png"
        onChange={(event) => {
          handleImage(event);
          if (onChange) onChange(event);
        }}
      />
    </label>
  );
}
