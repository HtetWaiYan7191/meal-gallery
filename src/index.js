import './style.css';
import { drawComment } from './modules/comment';

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
  });
};

const createMealCard = async (meal, id) => {
  mealCardContainer.innerHTML += `
    <div class="meal-card" data-id = "${meal.idMeal}">
    <figure class="">
        <img src="${meal.strMealThumb}" alt="meal-image" class="meal-images">
    </figure>
    <figcaption class="d-flex justify-content-between">
        <h2 class="meal-title">${meal.strMeal}</h2>
        <div class="reaction-container d-flex flex-column">
            <i class="fa-regular fa-heart" id="${id}"></i>
            <span></span>
        </div>
    </figcaption>
    <div class="button-container d-flex flex-column justify-content-around">
        <button id="commentBtn">Comments</button>
    </div>
</div>`;

  const likeBtns = document.querySelectorAll('.fa-heart');
  likeBtns.forEach((likeBtn) => sendReactionToApi(likeBtn));

  const commentBtn = document.querySelectorAll('#commentBtn');
  commentBtn.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      console.log(e.target.parentElement.parentElement.dataset.id);
      drawComment(e.target.parentElement.parentElement.dataset.id)
    });
  });
};

const fetchMeal = async () => {
  meals.forEach((meal, id) => createMealCard(meal, id));
};

await fetchMeal();

export { appId, baseMealUrl, baseReactionUrl };
