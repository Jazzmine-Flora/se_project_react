// import { defaultClothingItems } from "../../utils/constants";
import items from "../../db.json";
import ItemCard from "../ItemCard/ItemCard";
import "./ClothesSection.css";

function ClothesSection({ onCardClick }) {
  return (
    <div className="clothes-section">
      <div className="clothes-section__header">
        <p className="clothes-section__title">Your Items</p>
        <button className="clothes-section__add-btn">+ Add New</button>
      </div>
      <ul className="clothes-section__list">
        {items.map((item) => {
          return (
            <ItemCard
              key={item._id}
              item={item}
              // todo pass as prop
              onCardClick={onCardClick}
            />
          );
        })}
      </ul>
    </div>
  );
}

export default ClothesSection;
