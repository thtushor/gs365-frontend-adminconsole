import React from "react";

const ThumbnailImage = ({
  src,
  alt = "thumbnail",
  size = 40,
  rounded = true,
  className = "",
  ...props
}) => {
  const [imgSrc, setImgSrc] = React.useState(src);
  const [isLoaded, setIsLoaded] = React.useState(true);

  React.useEffect(() => {
    setImgSrc(src);
    setIsLoaded(true);
  }, [src]);

  if (!imgSrc || !isLoaded) {
    return (
      <div
        className={`
          bg-gradient-to-br from-gray-200 to-gray-300 
          border border-gray-300 shadow-sm 
          flex items-center justify-center 
          ${rounded ? "rounded" : ""} 
          ${className}
        `}
        style={{ width: size, height: size }}
        aria-label={alt}
        {...props}
      >
        {/* SVG icon for photo/user */}
        <svg
          width={size * 0.5}
          height={size * 0.5}
          viewBox="0 0 24 24"
          fill="none"
          className="opacity-50"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="8" r="4" fill="#a0aec0" />
          <rect x="4" y="16" width="16" height="6" rx="3" fill="#a0aec0" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      width={size}
      height={size}
      className={`${
        rounded ? "rounded" : ""
      } object-cover border bg-gray-100 shadow-sm ${className}`}
      style={{ width: size, height: size }}
      onError={() => setIsLoaded(false)}
      {...props}
    />
  );
};

export default ThumbnailImage;
