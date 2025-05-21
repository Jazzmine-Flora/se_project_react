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
          setIsLoggedIn(true);
          setCurrentUser(res.data);
          return api.getItems(); // Chain the items fetch
        } else {
          throw new Error("Invalid token response");
        }
      })
      .then((items) => {
        if (items) {
          const itemsWithLikedProperty = items.map((item) => ({
            ...item,
            isLiked: item.likes.some((id) => id === currentUser?._id),
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

      // Get user data from the response
      const userData = loginResponse.user || loginResponse; // adjust this based on your API response structure

      // Update user state first
      setIsLoggedIn(true);
      setCurrentUser(userData);

      // Get items
      const items = await api.getItems();
      const itemsWithLikedProperty = items.map((item) => ({
        ...item,
        isLiked: item.likes.some((id) => id === userData._id),
      }));

      // Update items state
      setClothingItems(itemsWithLikedProperty);
      setIsLoginModalOpen(false);

      // Navigate last
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
    console.log("About to make API call with data:", itemData);
    api
      .addItem(itemData)
      .then((newItem) => {
        console.log("Response from API:", newItem);
        const newItemWithLiked = {
          ...newItem.data, // Change this line to use newItem.data
          isLiked: false,
        };
        setClothingItems([newItemWithLiked, ...clothingItems]);

        handleCloseModal();
      })
      .catch(console.error);
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
        setActiveModal("");
      })
      .catch((error) => {
        console.error("Delete error details:", error);
      });
  };

  const handleCardLike = async (card) => {
    try {
      if (isLoading) {
        return;
      }
      if (!currentUser?._id) {
        console.error("No current user found");
        return;
      }

      const cardLikes = card.likes || [];
      const isLiked = cardLikes.some((id) => id === currentUser._id);

      const response = await api.toggleCardLike(card._id, isLiked);
      console.log("Like response:", response); // Add this line to debug

      if (response) {
        setClothingItems((items) =>
          items.map((item) => {
            if (item._id === card._id) {
              // Check if response.data exists, otherwise fall back to response
              const updatedLikes = response.data
                ? response.data.likes
                : response.likes;
              return {
                ...item,
                likes: updatedLikes || [],
                isLiked: (updatedLikes || []).some(
                  (id) => id === currentUser._id
                ),
              };
            }
            return item;
          })
        );
      }
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setCurrentUser(null);
    setIsLoggedIn(false);
    navigate("/"); // If you're using react-router
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
    if (currentUser && isLoggedIn) {
      api
        .getItems()
        .then((data) => {
          const itemsWithLikedProperty = data.map((item) => ({
            ...item,
            isLiked: item.likes.some((id) => id === currentUser._id),
          }));
          setClothingItems(itemsWithLikedProperty);
        })
        .catch((error) => {
          console.error("Error loading items:", error);
        });
    }
  }, [currentUser, isLoggedIn]);

  console.log("Render state:", {
    isLoading,
    isLoggedIn,
    currentUser: currentUser?._id,
    itemsCount: clothingItems.length,
  });

  return (
    <>
      {/* <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegister={handleRegister}
        onLogin={handleLoginSubmit} // Pass the login function to RegisterModal
      /> */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLoginSubmit}
      />

      <div className="page">
        <CurrentTemperatureUnitContext.Provider
          value={{ currentTemperatureUnit, handleToggleSwitchChange }}
        >
          <div className="page__container">
            <Header
              handleAddClick={handleAddClick}
              weatherData={weatherData}
              isLoggedIn={isLoggedIn}
              onLoginClick={handleLogin}
              currentUser={currentUser}
              onLogout={() => {
                console.log("Logout started");
                localStorage.removeItem("jwt");
                setIsLoggedIn(false);
                setCurrentUser(null);
                setClothingItems([]);
                navigate("/"); // Add this line to redirect to home page
                window.location.reload(); // Force a page refresh
              }}
              onSignupClick={() => navigate("/signup")}
            />
            <Routes>
              <Route
                path="/signup"
                element={
                  <RegisterModal
                    isOpen={true}
                    onClose={() => navigate("/")}
                    onRegister={handleRegister}
                    onLogin={handleLoginSubmit}
                  />
                }
              />
              <Route
                path="/signin"
                element={
                  <LoginModal
                    isOpen={true}
                    onClose={() => navigate("/")}
                    onLogin={handleLoginSubmit}
                  />
                }
              />
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
                    />
                  </ProtectedRoute>
                }
              />
            </Routes>

            <Footer />
          </div>
          <AddItemModal
            activeModal={activeModal}
            handleCloseModal={handleCloseModal}
            isOpen={activeModal === "add-garment"}
            // onAddItem={handleAddItemSubmit}
            onSubmit={handleAddItemSubmit}
          />
          <ItemModal
            card={selectedCard}
            onClose={handleCloseModal}
            isOpen={activeModal === "preview"}
            onDelete={handleDeleteItem}
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
        </CurrentTemperatureUnitContext.Provider>
      </div>
    </>
  );
}
export default App;
