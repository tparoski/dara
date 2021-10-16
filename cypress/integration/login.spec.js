/// <reference types ="Cypress" />
import login from "../fixtures/login.json"
import sideBar from "../fixtures/sideBar.json"
import data from "../fixtures/data.json"
import url from "../fixtures/url.json"
describe('prvi testovi', () => {
    beforeEach(() => {
        cy.visit(url.login, { timeout: 30000 })
    });
    it('empty', () => {
        cy.get(login.form.loginButton).click()
        cy.get(login.erros.email)
        cy.get(login.erros.pass)
    });
    it('missing email', () => {
        cy.get(login.form.emailLogin).clear()
        cy.get(login.form.passwordLogin).clear().type(data.user.password)
        cy.get(login.form.loginButton).click()
        cy.get(login.erros.email)
    });
    it('missing password', () => {
        cy.get(login.form.emailLogin).clear().type(data.user.email)
        cy.get(login.form.passwordLogin).clear()
        cy.get(login.form.loginButton).click()
        cy.get(login.erros.pass)
    });
    it('wrong pass', () => {
        cy.get(login.form.emailLogin).clear().type(data.user.email)
        cy.get(login.form.passwordLogin).clear().type(data.userInvalid.wrongPass)
        cy.get(login.form.loginButton).click()
        cy.get(login.erros.pass)
    });
    it('wrong email', () => {
        cy.get(login.form.emailLogin).clear().type(data.userInvalid.wrongEmail)
        cy.get(login.form.passwordLogin).clear().type(data.user.password)
        cy.get(login.form.loginButton).click()
        cy.get(login.erros.wrongCredentials)
    });
    it('email without @', () => {
        cy.get(login.form.emailLogin).clear().type(data.userInvalid.emailNoAt)
        cy.get(login.form.passwordLogin).clear().type(data.user.password)
        cy.get(login.form.loginButton).click()
    });
    it('email without dot', () => {
        cy.get(login.form.emailLogin).clear().type(data.userInvalid.emailNoDot)
        cy.get(login.form.passwordLogin).clear().type(data.user.password)
        cy.get(login.form.loginButton).click()
    });
    it('trim spaces', () => {
        cy.get(login.form.emailLogin).clear().type("   " + data.user.email)
        cy.get(login.form.passwordLogin).clear().type("   " + data.user.password)
        cy.get(login.form.loginButton).click()
        cy.get(login.erros.wrongCredentials)
    });
    it('login,logout', () => {
        cy.get(login.form.emailLogin).clear().type(data.user.email)
        cy.get(login.form.passwordLogin).clear().type(data.user.password)
        cy.get(login.form.loginButton).click()
        cy.get(sideBar.logout.logo).click()
        cy.get(sideBar.logout.me).click()
        cy.get(sideBar.logout.logout).click()
    });
})
