import './style.css';

const baseMealUrl = 'https://www.themealdb.com/api/json/v1/1';
const mealCardContainer = document.querySelector('.meal-card-container');
let meals = [];

const getTotalMeal = async () => {
  const result = await fetch(`${baseMealUrl}/filter.php?a=Canadian`);
  const { meals } = await result.json();
  return meals;
};

meals = await getTotalMeal();

const createMealCard = async (meal) => {
  mealCardContainer.innerHTML += `
    <div class="meal-card" data-id = "${meal.idMeal}">
    <figure class="">
        <img src="${meal.strMealThumb}" alt="meal-image" class="meal-images">
    </figure>
    <figcaption class="d-flex justify-content-between">
        <h2 class="meal-title">${meal.strMeal}</h2>
        <div class="reaction-container d-flex flex-column">
            <i class="fa-regular fa-heart"></i>
            <span>5 likes</span>
        </div>
    </figcaption>
    <div class="button-container d-flex flex-column justify-content-around">
        <button>Comments</button>   
        <button>Reservations</button>
    </div>
</div>`;
};

const fetchMeal = async () => {
  meals.forEach((meal) => createMealCard(meal));
};

await fetchMeal();