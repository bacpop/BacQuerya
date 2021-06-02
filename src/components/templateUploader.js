import React from "react";
import { useDropzone } from "react-dropzone";

import "../CSS/templateUploader.css"

const getClassName = (className, isActive) => {
  if (!isActive) return className;
  return `${className} ${className}-active`;
};

const DropZone = ({ onDrop, DOI }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <div className={getClassName("dropzone", isDragActive)} {...getRootProps()}>
      <input className="dropzone-input" {...getInputProps()} />
      <div className="text-center">
        {isDragActive ? (
          <div id="dropzone-active" className="dropzone-content" >Release to upload the file</div>
        ) : (
          <div id="dropzone-inactive" className="dropzone-content">
            Drag and drop or click to upload "{DOI}.csv"
          </div>
        )}
      </div>
    </div>
  );
};

export default DropZone;