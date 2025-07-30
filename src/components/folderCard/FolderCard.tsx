import "./FolderCard.css";

type FolderProps = {
  title: string;
  onClick: () => void;
  isSelected: boolean;
};

export const FolderCard = ({ title, onClick, isSelected }: FolderProps) => {
  return (
    <div className={`folder-card ${isSelected ? "selected" : ""}`}>
      <button className="folder-card-button" onClick={onClick}>
        {title}
      </button>
    </div>
  );
};
