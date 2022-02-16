/// <reference types="cypress" />

const puzzles = [
  'pizza,bacon,sauce,curds,crust',
  'herbs,thyme,onion,basil,chard',
  'heart,candy,flirt,cupid,adore',
]

describe('stats', () => {
  beforeEach(() => {
    cy.restoreLocalStorage()
  })

  afterEach(() => {
    cy.saveLocalStorage()
  })

  it('should display streak correctly', () => {
    localStorage.clear()
    cy.visit('http://localhost:3000/?f&p=2022-02-15')
    cy.get('.close-icon').click()
    puzzles.forEach((puzzle) => {
      localStorage.setItem(`quintessential-save-${puzzle}`, puzzle + ':8-60')
    })

    cy.swapTiles(0, 12)
    cy.swapTiles(2, 6)
    cy.swapTiles(24, 8)
    cy.swapTiles(15, 9)
    cy.swapTiles(16, 17)
    cy.swapTiles(4, 14)
    cy.swapTiles(21, 10)
    cy.swapTiles(23, 13)

    cy.get('#stat-streak').contains('4')

    cy.get('.close-icon').click()
    cy.get('.settings-icon').click()
    cy.get('#settings-modal').should('have.length', 1)
    cy.get('#random-button').click()
    cy.swapTiles(20, 23)
    cy.get('#stat-streak').contains('4')

    cy.visit('http://localhost:3000/?f&p=2022-02-16')
    cy.swapTiles(10, 8)
    cy.swapTiles(11, 2)
    cy.swapTiles(21, 18)
    cy.swapTiles(7, 19)
    cy.swapTiles(0, 20)
    cy.swapTiles(17, 1)
    cy.swapTiles(5, 3)
    cy.swapTiles(24, 12)

    cy.get('#stat-streak').contains('5')

    cy.visit('http://localhost:3000/?f&p=2022-02-18')
    cy.swapTiles(7, 10)
    cy.swapTiles(2, 14)
    cy.swapTiles(22, 17)
    cy.swapTiles(1, 12)
    cy.swapTiles(5, 20)
    cy.swapTiles(21, 6)
    cy.swapTiles(15, 0)
    cy.clock(new Date(Date.now() + 48 * 3600 * 1000))
    cy.tick(5000)
    cy.swapTiles(3, 8)
    cy.tick(5000)

    cy.get('#stat-streak').contains('1')
  })
})
