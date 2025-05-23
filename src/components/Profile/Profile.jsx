import ClothesSection from "../ClothesSection/ClothesSection";
import SideBar from "../SideBar/SideBar";
import "./Profile.css";

function Profile({
  onCardClick,
  clothingItems,
  handleAddClick,
  onAddItem,
  onEditProfile,
  onLogout,
  onCardLike,
  isLoggedIn,
  currentUser,
}) {
  return (
    <div className="profile">
      <section className="profile__sidebar">
        <SideBar
          onEditProfile={onEditProfile}
          onLogout={onLogout}
          currentUser={currentUser}
        />
      </section>
      <section className="profile__content">
        <ClothesSection
          onAddItem={handleAddClick}
          onCardClick={onCardClick}
          clothingItems={clothingItems}
          onCardLike={onCardLike}
          isLoggedIn={isLoggedIn}
        />
      </section>
    </div>
  );
}

export default Profile;
