import "./ItemCard.css";

function ItemCard({ item, onCardClick }) {
  return (
    <li className="item-card">
      <h2 className="item-card__title">{item.name}</h2>
      <img
        onClick={() => onCardClick(item)}
        className="item-card__image"
        src={item.link}
        alt={item.name}
      />
    </li>
  );
}

export default ItemCard;
