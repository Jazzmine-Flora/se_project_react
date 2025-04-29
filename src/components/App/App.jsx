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

function App() {
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState({
    type: "",
    temp: { F: 999 },
    city: "",
  });
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState({});
  const [currentTemperatureUnit, setCurrentTemperatureUnit] = useState("F");
  const [clothingItems, setClothingItems] = useState([]);
  const [items, setItems] = useState([]);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const checkToken = () => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      setIsLoading(true);
      let authenticatedUser = null; // Store the user data

      auth
        .checkToken(jwt)
        .then((res) => {
          setIsLoggedIn(true);
          setCurrentUser(res);
          authenticatedUser = res; // Save the user data
          return api.getItems();
        })
        .then((data) => {
          if (data) {
            const itemsWithLikedProperty = data.map((item) => ({
              ...item,
              isLiked: item.likes.some((id) => id === authenticatedUser._id), // Use saved user data
            }));
            setClothingItems(itemsWithLikedProperty);
          }
        })
        .catch((err) => {
          console.error("Error in checkToken:", err);
          localStorage.removeItem("jwt");
          setIsLoggedIn(false);
          setCurrentUser(null);
          setClothingItems([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    checkToken();
  }, []);

  const handleLogin = () => {
    setIsLoginModalOpen(true);
  };
  const handleLoginSubmit = ({ email, password }) => {
    return auth
      .login({ email, password })
      .then((data) => {
        if (data.token) {
          localStorage.setItem("jwt", data.token);
          checkToken();
          setIsLoginModalOpen(false); // This should close the modal
        }
      })
      .catch((err) => {
        console.error(err);
      });
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
    console.log("Submitting item:", itemData);
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

  const handleDeleteItem = (card) => {
    console.log("Card ID in handleDeleteItem:", card._id);
    setSelectedCard(card);
    setActiveModal("delete");
  };

  const handleOnConfirmDelete = (id) => {
    api
      .deleteItem(id)
      .then(() => {
        setClothingItems((state) => state.filter((c) => c._id !== id));
        setActiveModal("");
      })
      .catch(console.error);
  };
  const handleCardLike = async (card) => {
    try {
      console.log("handleCardLike called with card:", card);
      console.log("Current user state:", currentUser);
      console.log("isLoading state:", isLoading);
      if (isLoading) {
        console.log("Still loading user data...");
        return;
      }
      // First, make sure we have the current user
      if (!currentUser?._id) {
        console.error("No current user found");
        return;
      }

      // Make sure the card has a likes array
      const cardLikes = card.likes || [];
      const isLiked = cardLikes.some((id) => id === currentUser._id);

      const response = await api.toggleCardLike(card._id, isLiked);

      if (response) {
        setClothingItems((items) =>
          items.map((item) => {
            if (item._id === card._id) {
              return {
                ...response,
                isLiked: response.likes.some((id) => id === currentUser._id),
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
    if (!isLoading && currentUser?._id) {
      // Only proceed when not loading and we have a user
      console.log("Loading items for user:", currentUser._id);
      api
        .getItems()
        .then((data) => {
          console.log("Received items:", data);
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
  }, [currentUser, isLoading]);

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
                localStorage.removeItem("jwt");
                setIsLoggedIn(false);
                setCurrentUser(null);
                setClothingItems([]); // Clear the items when logging out
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
              {/* <Route
                path="/signin"
                element={
                  <LoginModal
                    isOpen={true}
                    onClose={() => navigate("/")}
                    onLogin={handleLoginSubmit}
                  />
                }
              /> */}
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
            onAddItem={handleAddItemSubmit}
            onSubmit={handleAddItemSubmit}
          />
          <ItemModal
            card={selectedCard}
            onClose={handleCloseModal}
            isOpen={activeModal === "preview"}
            onDelete={handleDeleteItem}
            onConfirm={handleDeleteItem}
          />
          <DeleteItemModal
            activeModal={activeModal}
            onConfirm={handleOnConfirmDelete}
            onClose={handleCloseModal}
            isOpen={activeModal === "delete"}
            onDelete={handleDeleteItem}
            selectedCard={selectedCard} // Add this line
          />
        </CurrentTemperatureUnitContext.Provider>
      </div>
    </>
  );
}
export default App;
