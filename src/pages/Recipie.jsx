import React, { useEffect, useState, useCallback } from 'react';
import '../styles/Recipie.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Recipie = () => {
  const { id } = useParams();
  const [recipie, setRecipie] = useState();

  // Memoize fetchRecipie using useCallback to avoid unnecessary re-renders
  const fetchRecipie = useCallback(async () => {
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
      setRecipie(response.data.meals[0]);
      console.log(response.data.meals[0]);
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  useEffect(() => {
    fetchRecipie();
  }, [fetchRecipie]);

  // Function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    const regex = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = recipie?.strYoutube ? getYouTubeVideoId(recipie.strYoutube) : null;

  return (
    <div className="Recipie-page">
      {recipie ? (
        <>
          <div className="recipie-img">
            <img src={recipie.strMealThumb} alt="food-item" />
          </div>

          <div className="recipie-data-container">
            <div className="recipie-data">
              <div className="recipie-header">
                <h4>{recipie.strMeal}</h4>
                <div className="recipie-specials">
                  <p>{recipie.strArea && recipie.strArea}</p>
                  <p>{recipie.strCategory && recipie.strCategory}</p>
                </div>
              </div>

              <div className="procedure">
                <h5>Procedure</h5>
                <p>{recipie.strInstructions}</p>
              </div>

              {videoId && (
                <div className="youtube-video-container">
                  <h5>Video Tutorial</h5>
                  <iframe
                    className="youtube-video"
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="YouTube video"
                  ></iframe>
                </div>
              )}
            </div>

            <div className="ingredients-container">
              <h3>Ingredients</h3>
              <ul className="ingredients">
                {Object.entries(recipie).map(([key, value]) => {
                  if (key.startsWith("strIngredient") && value) {
                    const ingredientNumber = key.slice("strIngredient".length);
                    const measure = recipie[`strMeasure${ingredientNumber}`] || "";

                    return (
                      <li key={key} className="ingredient">
                        <h5>{ingredientNumber} - {value}</h5>
                        <p>{measure}</p>
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
            </div>
          </div>
        </>
      ) : (
        "Loading..."
      )}
    </div>
  );
};

export default Recipie;
