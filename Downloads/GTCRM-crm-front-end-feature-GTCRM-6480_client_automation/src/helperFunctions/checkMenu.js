export function checkMenu(menu) {
  for (const key in menu) {
    if (menu.hasOwnProperty(key)) {
      if (menu[key]?.menu === true) {
        return true; // If at least one menu is true, return true
      }
    }
  }
  return false; // If no menu is true, return false
}
