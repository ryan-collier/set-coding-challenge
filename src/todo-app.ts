import type { Page } from "playwright";

export async function checkNumberOfTodosInLocalStorage(page: Page, expected: number) {
return await page.waitForFunction(e => {
    return JSON.parse(localStorage['react-todos']).length === e;
}, expected);
}

export async function checkNumberOfCompletedTodosInLocalStorage(page: Page, expected: number) {
    return await page.waitForFunction(e => {
        return JSON.parse(localStorage['react-todos']).filter((todo: { completed: boolean }) => todo.completed).length === e;
    }, expected);
}

export async function checkTodosInLocalStorage(page: Page, title: string) {
    return await page.waitForFunction((t: string) => {
        return JSON.parse(localStorage['react-todos']).map((todo: { title: string }) => todo.title).includes(t);
    }, title);
}