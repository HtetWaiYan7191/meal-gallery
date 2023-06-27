import { baseMealUrl } from './base.js';

const getMeal = async (id) => {
  const result = await fetch(`${baseMealUrl}/lookup.php?i=${id}`);
  const { meals } = await result.json();
  return meals[0];
};

const drawComment = async (id) => {
  document.body.style.overflow = 'hidden';
  const modal = document.createElement('div');
  modal.classList.add('popup');
  const cardContent = document.createElement('div');
  cardContent.classList.add('card-content');
  const meal = await getMeal(id);
  cardContent.innerHTML = `
    <img src="${meal.strMealThumb}" alt="Image of food">
    <h2>${meal.strMeal}</h2>
    <div id="details">
      <p><b>Category:</b> ${meal.strCategory}</p>
      <p><b>Area:</b> ${meal.strArea}</p>
      <p><b>Tags:</b> ${meal.strTags}</p>
    </div>
  `;
  modal.appendChild(cardContent);
  modal.style.display = 'flex';
  modal.addEventListener('click', (e) => {
    if (e.target.classList.contains('popup')) {
      document.body.style.overflow = 'auto';
      modal.remove();
    }
  });
  const comments = document.createElement('div');
  comments.classList.add('comments');
  const commentTitle = document.createElement('h3');
  commentTitle.classList.add('comment-title');
  commentTitle.textContent = 'Comments';
  cardContent.appendChild(commentTitle);

  cardContent.appendChild(comments);
  cardContent.innerHTML += `
    <h3>Leave a comment</h3>
  `;
  document.body.appendChild(modal);
};

export { drawComment };
