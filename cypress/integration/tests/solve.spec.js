/// <reference types="cypress" />

describe('solve', () => {
  beforeEach(() => {
    cy.restoreLocalStorage()
  })

  afterEach(() => {
    cy.saveLocalStorage()
  })

  it('should display a puzzle', () => {
    cy.visit('http://localhost:3000/?f')
    cy.get('.close-icon').click()
    cy.get('.tile').should('have.length', 25)
  })

  it('allows tapping to swap tiles', () => {
    cy.visit('http://localhost:3000/?f')
    cy.get('.tile.wrong').eq(0).click()
    cy.get('.tile.wrong').eq(1).click()
  })

  it('can be solved', () => {
    cy.visit('http://localhost:3000/?p=2022-02-12&f')

    cy.swapTiles(3, 23)
    cy.swapTiles(2, 15)
    cy.swapTiles(4, 13)
    cy.swapTiles(1, 22)
    cy.swapTiles(8, 18)
    cy.swapTiles(0, 10)
    cy.swapTiles(5, 12)
    cy.swapTiles(7, 16)

    cy.get('#last-game-stats').should('have.length', 1)
    cy.get('#stat-moves').contains('8')
  })

  it('stats are tracked correctly', () => {
    cy.visit('http://localhost:3000/?p=2022-02-13&f')

    cy.swapTiles(17, 5)
    cy.swapTiles(4, 13)
    cy.swapTiles(4, 6)
    cy.swapTiles(20, 8)
    cy.swapTiles(24, 16)
    cy.swapTiles(14, 23)
    cy.swapTiles(21, 22)
    cy.swapTiles(1, 11)
    cy.swapTiles(2, 13)
    cy.swapTiles(2, 6)

    cy.get('#last-game-stats').should('have.length', 1)
    cy.get('#stat-wins').contains('2')
    cy.get('#stat-moves').contains('10')
    cy.get('#stat-avg-moves').contains('9.00')
    cy.get('.close-icon').click()

    cy.get('.settings-icon').click()
    cy.get('#timer-switch').click()
    cy.get('.close-icon').click()

    cy.get('.stats-icon').click()
    cy.get('#stat-time').contains(/0:0(1|2|3|4|5|6)/)
    cy.get('#stat-avg-time').contains(/0:0(1|2|3|4|5|6)/)
  })
})
