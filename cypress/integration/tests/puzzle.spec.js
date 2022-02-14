/// <reference types="cypress" />

// describe('solve', () => {
//   beforeEach(() => {
//     cy.restoreLocalStorage()
//   })

//   afterEach(() => {
//     cy.saveLocalStorage()
//   })

//   it('should display a puzzle', () => {
//     cy.visit('http://localhost:3000/')
//     cy.get('.close-icon').click()
//     cy.get('.tile').should('have.length', 25)
//   })

//   it('allows tapping to swap tiles', () => {
//     cy.visit('http://localhost:3000/')
//     cy.get('.tile.wrong').eq(0).click()
//     cy.get('.tile.wrong').eq(1).click()
//   })

//   it('can be solved', () => {
//     cy.visit('http://localhost:3000/?p=2022-02-12')

//     cy.swapTiles(3, 23)
//     cy.swapTiles(2, 15)
//     cy.swapTiles(4, 13)
//     cy.swapTiles(1, 22)
//     cy.swapTiles(8, 18)
//     cy.swapTiles(0, 10)
//     cy.swapTiles(5, 12)
//     cy.swapTiles(7, 16)

//     // eslint-disable-next-line
//     cy.wait(2000)

//     cy.get('#last-game-stats').should('have.length', 1)
//     cy.get('#stat-moves').contains('8')
//   })

//   it('stats are tracked correctly', () => {
//     cy.visit('http://localhost:3000/?p=2022-02-13')

//     cy.swapTiles(17, 5)
//     cy.swapTiles(4, 6)
//     cy.swapTiles(20, 8)
//     cy.swapTiles(24, 16)
//     cy.swapTiles(14, 23)
//     cy.swapTiles(21, 22)
//     cy.swapTiles(1, 11)
//     cy.swapTiles(2, 13)
//     cy.swapTiles(11, 13)

//     // eslint-disable-next-line
//     cy.wait(2000)

//     cy.get('#last-game-stats').should('have.length', 1)
//     cy.get('#stat-wins').contains('2')
//     cy.get('#stat-moves').contains('10')
//     cy.get('#stat-avg-moves').contains('9.00')
//     cy.get('.close-icon').click()

//     cy.get('.settings-icon').click()
//     cy.get('#timer-switch').click()
//     cy.get('.close-icon').click()

//     cy.get('.stats-icon').click()
//     cy.get('#stat-time').contains('0:03')
//     cy.get('#stat-avg-time').contains('0:03')
//   })
// })

describe('state', () => {
  beforeEach(() => {
    cy.restoreLocalStorage()
  })

  afterEach(() => {
    cy.saveLocalStorage()
  })

  // it('applies the correct colors to classes based on their state', () => {
  //   cy.visit('http://localhost:3000/?p=2022-02-14')
  //   cy.get('.close-icon').click()
  //   cy.get('.tile.almost').should('have.length', 1)

  //   cy.swapTiles(15, 24)
  //   cy.swapTiles(17, 23)
  //   cy.swapTiles(12, 21)
  //   cy.get('.tile.almost').should('have.length', 1)
  // })

  // it('applies the correct colors to classes based on their state 2', () => {
  //   cy.visit('http://localhost:3000/?p=2022-02-17')
  //   cy.get('.close-icon').click()
  //   cy.get('.tile').eq(1).should('not.have.class', 'almost')
  //   cy.get('.tile').eq(2).should('have.class', 'almost')
  //   cy.get('.tile').eq(3).should('have.class', 'almost')
  //   cy.get('.tile').eq(4).should('not.have.class', 'almost')
  // })

  it('applies the correct colors to classes based on their state 3', () => {
    cy.visit('http://localhost:3000/?p=2022-02-18')
    cy.get('.close-icon').click()
    cy.swapTiles(1, 6)
    cy.swapTiles(7, 12)
    cy.get('.tile').eq(6).should('have.class', 'correct')
    cy.get('.tile').eq(7).should('have.class', 'almost')
  })
})
