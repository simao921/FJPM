import { useEffect, useState } from "react";

export function useProductImage(image) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (!image) {
      setUrl("");
      return undefined;
    }
    if (typeof image === "string") {
      setUrl(image);
      return undefined;
    }
    const objectUrl = URL.createObjectURL(image);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);
  return url;
}
