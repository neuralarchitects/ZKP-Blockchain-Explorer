import React, { useState, useEffect } from "react";
import "./style.scss";
import { Skeleton } from "@mui/material";

const ImageLoader = ({
  src,
  alt,
  className = "",
  height,
  width,
  defaultImage = "", // Default image path
  timeout = 5000, // Timeout in milliseconds (e.g., 5000ms = 5 seconds)
  ...rest
}) => {
  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    setImageSrc(src);
  }, [src]);

  useEffect(() => {
    // Set a timeout to handle cases where the image takes too long to load
    const timer = setTimeout(() => {
      if (loading) {
        setImageSrc(defaultImage); // Fallback to default image if loading takes too long
        setLoading(false);
      }
    }, timeout);

    return () => clearTimeout(timer); // Clear the timeout when the component unmounts
  }, [loading, timeout, defaultImage]);

  const handleImageLoaded = () => {
    if (imageSrc != defaultImage) {
      setImageSrc(src);
    }
    setLoading(false);
  };

  const handleImageError = () => {
    setImageSrc(defaultImage); // Fallback to default image on error
    setLoading(false);
  };

  return (
    <>
      {loading && (
        <Skeleton
          sx={{ bgcolor: "grey.800" }}
          variant="rounded"
          animation={"pulse"}
          width={width ? width : "100px"}
          height={height ? height : "100px"}
          className={`${className}`}
          {...rest} // Pass all remaining props to the Skeleton
        />
      )}

      <img
        src={imageSrc || defaultImage}
        alt={alt}
        onLoad={handleImageLoaded}
        onError={handleImageError}
        className={`${!loading && className} image ${loading ? "hidden" : ""}`}
        {...rest} // Pass all remaining props to the img
      />
    </>
  );
};

export default ImageLoader;
