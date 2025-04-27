import "./ItemCard.css";
import likeActive from "../../assets/like-active.svg";
import likeInactive from "../../assets/like-inactive.svg";

function ItemCard({ item, onCardClick, currentUser, onCardLike, isLoggedIn }) {
  function handleLike(event) {
    event.preventDefault();
    event.stopPropagation();
    onCardLike(item);
  }
  // function handleDelete() {
  //   console.log("Delete button clicked");
  //   onDelete(item);
  // }

  return (
    <li className="item-card">
      <div onClick={() => onCardClick(item)}>
        <h2 className="item-card__title">{item.name}</h2>
        <img className="item-card__image" src={item.imageUrl} alt={item.name} />
      </div>
      <div className="item-card__controls">
        {isLoggedIn && (
          <button
            type="button"
            className="item-card__like-button"
            onClick={handleLike}
            style={{
              backgroundImage: `url(${
                item.isLiked ? likeActive : likeInactive
              })`,
            }}
          />
        )}
        {/* {isLoggedIn && currentUser?._id === item.owner && (
          <button
            type="button"
            className="item-card__delete-button"
            onClick={handleDelete}
          />
        )} */}
      </div>
    </li>
  );
}
export default ItemCard;
