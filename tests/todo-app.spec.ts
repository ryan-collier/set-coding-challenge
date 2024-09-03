import { test, expect, type Page } from '@playwright/test';
import { checkNumberOfCompletedTodosInLocalStorage, checkNumberOfTodosInLocalStorage, checkTodosInLocalStorage } from '../src/todo-app';

test.beforeEach(async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
});

const TODO_ITEMS = [
  'complete code challenge',
  'ensure coverage for all items is automated',
  'submit code challenge'
];

test.describe('Create New Todo', () => {
  test('should be able to create new items on the page', async ({ page }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create 1st todo.
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');

    // Make sure the list only has one todo item.
    await expect(page.getByTestId('todo-title')).toHaveText([
      TODO_ITEMS[0]
    ]);

    // Create 2nd todo.
    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press('Enter');

    // Make sure the list now has two todo items.
    await expect(page.getByTestId('todo-title')).toHaveText([
      TODO_ITEMS[0],
      TODO_ITEMS[1]
    ]);
    
    // Make sure the list now has two todo items.
    await expect(page.getByTestId('todo-title')).toHaveText([
      TODO_ITEMS[0],
      TODO_ITEMS[1],
    ]);
    await checkNumberOfTodosInLocalStorage(page, 2);
  });
});

test.describe('Edit Todo', () => {
  test('should be able to edit a todo item', async ({ page }) => {

    // Create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create 1st todo.
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');

    // Verify the first todo item is created
    await expect(page.getByTestId('todo-title')).toHaveText([TODO_ITEMS[0]]);

    // Double-click the first todo item to edit it
    const todoItem = page.getByTestId('todo-title').nth(0);
    await todoItem.dblclick();

    // Edit the todo item and press Enter to save changes
    const todoEditInput = page.locator('.editing .edit');
    const UPDATED_TODO = 'updated code challenge';
    await todoEditInput.fill(UPDATED_TODO);
    await todoEditInput.press('Enter');

    // Verify the todo item is updated with new changes
    await expect(page.getByTestId('todo-title')).toHaveText([UPDATED_TODO]);

    // Verify the number of todos in local storage is still 1
    await checkNumberOfTodosInLocalStorage(page, 1);
  });
});
