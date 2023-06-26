import { appId, baseMealUrl, baseReactionUrl } from "../index.js";

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

const addComment = (comment) => {
  const commentList = document.querySelector('.comments');
  console.log(commentList);
  const commentItem = document.createElement('p');
  commentItem.classList.add('comment-item');
  commentItem.innerHTML = `${comment.username}: ${comment.comment}`;
  commentList.appendChild(commentItem);
};

const drawForm = (id) => {
  const form = document.createElement('form');
  form.classList.add('comment-form');
  form.innerHTML = `
    <input type="text" name="name" placeholder="Your name" required>
    <textarea name="comment" placeholder="Your comment" required></textarea>
    <input type="submit" value="Submit">
  `;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { name, comment } = e.target;
    const commentData = {
      item_id: id,
      username: name.value,
      comment: comment.value,
    };
    const comments = document.querySelector('.comments');
    const date = new Date();
    let dateString;

    dateString = `
    ${date.getFullYear()}-
    ${('0' + (date.getMonth() + 1)).slice(-2)}-
    ${('0' + date.getDate()).slice(-2)}
    `;
    comments.innerHTML += `
      <p class="comment-item">${dateString} <b>${commentData.username}</b>: ${commentData.comment}</p>
    `;
    const url = `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/${appId}/comments`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(commentData),
    };
    await fetch(`${url}`, requestOptions);
    form.reset();
    const commentTitle = document.querySelector('.comment-title');
    const commentList = await getComments(id);
    console.log(commentList);
    commentTitle.textContent = `Comments (${Object.keys(commentList).length})`;
  });
  return form;
};

const drawComment = async (id) => {
  console.log(appId, baseMealUrl, baseReactionUrl);
  document.body.style.overflow = 'hidden';
  const modal = document.createElement('div');
  modal.classList.add('popup');
  const cardContent = document.createElement('div');
  cardContent.classList.add('card-content');
  const meal = await getMeal(id);
  console.log(meal);
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
  document.body.appendChild(modal);
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
  commentTitle.textContent = `Comments (0)`;
  cardContent.appendChild(commentTitle);
  if (Object.keys(commentList)[0] === 'error') {

  } else {
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
  cardContent.appendChild(drawForm(id));
}

export { drawComment };