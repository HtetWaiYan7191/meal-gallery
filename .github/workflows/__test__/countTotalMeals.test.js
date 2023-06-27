import { JSDOM } from 'jsdom';
import countTotalMeals from "../../../src/modules/countTotalMeal";
describe('countTotalMeals', () => {
const dom = new JSDOM();
global.document = dom.window.document;
    test('countTotalMeals updates the counterMeal text content correctly', () => {

        const meals = ['Meal 1', 'Meal 2', 'Meal 3'];
        const counterMeal = document.createElement('span');
      
        countTotalMeals(counterMeal, meals);
      
        expect(counterMeal.textContent).toBe(`(${meals.length})`);
      });
      
})