import { Button, IconButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import React from "react";

const DownloadButton = ({ url, filename, size }) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  return (
    <>
      {size === "small" ? (
        <IconButton>
          <DownloadIcon />
        </IconButton>
      ) : (
        <Button
          endIcon={<DownloadIcon />}
          color='info'
          onClick={handleDownload}>
          Download
        </Button>
      )}
    </>
  );
};

export default DownloadButton;
