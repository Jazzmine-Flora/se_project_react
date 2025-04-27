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
import { api, baseUrl } from "../../utils/api";
import RegisterModal from "../RegisterModal/RegisterModal";
import LoginModal from "../LoginModal/LoginModal";
import * as auth from "../../utils/auth";
import { register } from "../../utils/auth";
import { CurrentUserProvider } from "../../contexts/CurrentUserContext";
import ProtectedRoute from "../ProtectedRoute";

function App() {
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

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const checkToken = () => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth
        .checkToken(jwt)
        .then((res) => {
          setIsLoggedIn(true);
          setCurrentUser(res);
        })
        .catch((err) => {
          console.error(err);
          localStorage.removeItem("jwt");
        });
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  const handleLogin = () => {
    setIsLoginModalOpen(true);
  };
  const handleLoginSubmit = ({ email, password }) => {
    return auth // Add this return statement
      .login({ email, password })
      .then((data) => {
        if (data.token) {
          localStorage.setItem("jwt", data.token);
          checkToken();
          setIsLoginModalOpen(false);
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

  function handleAddItemSubmit(item, resetForm) {
    return api
      .addItem(item) // Ensure this function returns a promise
      .then((createdItem) => {
        setClothingItems((prevItems) => [createdItem, ...prevItems]);
        resetForm();
        handleCloseModal();
      })
      .catch(console.error);
  }

  const onAddItem = () => {
    setActiveModal("add-garment");
  };

  const handleDeleteItem = (id) => {
    setActiveModal("delete");
  };

  const handleOnConfirmDelete = () => {
    api
      .deleteItem(selectedCard._id)
      .then(() => {
        setClothingItems(
          clothingItems.filter((item) => item._id !== selectedCard._id)
        );
        console.log("Item deleted", clothingItems);
        handleCloseModal();
      })
      .catch(console.error);
  };

  const handleCardLike = (card) => {
    const isLiked = card.likes.some((i) => i === currentUser._id);
    const token = localStorage.getItem("jwt");

    fetch(`${baseUrl}/items/${card._id}/likes`, {
      method: isLiked ? "DELETE" : "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((updatedCard) => {
        console.log("Like response data:", updatedCard);
        if (updatedCard) {
          setClothingItems((items) =>
            items.map((item) => (item._id === card._id ? updatedCard : item))
          );
        }
      })
      .catch((error) => {
        console.error("Error updating like:", error);
      });
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
    api
      .getItems()
      .then((data) => {
        console.log(data);
        setClothingItems(data);
      })
      .catch(console.error);
  }, []);

  return (
    <CurrentUserProvider>
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegister={handleRegister}
        onLogin={handleLoginSubmit} // Pass the login function to RegisterModal
      />
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
              }}
              onSignupClick={() => setIsRegisterModalOpen(true)}
            />
            <Routes>
              <Route
                path="/"
                element={
                  <Main
                    clothingItems={clothingItems}
                    weatherData={weatherData}
                    onCardClick={handleCardClick}
                    onCardLike={handleCardLike}
                    isLoggedIn={isLoggedIn} // Add this line
                    currentUser={currentUser}

                    // handleAddItemSubmit={handleAddItemSubmit}
                    // handleDeleteItem={handleDeleteItem}
                  />
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
          />
        </CurrentTemperatureUnitContext.Provider>
      </div>
    </CurrentUserProvider>
  );
}
export default App;
