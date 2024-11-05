import React, { useState } from "react";
import EditRecipeForm from "./EditRecipeForm";
import { X } from "react-feather";

const RecipeFull = ({
  selectedRecipe,
  handleUnselectRecipe,
  handleUpdateRecipe,
  onUpdateForm,
}) => {
  const [editing, setEditing] = useState(false);

  const handleCancel = () => {
    setEditing(false);
  };

  return (
    <div className="recipe-details">
      {editing ? (
        <EditRecipeForm
          selectedRecipe={selectedRecipe}
          handleCancel={handleCancel}
          handleUpdateRecipe={handleUpdateRecipe}
          onUpdateForm={onUpdateForm}
        />
      ) : (
        //FULL Article
        <article>
          <header>
            <figure>
              <img alt={selectedRecipe.title} src={selectedRecipe.image_url} />
            </figure>
            <h2>{selectedRecipe.title}</h2>
            <div className="button-container">
              <button className="edit-button" onClick={() => setEditing(true)}>
                Edit
              </button>
              <button className="cancel-button" onClick={handleUnselectRecipe}>
                <X /> Close
              </button>
              <button className="delete-button">Delete</button>
            </div>
          </header>

          <h3>Description:</h3>
          <p>{selectedRecipe.description}</p>

          <h3>Ingredients:</h3>

          <ul className="ingredient-list">
            {selectedRecipe.ingredients.split(",").map((ingredient, index) => (
              <li key={index} className="ingredient">
                {ingredient}
              </li>
            ))}
          </ul>
          <h3>Instructions:</h3>

          <pre className="formatted-text">{selectedRecipe.instructions}</pre>

          <h3>Servings: {selectedRecipe.servings}</h3>
        </article>
      )}
    </div>
  );
};

export default RecipeFull;
