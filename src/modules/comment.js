import { baseMealUrl, baseReactionUrl, appId } from './base.js';

const getMeal = async (id) => {
  const result = await fetch(`${baseMealUrl}/lookup.php?i=${id}`);
  const { meals } = await result.json();
  return meals[0];
};

const getComments = async (id) => {
  const result = await fetch(`${baseReactionUrl}/apps/${appId}/comments?item_id=${id}`);
  const data = await result.json();
  return data;
};

const drawComment = async (id) => {
  document.body.style.overflow = 'hidden';
  const modal = document.createElement('div');
  modal.classList.add('popup');
  const cardContent = document.createElement('div');
  cardContent.addEventListener('click', (e) => {
    console.log(e.target);
    if (e.target.classList.contains('close')) {
      document.body.style.overflow = 'auto';
      modal.remove();
    }
  });
  cardContent.classList.add('card-content');
  const meal = await getMeal(id);
  const close = document.createElement('i');
  close.classList.add('fas', 'fa-times', 'close');
  cardContent.appendChild(close);
  cardContent.innerHTML += `
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
  const commentList = await getComments(id);
  console.log(commentList);
  commentTitle.textContent = 'Comments (0)';
  cardContent.appendChild(commentTitle);
  if (Object.keys(commentList)[0] !== 'error') {
    commentTitle.textContent = `Comments (${Object.keys(commentList).length})`;
    for (let i = 0; i < Object.keys(commentList).length; i += 1) {
      comments.innerHTML += `
        <p class="comment-item">${commentList[i].creation_date} <b>${commentList[i].username}</b>: ${commentList[i].comment}</p>
      `;
    }
  }

  cardContent.appendChild(comments);
  cardContent.innerHTML += `
    <h3>Leave a comment</h3>
  `;
  document.body.appendChild(modal);
};

export default drawComment;