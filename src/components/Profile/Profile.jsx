import ClothesSection from "../ClothesSection/ClothesSection";
import SideBar from "../SideBar/SideBar";
import "./Profile.css";

function Profile({
  handleCardClick,
  clothingItems,
  handleAddClick,
  onAddItem,
  onEditProfile,
  onLogout,
  onCardLike,
  isLoggedIn,
}) {
  return (
    <div className="profile">
      <section className="profile__sidebar">
        <SideBar onEditProfile={onEditProfile} onLogout={onLogout} />
      </section>
      <section className="profile__content">
        <ClothesSection
          onAddItem={onAddItem}
          onCardClick={handleCardClick}
          clothingItems={clothingItems}
          onCardLike={onCardLike}
          isLoggedIn={isLoggedIn}
        />
      </section>
    </div>
  );
}

export default Profile;
