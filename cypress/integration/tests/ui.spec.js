/// <reference types="cypress" />

describe('quintessential', () => {
  beforeEach(() => {
    cy.restoreLocalStorage()
  })

  afterEach(() => {
    cy.saveLocalStorage()
  })

  it('should display the help modal', () => {
    cy.visit('http://localhost:3000/')
    cy.get('#help-modal').should('have.length', 1)
    cy.get('.close-icon').click()
  })

  it('should not display the help modal again', () => {
    cy.visit('http://localhost:3000/')
    cy.get('#help-modal').should('have.length', 0)
  })

  it('can open/close help modal', () => {
    cy.visit('http://localhost:3000/')
    cy.get('.help-icon').click()
    cy.get('#help-modal').should('have.length', 1)
    cy.get('.close-icon').click()
    cy.get('#help-modal').should('have.length', 0)
  })

  it('can open/close settings modal', () => {
    cy.visit('http://localhost:3000/')
    cy.get('.settings-icon').click()
    cy.get('#settings-modal').should('have.length', 1)
    cy.get('.close-icon').click()
    cy.get('#settings-modal').should('have.length', 0)
  })

  it('can open/close stats modal', () => {
    cy.visit('http://localhost:3000/')
    cy.get('.stats-icon').click()
    cy.get('#last-game-stats').should('have.length', 0)
    cy.get('#stats-modal').should('have.length', 1)
    cy.get('.close-icon').click()
    cy.get('#stats-modal').should('have.length', 0)
  })

  it('can toggle timer', () => {
    cy.visit('http://localhost:3000/')

    // ensure timer is not displayed
    cy.get('#timer').should('have.length', 0)
    cy.get('.stats-icon').click()
    cy.get('#stat-avg-time').should('have.length', 0)
    cy.get('#stat-time').should('have.length', 0)
    cy.get('.close-icon').click()

    // turn timer on
    cy.get('.settings-icon').click()
    cy.get('#timer-switch').click()
    cy.get('.close-icon').click()

    // ui should show timer
    cy.get('#timer').should('have.length', 1)

    // stats should show avg time
    cy.get('.stats-icon').click()
    cy.get('#stat-avg-time').should('have.length', 1)
    cy.get('.close-icon').click()
  })

  it('can play random game', () => {
    cy.visit('http://localhost:3000/')
    cy.get('.settings-icon').click()
    cy.get('#settings-modal').should('have.length', 1)
    cy.get('#random-button').click()
    cy.get('#settings-modal').should('have.length', 0)
    // TODO: verify there is a random game displayed
  })

  it('can clear stats', () => {
    cy.visit('http://localhost:3000/')
    cy.get('.settings-icon').click()
    cy.get('#settings-modal').should('have.length', 1)
    cy.get('#clear-stats-button').click()
    cy.get('#settings-modal').should('have.length', 0)
    // TODO: verify stats are cleared
  })

  // it('edit mode works', () => {
  //   // ensure that edit mode works
  // })

  // it('last game stats should display after win', () => {
  // play a game and
  //   // ensure that last game stats are displayed and accurage
  // })

  // it('allows you to copy your stats', () => {
  //   // ensure that share works and respects timer settings
  // })
})
