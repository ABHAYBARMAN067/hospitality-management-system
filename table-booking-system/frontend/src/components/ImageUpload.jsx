import { useState, useRef } from 'react';


const ImageUpload = ({
  onImageUpload,
  onImageRemove,
  images = [],
  maxImages = 10,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  maxSize = 5 * 1024 * 1024 // 5MB
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);

    // Validate number of images
    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    setError('');
    setUploading(true);

    try {
      for (const file of files) {
        // Validate file type
        if (!acceptedTypes.includes(file.type)) {
          throw new Error(`File type not supported: ${file.name}`);
        }

        // Validate file size
        if (file.size > maxSize) {
          throw new Error(`File too large: ${file.name} (max ${maxSize / 1024 / 1024}MB)`);
        }

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);

        // Call parent callback
        if (onImageUpload) {
          await onImageUpload(file, previewUrl);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = async (index) => {
    try {
      if (onImageRemove) {
        await onImageRemove(index);
      }
    } catch (err) {
      setError('Error removing image');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length > 0) {
      // Create a synthetic event for file input
      const syntheticEvent = {
        target: { files: imageFiles }
      };
      await handleFileSelect(syntheticEvent);
    }
  };

  return (
    <div className="image-upload-container">
      <div className="upload-header">
        <h3>Upload Images</h3>
        <p className="upload-info">
          {images.length}/{maxImages} images • Max {maxSize / 1024 / 1024}MB each
        </p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div
        className={`upload-dropzone ${uploading ? 'uploading' : ''}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <div className="upload-content">
          {uploading ? (
            <div className="uploading-indicator">
              <div className="spinner"></div>
              <p>Uploading...</p>
            </div>
          ) : (
            <div className="upload-prompt">
              <div className="upload-icon">📁</div>
              <p>Click to select images or drag and drop</p>
              <p className="upload-formats">
                Supported: JPG, PNG, GIF, WebP
              </p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          disabled={uploading}
        />
      </div>

      {images.length > 0 && (
        <div className="image-preview-grid">
          {images.map((image, index) => (
            <div key={index} className="image-preview-item">
              <div className="image-preview">
                <img
                  src={image.url || image.preview}
                  alt={image.alt || `Image ${index + 1}`}
                  onError={(e) => {
                    e.target.src = '/placeholder-image.png';
                  }}
                />
                <div className="image-overlay">
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => handleRemoveImage(index)}
                    title="Remove image"
                  >
                    ×
                  </button>
                </div>
              </div>
              {image.alt && (
                <p className="image-caption">{image.alt}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
