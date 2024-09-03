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


test.describe('Delete Todo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
  });

  test('should be able to delete a todo item using the red X button', async ({ page }) => {
    // Create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create the first todo item
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');

    // Verify the first todo item is created
    await expect(page.getByTestId('todo-title')).toHaveText([TODO_ITEMS[0]]);

    // Create the second todo item
    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press('Enter');

    // Verify both todo items are created
    await expect(page.getByTestId('todo-title')).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);

    // Locate the delete button (red X) for the first todo item
    const todoItem = page.getByTestId('todo-title').nth(0);
    const deleteButton = todoItem.locator('..').locator('.destroy');

    // Hover over the first todo item to reveal the delete button
    await todoItem.hover();

    // Click the delete button
    await deleteButton.click();

    // Verify the first todo item is removed
    await expect(page.getByTestId('todo-title')).toHaveText([TODO_ITEMS[1]]);

    // Verify the number of todos in local storage is now 1
    await checkNumberOfTodosInLocalStorage(page, 1);
  });
});

test.describe('Mark Todo as Completed', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
  });

  test('should be able to mark a todo item as completed', async ({ page }) => {
    // Create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create the first todo item
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');

    // Verify the first todo item is created
    await expect(page.getByTestId('todo-title')).toHaveText([TODO_ITEMS[0]]);

    // Locate the checkbox to mark the todo as completed
    const todoItem = page.getByTestId('todo-title').nth(0);
    const toggleCheckbox = todoItem.locator('..').locator('.toggle');

    // Click the checkbox to mark the todo as completed
    await toggleCheckbox.click();

    // Verify the todo item is marked as completed with a green checkmark
    await expect(toggleCheckbox).toBeChecked();

    // // Verify the todo item is crossed off with a strikethrough
    // await expect(todoItem).toHaveClass(/completed/);

    // Locate the parent <li> element of the todo item to verify the class
    const todoListItem = todoItem.locator('..'); // Assuming the parent is <li>
    const todoListItemParent = todoListItem.locator('..'); // Assuming the parent is <li>

    // Verify the parent <li> element is marked as completed with the 'completed' class
    await expect(todoListItemParent).toHaveClass(/completed/);

    // Verify the todo item is crossed off with a strikethrough (usually happens automatically with the 'completed' class)
    await expect(todoItem).toHaveCSS('text-decoration', /^line-through/);
    // const textDecoration = await todoItem.evaluate((el) => window.getComputedStyle(el).textDecoration);
    // expect(['line-through solid rgb(96, 96, 96)', 'line-through solid rgb(217, 217, 217)', 'line-through rgb(217, 217, 217)', 'line-through']).toContain(textDecoration);

    // Verify the number of completed todos in local storage is 1
    await checkNumberOfCompletedTodosInLocalStorage(page, 1);

    // Verify the total number of todos in local storage is still 1
    await checkNumberOfTodosInLocalStorage(page, 1);
  });
});