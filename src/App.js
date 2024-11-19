import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import RecipeExcerpt from "./components/RecipeExcerpt";
import RecipeFull from "./components/RecipeFull";
import NewRecipeForm from "./components/NewRecipeForm";
import displayToast from "./helpers/toastHelper";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    servings: 1, // conservative default
    description: "",
    image_url:
      "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", //default
  });
  const [showNewRecipeForm, setShowNewRecipeForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
        const response = await fetch("/api/recipes");
        if (response.ok) {
          const data = await response.json();
          setRecipes(data);
        } else {
          displayToast("Oops - could not fetch recipes!", "error");
        }
      } catch (e) {
        displayToast("An error occurred during the request", "error");
      }
    };
    fetchAllRecipes();
  }, []);

  const handleNewRecipe = async (e, newRecipe) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRecipe),
      });

      if (response.ok) {
        const data = await response.json();

        setRecipes([...recipes, data.recipe]);

        displayToast("Recipe added SUCCESSFULLY");

        setShowNewRecipeForm(false);
        setNewRecipe({
          title: "",
          ingredients: "",
          instructions: "",
          servings: 1, // conservative default
          description: "",
          image_url:
            "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", //default
        });
      } else {
        displayToast("OOPS, COULDN'T ADD RECIPE!", "error");
      }
    } catch (e) {
      displayToast("An error has occured during the request: ", "error");
    }
  };

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleUnselectRecipe = () => {
    setSelectedRecipe(null);
  };

  const hideRecipeForm = () => {
    setShowNewRecipeForm(false);
  };

  const showRecipeForm = () => {
    setShowNewRecipeForm(true);
    setSelectedRecipe(null);
  };

  const handleUpdateRecipe = async (e, selectedRecipe) => {
    e.preventDefault();

    const { id } = selectedRecipe;

    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedRecipe),
      });

      if (response.ok) {
        const data = await response.json();

        setRecipes(
          recipes.map((recipe) => {
            if (recipe.id === id) {
              return data.recipe;
            }
            return recipe;
          })
        );

        displayToast("Recipe updated!!");
      } else {
        displayToast("OOPS, Failed to update recipe! TRY AGAIN!", "error");
      }
    } catch (e) {
      displayToast("An error has occured during the request: ", "error");
    }

    setSelectedRecipe(null);
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      const response = await fetch(`/api/recipes/${selectedRecipe.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setRecipes(recipes.filter((recipe) => recipe.id !== recipeId));
        setSelectedRecipe(null);
        displayToast("Recipe deleted succesfully");
      } else {
        displayToast(
          "Oops - Could not delete recipe! Please try again!",
          "error"
        );
      }
    } catch (e) {
      displayToast("Something went wrong during the request", "error");
    }
  };

  const onUpdateForm = (e, action = "new") => {
    const { name, value } = e.target;
    if (action === "update") {
      setSelectedRecipe({
        ...selectedRecipe,
        [name]: value,
      });
    } else if (action === "new") {
      setNewRecipe({ ...newRecipe, [name]: value });
    }
  };

  const updateSearchTerm = (text) => {
    setSearchTerm(text);
  };
  const handleSearch = () => {
    const searchResults = recipes.filter((recipe) => {
      const valuesToSearch = [
        recipe.title,
        recipe.ingredients,
        recipe.description,
      ];
      return valuesToSearch.some((value) =>
        value.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    return searchResults;
  };

  const displayedRecipes = searchTerm ? handleSearch() : recipes;

  const displayAllRecipes = () => {
    hideRecipeForm();
    handleUnselectRecipe();
    updateSearchTerm("");
  };

  return (
    <div className="recipe-app">
      <Header
        showRecipeForm={showRecipeForm}
        updateSearchTerm={updateSearchTerm}
        searchTerm={searchTerm}
        displayAllRecipes={displayAllRecipes}
      />
      {showNewRecipeForm && (
        <NewRecipeForm
          newRecipe={newRecipe}
          hideRecipeForm={hideRecipeForm}
          onUpdateForm={onUpdateForm}
          handleNewRecipe={handleNewRecipe}
        />
      )}
      {selectedRecipe && (
        <RecipeFull
          handleUpdateRecipe={handleUpdateRecipe}
          selectedRecipe={selectedRecipe}
          handleUnselectRecipe={handleUnselectRecipe}
          onUpdateForm={onUpdateForm}
          handleDeleteRecipe={handleDeleteRecipe}
        />
      )}
      {!selectedRecipe && (
        <div className="recipe-list">
          {displayedRecipes.map((recipe) => (
            <RecipeExcerpt
              key={recipe.id}
              recipe={recipe}
              handleSelectRecipe={handleSelectRecipe}
            />
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default App;
