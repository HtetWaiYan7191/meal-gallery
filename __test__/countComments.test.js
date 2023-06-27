import { JSDOM } from 'jsdom';
import countComments from '../src/modules/countComments';

describe('countTotalMeals', () => {
const dom = new JSDOM();
global.document = dom.window.document;
    test('countTotalComments updates the commentTitle text content correctly', () => {

        const comment = ['Meal 1', 'Meal 2', 'Meal 3'];
        const commentTitle = document.createElement('h3');

        countComments(commentTitle, comment);

        expect(commentTitle.textContent).toEqual(`Comments (${comment.length})`);
      });

})