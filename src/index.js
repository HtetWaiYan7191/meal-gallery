import './style.css';
import drawComment from './modules/comment.js';
import { appId, baseMealUrl, baseReactionUrl } from './modules/base.js';
import countTotalMeals from './modules/countTotalMeal';
const counterMeal = document.getElementById('counter-meal');

const mealCardContainer = document.querySelector('.meal-card-container');
let meals = [];

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


const getReaction = async () => {
  const url = `${baseReactionUrl}/apps/${appId}/likes`;
  const result = await fetch(`${url}`);
  const data = await result.json();
  return data;
};

const showReaction = async (reactionCounts) => {
  const reactionNumbers = await getReaction();
  reactionNumbers.forEach((reactionNumber) => {
    reactionCounts.forEach((reactionCount) => {
      if (reactionNumber.item_id === reactionCount.id) {
        reactionCount.textContent = `${reactionNumber.likes} likes`;
      }
    });
  });
};

const sendReactionToApi = async (likeBtn, reactionCounts) => {
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
      showReaction(reactionCounts);
      // const reactionNumbers = await getReaction();
      // const currentId = reactionNumbers.length - 1;
      // e.target.nextElementSibling.textContent = `${reactionNumbers[currentId].likes} likes`;
      e.target.classList.remove('fa-bounce');
    }
  });
};

const createMealCard = async (meals) => {
  meals.forEach((meal, id) => {
    mealCardContainer.innerHTML += `
    <div class="meal-card col-4" data-id = "${meal.idMeal}">
    <figure class="text-center">
        <img src="${meal.strMealThumb}" alt="meal-image" class="meal-images">
    </figure>
    <figcaption class="d-flex justify-content-between">
        <h2 class="meal-title">${meal.strMeal}</h2>
        <div class="reaction-container d-flex flex-column">
            <i class="fa-regular fa-heart" id="${id}"></i>
            <span id="${id}" class="reaction-counts"></span>
        </div>
    </figcaption>

    <div class="button-container d-flex flex-column justify-content-around">
        <button class="comment-button" id="commentBtn">Comments</button>   
    </div>
</div>`;
  });

  const likeBtns = document.querySelectorAll('.fa-heart');
  const reactionCounts = document.querySelectorAll('.reaction-counts');
  likeBtns.forEach((likeBtn) => sendReactionToApi(likeBtn, reactionCounts));
  likeBtns.forEach((likeBtn) => heartAnimation(likeBtn));
  showReaction(reactionCounts);


  const commentBtn = document.querySelectorAll('#commentBtn');
  commentBtn.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      drawComment(e.target.parentElement.parentElement.dataset.id);
    });
  });
};

const fetchMeal = async () => {
  createMealCard(meals);
};

await fetchMeal();

window.addEventListener('DOMContentLoaded', countTotalMeals(counterMeal, meals));
export { appId, baseMealUrl, baseReactionUrl };
