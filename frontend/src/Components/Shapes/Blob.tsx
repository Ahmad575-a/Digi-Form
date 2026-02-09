import "../Styles/Blob.css";

type BlobProps = {
  width?: number;
  color?: string;
  children?: React.ReactNode;
};

const Blob = ({ width = 220, color = "#6b6f82", children }: BlobProps) => {
  return (
    <div
      className="blob"
      style={
        {
          ["--blob-w" as any]: `${width}px`,
          ["--blob-color" as any]: color,
        } as React.CSSProperties
      }
    >
      <div className="blobContent">{children}</div>
    </div>
  );
};

export default Blob;
