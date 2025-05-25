import "./ItemCard.css";
import likeActive from "../../assets/like-active.svg";
import likeInactive from "../../assets/like-inactive.svg";
import { useContext } from "react";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";

function ItemCard({ item, onCardClick, onCardLike, isLoggedIn }) {
  function handleCardClick() {
    console.log("Card clicked!", item);
    onCardClick(item);
  }
  function handleLike(event) {
    event.preventDefault();
    event.stopPropagation();
    console.log("handleLike called in ItemCard");
    console.log("Current user in ItemCard:", currentUser);
    console.log("isLoggedIn status:", isLoggedIn);
    onCardLike(item);
  }
  // function handleDelete() {
  //   console.log("Delete button clicked");
  //   onDelete(item);
  // }
  console.log(item);
  console.log("Current item liked status:", item.isLiked);
  console.log("Full item data:", item);

  const { currentUser } = useContext(CurrentUserContext);
  return (
    <li className="item-card">
      <div onClick={() => onCardClick(item)}>
        <div className="item-card__title-container">
          <h2 className="item-card__title">{item.name}</h2>
          {isLoggedIn && (
            <button
              type="button"
              className="item-card__like-button_inactive"
              onClick={handleLike}
              style={{
                backgroundImage: `url(${
                  item.isLiked ? likeActive : likeInactive
                })`,
              }}
            />
          )}
        </div>
        <img className="item-card__image" src={item.imageUrl} alt={item.name} />
      </div>
    </li>
  );
}
export default ItemCard;
