import data from "../fixtures/data.json"
import sideBarModule from "../models/sideBarModule"
module.exports = {
    get emailLogin() {
        return cy.get("input[type='email']")
    },
    get passwordLogin() {
        return cy.get("input[type='password']")
    },
    get forgotPass() {
        return cy.get("a[href='/forgot-password']")
    },
    get loginButton() {
        return cy.get("button[type='submit']")
    },
    get backToHome() {
        return cy.get("a[href='https://www.vivifyscrum.com']")
    },
    get goToSignup() {
        return cy.get("a[href='https://www.vivifyscrum.com/pricing']")
    },
    get allErrors() {
        return cy.get("span[class='el-form-item__error el-form-item-error--top']")
    },
    get wrongCredentials() {
        return cy.get("span[class='el-form-item__error']")
    },
    get passError() {
        return cy.get("form>div:nth-child(2) span")
    },
    get emailError() {
        return cy.get("form>div:first-child span")
    },
    login({ email = data.user.email, password = data.user.password }) {
        if (email == "") {
            this.passwordLogin.should("be.visible").type(password);
            this.loginButton.click();
        } else if (password == "") {
            this.emailLogin.should("be.visible").type(email);
            this.loginButton.click();
        } else {
            cy.intercept("POST", "**/api/v2/login").as("login");
            this.emailLogin.should("be.visible").type(email);
            this.passwordLogin.should("be.visible").type(password);
            this.loginButton.click();
            if (email == data.user.email && password == data.user.password) {
                cy.wait("@login").then((intercept) => {
                    expect(intercept.response.statusCode).to.eql(200);
                });
            }
        }
    },
    logout() {
        cy.intercept('POST', '/api/v2/logout').as('loggedOut');
        sideBarModule.logo.should('be.visible').click();
        sideBarModule.me.should("be.visible").click();
        sideBarModule.logout.should("be.visible").click();
        cy.wait('@loggedOut').its("response").then((res) => {
            expect(res.statusCode).to.eq(201);
        })
    }
}