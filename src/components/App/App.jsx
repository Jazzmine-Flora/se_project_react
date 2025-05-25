import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";
import Header from "../Header/Header";
import Main from "../Main/Main";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import ItemModal from "../ItemModal/ItemModal";
import Profile from "../Profile/Profile";
import { getWeather, filterWeatherData } from "../../utils/weatherApi";
import { coordinates, APIkey } from "../../utils/constants";
import Footer from "../Footer/Footer";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";
import AddItemModal from "../AddItemModal/AddItemModal";
import DeleteItemModal from "../DeleteItemModal/DeleteItemModal";
import { Api, api, baseUrl } from "../../utils/api";
import RegisterModal from "../RegisterModal/RegisterModal";
import LoginModal from "../LoginModal/LoginModal";
import * as auth from "../../utils/auth";
import { register } from "../../utils/auth";
import { CurrentUserProvider } from "../../contexts/CurrentUserContext";
import ProtectedRoute from "../ProtectedRoute";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "../EditProfileModal/EditProfileModal";

function App() {
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState({
    type: "",
    temp: { F: 999 },
    city: "",
  });
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState({});
  console.log("App - selectedCard state:", selectedCard);
  const [currentTemperatureUnit, setCurrentTemperatureUnit] = useState("F");
  const [clothingItems, setClothingItems] = useState([]);
  const [items, setItems] = useState([]);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  const checkToken = () => {
    const jwt = localStorage.getItem("jwt");
    console.log("Checking token:", jwt);

    if (!jwt) {
      setIsLoading(false);
      setIsLoggedIn(false);
      setCurrentUser(null);
      return Promise.resolve();
    }

    return auth
      .checkToken(jwt)
      .then((res) => {
        console.log("Token check response:", res);
        if (res && res.data) {
          const userData = res.data;
          setIsLoggedIn(true);
          setCurrentUser(userData);
          return api.getItems().then((items) => ({ items, userData }));
        } else {
          throw new Error("Invalid token response");
        }
      })
      .then(({ items, userData }) => {
        if (items) {
          const itemsWithLikedProperty = items.map((item) => ({
            ...item,
            isLiked: item.likes.some((id) => id === userData._id),
          }));
          setClothingItems(itemsWithLikedProperty);
        }
      })
      .catch((err) => {
        console.error("Token validation error:", err);
        localStorage.removeItem("jwt");
        setIsLoggedIn(false);
        setCurrentUser(null);
        setClothingItems([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    checkToken();
  }, []);

  const handleEditProfile = () => {
    setIsEditProfileModalOpen(true);
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      console.log("Updating profile with:", updatedData);
      const userData = await api.updateProfile(updatedData);
      console.log("Profile update response:", userData);

      if (userData) {
        setCurrentUser(userData);
        setIsEditProfileModalOpen(false);
      } else {
        throw new Error("No user data received");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleLogin = () => {
    setIsLoginModalOpen(true);
  };
  const handleLoginSubmit = async (values) => {
    const { email, password } = values;
    try {
      setIsLoading(true);
      const loginResponse = await auth.login({ email, password });

      if (!loginResponse || !loginResponse.token) {
        throw new Error("Invalid login response");
      }

      // Store token
      localStorage.setItem("jwt", loginResponse.token);

      // Get full user profile using checkToken
      const userResponse = await auth.checkToken(loginResponse.token);
      const userData = userResponse.data;

      // Update user state
      setIsLoggedIn(true);
      setCurrentUser(userData);

      // Get items with updated likes
      const items = await api.getItems();
      const itemsWithLikedProperty = items.map((item) => ({
        ...item,
        isLiked: item.likes.some((id) => id === userData._id),
      }));

      // Update items state
      setClothingItems(itemsWithLikedProperty);
      setIsLoginModalOpen(false);

      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setIsLoggedIn(false);
      setCurrentUser(null);
      setClothingItems([]);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = (values) => {
    const { name, avatar, email, password } = values;
    return register({ name, avatar, email, password }) // Add 'return' here
      .then((res) => {
        setIsRegisterModalOpen(false);
        return handleLoginSubmit({ email, password }); // Return the login promise
      })
      .catch((err) => {
        console.error(err);
        throw err; // Re-throw the error to be caught in RegisterModal
      });
  };

  const handleLoginClick = () => {
    setIsRegisterModalOpen(false); // Close register modal
    setIsLoginModalOpen(true); // Open login modal
  };

  const handleSignupClick = () => {
    setIsLoginModalOpen(false); // Close login modal
    setIsRegisterModalOpen(true); // Open register modal
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setActiveModal("preview");
  };

  const handleAddClick = () => {
    setActiveModal("add-garment");
  };

  const handleCloseModal = () => {
    setActiveModal("");
  };

  const handleToggleSwitchChange = () => {
    if (currentTemperatureUnit === "C") setCurrentTemperatureUnit("F");
    if (currentTemperatureUnit === "F") setCurrentTemperatureUnit("C");
  };

  const handleAddItemSubmit = (itemData) => {
    console.log("Received itemData:", itemData);
    // Make sure itemData only contains the necessary fields
    const { name, imageUrl, weather } = itemData;

    const cleanedItemData = {
      name,
      imageUrl,
      weather,
    };

    console.log("About to make API call with data:", cleanedItemData);

    api
      .addItem(cleanedItemData)
      .then((newItem) => {
        console.log("Response from API:", newItem);
        const newItemWithLiked = {
          ...newItem.data,
          isLiked: false,
        };
        setClothingItems([newItemWithLiked, ...clothingItems]);
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Full error object:", error);
        console.error("Error response data:", error.response?.data);
        console.error("Error status:", error.response?.status);
      });
  };
  const onAddItem = () => {
    setActiveModal("add-garment");
  };

  const handleDeleteItem = () => {
    // Store the entire card object
    setActiveModal("delete");
  };
  const handleOnConfirmDelete = () => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      console.error("No JWT token found");
      return;
    }

    if (!currentUser) {
      console.error("No current user found");
      return;
    }

    if (!selectedCard?._id) {
      console.error("No selected card ID found");
      return;
    }

    // Add these debug logs
    console.log("Attempting to delete card:", {
      cardId: selectedCard._id,
      cardOwner: selectedCard.owner,
      currentUserId: currentUser._id,
    });

    api
      .deleteItem(selectedCard._id)
      .then(() => {
        setClothingItems((state) =>
          state.filter((c) => c._id !== selectedCard._id)
        );
        handleCloseModal();
        // Clear selected card after deletion
      })
      .catch((error) => {
        console.error("Delete error details:", error);
      });
  };

  const handleCardLike = async (card) => {
    try {
      if (isLoading || !currentUser?._id) {
        return;
      }

      const isLiked = card.likes.some((id) => id === currentUser._id);

      // Update the UI immediately for better user experience
      setClothingItems((items) =>
        items.map((item) =>
          item._id === card._id ? { ...item, isLiked: !isLiked } : item
        )
      );

      // Make the API call
      const response = await api.toggleCardLike(card._id, isLiked);

      // Update with the server response
      setClothingItems((items) =>
        items.map((item) =>
          item._id === card._id
            ? {
                ...item,
                likes: response.data?.likes || response.likes || [],
                isLiked:
                  response.data?.likes?.includes(currentUser._id) ||
                  response.likes?.includes(currentUser._id),
              }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating like status:", error);
      // Revert the optimistic update on error
      setClothingItems((items) =>
        items.map((item) =>
          item._id === card._id ? { ...item, isLiked: isLiked } : item
        )
      );
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setCurrentUser(null);
    setIsLoggedIn(false);

    // Refresh items without like information
    api
      .getItems()
      .then((data) => {
        setClothingItems(data);
      })
      .catch(console.error);

    navigate("/");
  };

  useEffect(() => {
    getWeather(coordinates, APIkey)
      .then((data) => {
        console.log("Weather data received:", data);
        const filteredData = filterWeatherData(data);
        setWeatherData(filteredData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  console.log(currentTemperatureUnit);

  useEffect(() => {
    // Always fetch items, regardless of login status
    api
      .getItems()
      .then((data) => {
        if (isLoggedIn && currentUser) {
          // If user is logged in, include like information
          const itemsWithLikedProperty = data.map((item) => ({
            ...item,
            isLiked: item.likes.some((id) => id === currentUser._id),
          }));
          setClothingItems(itemsWithLikedProperty);
        } else {
          // If user is not logged in, just set the items without like information
          setClothingItems(data);
        }
      })
      .catch((error) => {
        console.error("Error loading items:", error);
      });
  }, [currentUser, isLoggedIn]);

  console.log("Render state:", {
    isLoading,
    isLoggedIn,
    currentUser: currentUser?._id,
    itemsCount: clothingItems.length,
  });

  return (
    <CurrentTemperatureUnitContext.Provider
      value={{ currentTemperatureUnit, handleToggleSwitchChange }}
    >
      <div className="page">
        <div className="page__container">
          <Header
            handleAddClick={handleAddClick}
            weatherData={weatherData}
            isLoggedIn={isLoggedIn}
            onLoginClick={handleLogin}
            currentUser={currentUser}
            onLogout={handleLogout}
            onSignupClick={() => setIsRegisterModalOpen(true)}
          />

          <Routes>
            <Route
              path="/"
              element={
                isLoading ? (
                  <div>Loading...</div>
                ) : (
                  <Main
                    clothingItems={clothingItems}
                    weatherData={weatherData}
                    onCardClick={handleCardClick}
                    onCardLike={handleCardLike}
                    isLoggedIn={isLoggedIn}
                    currentUser={currentUser}
                    onDelete={handleDeleteItem}
                  />
                )
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Profile
                    onAddItem={handleAddItemSubmit}
                    handleAddClick={handleAddClick}
                    onCardClick={handleCardClick}
                    clothingItems={clothingItems}
                    onCardLike={handleCardLike}
                    onEditProfile={handleEditProfile}
                    onLogout={handleLogout}
                    isLoggedIn={isLoggedIn}
                    currentUser={currentUser}
                  />
                </ProtectedRoute>
              }
            />
          </Routes>

          <Footer />
        </div>

        {/* All modals here */}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={handleLoginSubmit}
          onSignupClick={handleSignupClick}
        />
        <RegisterModal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          onRegister={handleRegister}
          onLogin={handleLoginSubmit}
          onLoginClick={handleLoginClick}
        />
        <AddItemModal
          activeModal={activeModal}
          handleCloseModal={handleCloseModal}
          isOpen={activeModal === "add-garment"}
          onSubmit={handleAddItemSubmit}
        />
        <ItemModal
          activeModal={activeModal}
          card={selectedCard}
          onClose={handleCloseModal}
          isOpen={activeModal === "preview"}
          onCardClick={handleCardClick}
          onDelete={handleDeleteItem}
          currentUser={currentUser}
        />
        <DeleteItemModal
          activeModal={activeModal}
          onConfirm={handleOnConfirmDelete}
          onClose={handleCloseModal}
          isOpen={activeModal === "delete"}
          selectedCard={selectedCard}
        />
        <EditProfileModal
          isOpen={isEditProfileModalOpen}
          onClose={() => setIsEditProfileModalOpen(false)}
          updateCurrentUser={handleUpdateProfile}
          currentUser={currentUser}
        />
      </div>
    </CurrentTemperatureUnitContext.Provider>
  );
}
export default App;
