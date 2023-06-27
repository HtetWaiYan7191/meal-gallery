import './style.css';
import countTotalMeals from './modules/countTotalMeal';

const counterMeal = document.getElementById('counter-meal');
const baseMealUrl = 'https://www.themealdb.com/api/json/v1/1';
const baseReactionUrl = 'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi';
const mealCardContainer = document.querySelector('.meal-card-container');
let meals = [];
let appId;

const getTotalMeal = async () => {
  const result = await fetch(`${baseMealUrl}/filter.php?a=Canadian`);
  const { meals } = await result.json();
  return meals;
};

meals = await getTotalMeal();

const heartAnimation = (reactionBtn) => {
  reactionBtn.addEventListener('mouseover', (e) => {
    e.target.classList.add('fa-beat-fade');
    e.target.classList.add('regular-red');
  });

  reactionBtn.addEventListener('mouseout', (e) => {
    e.target.classList.remove('regular-red');
    e.target.classList.remove('fa-beat-fade');
  });
};

const createNewApp = async () => {
  if (appId) {
    return appId;
  }
  const requestOptions = {
    method: 'POST',
    headers: {
      'content-type': 'application/json; charset=UTF-8',
    },
  };

  const result = await fetch(`${baseReactionUrl}/apps/`, requestOptions);
  const data = await result.text();
  return data;
};

appId = await createNewApp();

const getReaction = async () => {
  const url = `${baseReactionUrl}/apps/${appId}/likes`;
  const result = await fetch(`${url}`);
  const data = await result.json();
  return data;
};

const sendReactionToApi = async (likeBtn) => {
  likeBtn.addEventListener('click', async (e) => {
    if (!e.target.classList.contains('fa-solid')) {
      e.target.classList.remove('fa-regular');
      e.target.classList.add('fa-bounce');
      e.target.classList.add('fa-solid');
      e.target.classList.add('red');
      // id = start from 0 ;
      const reactions = { item_id: `${e.target.id}` };
      const url = `${baseReactionUrl}/apps/${appId}/likes`;

      const requestOptions = {
        method: 'POST',
        headers: {
          'content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(reactions),
      };

      await fetch(`${url}`, requestOptions);
      const reactionNumbers = await getReaction();
      const currentId = reactionNumbers.length - 1;
      e.target.nextElementSibling.textContent = `${reactionNumbers[currentId].likes} likes`;
      e.target.classList.remove('fa-bounce');
    };
  });
};

const createMealCard = async (meal, id) => {
  mealCardContainer.innerHTML += `
    <div class="meal-card col-4" data-id = "${meal.idMeal}">
    <figure class="text-center">
        <img src="${meal.strMealThumb}" alt="meal-image" class="meal-images">
    </figure>
    <figcaption class="d-flex justify-content-between">
        <h2 class="meal-title">${meal.strMeal}</h2>
        <div class="reaction-container d-flex flex-column">
            <i class="fa-regular fa-heart" id="${id}"></i>
            <span></span>
        </div>
    </figcaption>
    <div class="button-container">
        <button class="comment-button">Comments</button>   
    </div>
</div>`;

  const likeBtns = document.querySelectorAll('.fa-heart');
  likeBtns.forEach((likeBtn) => sendReactionToApi(likeBtn));
  likeBtns.forEach((likeBtn) => heartAnimation(likeBtn));
};

const fetchMeal = async () => {
  meals.forEach((meal, id) => createMealCard(meal, id));
};

await fetchMeal();

window.addEventListener('DOMContentLoaded', countTotalMeals(counterMeal, meals));
