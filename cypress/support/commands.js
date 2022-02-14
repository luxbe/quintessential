Cypress.Commands.add('swapTiles', (i1, i2) => {
  cy.get('.tile').eq(i1).click()
  cy.get('.tile').eq(i2).click()
})

let LOCAL_STORAGE_MEMORY = {}

Cypress.Commands.add('resetLocalStorage', () => {
  LOCAL_STORAGE_MEMORY = {}
  localStorage.clear()
})

Cypress.Commands.add('saveLocalStorage', () => {
  Object.keys(localStorage).forEach((key) => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key]
  })
})

Cypress.Commands.add('restoreLocalStorage', () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach((key) => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key])
  })
})
