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
import { getItems, addItem, deleteItem } from "../../utils/api";

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
    return addItem(item) // Ensure this function returns a promise
      .then((createdItem) => {
        setClothingItems((prevItems) => [createdItem, ...prevItems]);
        resetForm();
        handleCloseModal();
      })
      .catch(console.error);
  }
  // const handleAddItemSubmit = (item) => {
  //   addItem(item)
  //     .then((createdItem) => {
  //       setItems((prevItems) => [createdItem, ...prevItems]);
  //       handleCloseModal();
  //     })
  //     .catch(console.error);
  // };

  const onAddItem = () => {
    setActiveModal("add-garment");
  };

  const handleDeleteItem = (id) => {
    setActiveModal("delete");
  };

  const handleOnConfirmDelete = () => {
    deleteItem(selectedCard._id)
      .then(() => {
        setClothingItems(
          clothingItems.filter((item) => item._id !== selectedCard._id)
        );
        console.log("Item deleted", clothingItems);
        handleCloseModal();
      })
      .catch(console.error);
  };

  useEffect(() => {
    getWeather(coordinates, APIkey)
      .then((data) => {
        const filteredData = filterWeatherData(data);
        setWeatherData(filteredData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  console.log(currentTemperatureUnit);

  useEffect(() => {
    getItems()
      .then((data) => {
        console.log(data);
        setClothingItems(data);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="page">
      <CurrentTemperatureUnitContext.Provider
        value={{ currentTemperatureUnit, handleToggleSwitchChange }}
      >
        <div className="page__container">
          <Header handleAddClick={handleAddClick} weatherData={weatherData} />
          <Routes>
            <Route
              path="/"
              element={
                clothingItems.length > 0 && (
                  <Main
                    clothingItems={clothingItems}
                    weatherData={weatherData}
                    onCardClick={handleCardClick}

                    // handleAddItemSubmit={handleAddItemSubmit}
                    // handleDeleteItem={handleDeleteItem}
                  />
                )
              }
            />
            <Route
              path="/profile"
              element={
                <Profile
                  onAddItem={handleAddItemSubmit}
                  handleAddClick={handleAddClick}
                  onCardClick={handleCardClick}
                  clothingItems={clothingItems}
                />
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
          // activeModal={activeModal}
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
  );
}

export default App;
