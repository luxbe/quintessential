/// <reference types="cypress" />

describe('state', () => {
  beforeEach(() => {
    cy.restoreLocalStorage()
  })

  afterEach(() => {
    cy.saveLocalStorage()
  })

  it('when letter occurs once in word, only one occurance marked as almost correct', () => {
    cy.visit('http://localhost:3000/?p=2022-02-14&f')
    cy.get('.tile.almost').should('have.length', 1)

    cy.swapTiles(15, 24)
    cy.swapTiles(17, 23)
    cy.swapTiles(12, 21)
    cy.get('.tile.almost').should('have.length', 2)
  })

  it('when letter occurs once in word, only one occurance marked as almost correct 2', () => {
    cy.visit('http://localhost:3000/?p=2022-02-17&f')
    cy.get('.tile').eq(6).should('not.have.class', 'almost')
    cy.get('.tile').eq(0).should('have.class', 'almost')
    cy.get('.tile').eq(1).should('have.class', 'almost')
    cy.get('.tile').eq(7).should('not.have.class', 'almost')
    cy.get('.tile').eq(8).should('not.have.class', 'almost')
  })

  it('when 2 occurances in word and one is correct, other is still marked almost correct', () => {
    cy.visit('http://localhost:3000/?p=2022-02-20&f')
    cy.swapTiles(1, 11)
    cy.swapTiles(15, 12)
    cy.get('.tile').eq(11).should('have.class', 'correct')
    cy.get('.tile').eq(12).should('have.class', 'almost')
  })

  it('should handle many occurrances in many words correctly', () => {
    cy.visit(
      'http://localhost:3000/?s=booth,blast,ooooo,grand,tooth&j=oooho,blast,othbh,grand,otooo&f',
    )
    cy.get('.tile').eq(0).should('have.class', 'wrong')
    cy.get('.tile').eq(1).should('have.class', 'correct')
    cy.get('.tile').eq(2).should('have.class', 'correct')
    cy.get('.tile').eq(3).should('have.class', 'almost')
    cy.get('.tile').eq(4).should('have.class', 'wrong')

    cy.get('.tile').eq(20).should('have.class', 'almost')
    cy.get('.tile').eq(21).should('have.class', 'almost')
    cy.get('.tile').eq(22).should('have.class', 'correct')
    cy.get('.tile').eq(23).should('have.class', 'wrong')
    cy.get('.tile').eq(24).should('have.class', 'wrong')
  })
})
