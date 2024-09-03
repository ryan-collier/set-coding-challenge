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

    // Locate the parent <li> element of the todo item to verify the class
    const todoListItem = todoItem.locator('..'); // This is not the parent <li>
    const todoListItemParent = todoListItem.locator('..'); // Assuming the parent is <li>

    // Verify the parent <li> element is marked as completed with the 'completed' class
    await expect(todoListItemParent).toHaveClass(/completed/);

    // Verify the todo item is crossed off with a strikethrough (usually happens automatically with the 'completed' class)
    await expect(todoItem).toHaveCSS('text-decoration', /^line-through/);

    // Verify the number of completed todos in local storage is 1
    await checkNumberOfCompletedTodosInLocalStorage(page, 1);

    // Verify the total number of todos in local storage is still 1
    await checkNumberOfTodosInLocalStorage(page, 1);
  });
});

test.describe('View Active Todo Items', () => {
  test('should show only active (not completed) todo items in the Active list', async ({ page }) => {
    // Create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create two todo items
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');
    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press('Enter');

    // Verify both todo items are created
    await expect(page.getByTestId('todo-title')).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);

    // Mark the first todo item as completed
    const firstTodoItem = page.getByTestId('todo-title').nth(0);
    const toggleCheckbox = firstTodoItem.locator('..').locator('.toggle');
    await toggleCheckbox.click();

    // Verify the number of completed todos in local storage is 1
    await checkNumberOfCompletedTodosInLocalStorage(page, 1);

    // Click on the "Active" filter to view only active todos
    await page.locator('text=Active').click();

    // Verify only the second todo item (active) is visible
    await expect(page.getByTestId('todo-title')).toHaveText([TODO_ITEMS[1]]);

    // Verify the number of todos in local storage is still 2
    await checkNumberOfTodosInLocalStorage(page, 2);
  });
});

test.describe('Clear Completed Todo Items', () => {
  test('should clear completed todo items from the list and remove them from the local storage', async ({ page }) => {
    // Create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create two todo items
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');
    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press('Enter');

    // Verify both todo items are created
    await expect(page.getByTestId('todo-title')).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);

    // Mark the first todo item as completed
    const firstTodoItem = page.getByTestId('todo-title').nth(0);
    const toggleCheckbox = firstTodoItem.locator('..').locator('.toggle');
    await toggleCheckbox.click();

    // Correctly locate the parent <li> element of the todo item to verify the class
    const firstTodoDiv = firstTodoItem.locator('..'); // This is the <div> with the class "view"
    const firstTodoListItem = firstTodoDiv.locator('..'); // This is the parent <li> element

    // Verify the parent <li> element is marked as completed with the 'completed' class
    await expect(firstTodoListItem).toHaveClass(/completed/);

    // Verify the number of completed todos in local storage is 1
    await checkNumberOfCompletedTodosInLocalStorage(page, 1);

    // Click on the "Clear completed" button to remove completed todos
    await page.locator('text=Clear completed').click();

    // // Verify the completed todo item is removed from the todo list
    // await expect(firstTodoItem).toBeHidden();

    // Verify that only the active todo item remains in the list
    await expect(page.getByTestId('todo-title')).toHaveText([TODO_ITEMS[1]]);

    // Verify the number of completed todos in local storage is now 0
    await checkNumberOfCompletedTodosInLocalStorage(page, 0);

    // Verify the total number of todos in local storage is now 1
    await checkNumberOfTodosInLocalStorage(page, 1);
  });

  // The test case #6 spec suggests a todo item is moved to the Completed list when the "Clear Completed" 
  // button is clicked. This action results in the item being removed from all lists, not moving to the
  // completed list.

});