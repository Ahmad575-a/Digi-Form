import Blob from "../Shapes/Blob";
import "../Styles/BlobSection.css";

const BlobSection = () => {
  return (
    <section className="blobSection">
      <div className="blobRow">
        <div className="blobCard">
          <Blob width={220} color="#6b6f82">
            <div className="blobInnerText">
              <p>Dokumente</p>
              <p>ansehen & verwalten</p>
            </div>
          </Blob>
        </div>

        <div className="blobCard">
          <Blob width={300} color="#6b6f82">
            <div className="blobInnerText">
              <p>Schnell</p>
              <p>herunterladen als pdf</p>
            </div>
          </Blob>
        </div>

        <div className="blobCard">
          <Blob width={220} color="#6b6f82">
            <div className="blobInnerText">
              <p>Digital</p>
              <p>signieren & abgeben</p>
            </div>
          </Blob>
        </div>
      </div>
    </section>
  );
};

export default BlobSection;
