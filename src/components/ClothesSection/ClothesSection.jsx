// import { defaultClothingItems } from "../../utils/constants";

import ItemCard from "../ItemCard/ItemCard";

import "./ClothesSection.css";

function ClothesSection({
  onCardClick,
  clothingItems,
  onAddItem,
  onCardLike,
  isLoggedIn,
}) {
  return (
    <div className="clothes-section">
      <div className="clothes-section__header">
        <p className="clothes-section__title">Your Items</p>
        <button
          className="clothes-section__add-btn"
          type="button"
          onClick={onAddItem}
        >
          + Add New
        </button>
      </div>
      <ul className="clothes-section__list">
        {clothingItems.map((item) => (
          <ItemCard
            key={item._id}
            item={item}
            onCardClick={onCardClick}
            onCardLike={onCardLike}
            isLoggedIn={isLoggedIn}
          ></ItemCard>
        ))}
      </ul>
    </div>
  );
}

export default ClothesSection;
