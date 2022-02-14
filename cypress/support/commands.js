Cypress.Commands.add('swapTiles', (i1, i2) => {
  cy.get('.tile').eq(i1).click()
  cy.get('.tile').eq(i2).click()
  // eslint-disable-next-line
  cy.wait(200)
})

let LOCAL_STORAGE_MEMORY = {}

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
