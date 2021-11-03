import data from "../fixtures/data.json"
const faker = require("faker");
module.exports = {
    get email() {
        return cy.get("input[name='email']")
    },
    get password() {
        return cy.get("input[type='password']")
    },
    get noOfUsers() {
        return cy.get("input[name='number_of_users']")
    },
    get checkBox() {
        return cy.get("input[type='checkbox']")
    },
    get seePass() {
        return cy.get("button[type='button']")
    },
    get submit() {
        return cy.get("button[type='submit']")
    },
    get registerWithGoogle() {
        return cy.get("button[class='vs-c-btn vs-c-btn--social-auth vs-c-btn--gp']")
    },
    get registerWithFacebook() {
        return cy.get("button[class='vs-c-btn vs-c-btn--social-auth vs-c-btn--fb']")
    },
    get registerWithTwitter() {
        return cy.get("button[class='vs-c-btn vs-c-btn--social-auth vs-c-btn--tw']")
    },
    get registerWithRegzenLOL() {
        return cy.get("button[class='vs-c-btn vs-c-btn--social-auth vs-c-btn--regzen']")
    },
    get goToLogin() {
        return cy.get("a[href='/login']")
    },
    get errorEmail() {
        return cy.get("div[class='el-form-item']:first-child span")
    },
    get errorPassword() {
        return cy.get("div[class='el-form-item']:nth-child(2) span")
    },
    get errorNoOfUsers() {
        return cy.get("div[class='el-form-item']:nth-child(3) span")
    },
    get errorCheckBox() {
        return cy.get("div[class='el-form-item']:nth-child(4) span[class='el-form-item__error el-form-item-error--top']")
    },
    get beError() {
        return cy.get(".el-message__group > p")
    },
    get allErrors() {
        return cy.get("div[class=vs-c-form-item__error-wrapper]")
    },
    //napravila sam dve funkcije jer kada napravim da jedna funkcija pokriva sve potrebe celog speca izgleda dosta ruzno sa previse if-ova. pretpostavila sam da je tako nesto losa praksa, pa mi se ovo ucinilo potencijalno boljom idejom
    registerValid({ eye = false }) {
        cy.intercept('POST', 'https://cypress-api.vivifyscrum-stage.com/api/v2/register').as('register')
        const email = faker.internet.email().toLowerCase()
        const password = faker.internet.password()
        const noOfUsers = Math.floor(Math.random() * 10) + 1;
        this.email.should("be.visible").type(email);
        this.password.should("be.visible").type(password);
        this.noOfUsers.should("be.visible").type(noOfUsers);
        if (eye == true) {
            this.seePass.click()
        }
        this.submit.should("be.visible").click();
        cy.wait('@register').its("response").then((res) => {
            expect(res.statusCode).to.eq(200);
            expect(res.body.user.email).to.eq(email);
            expect(res.body.user.premium_plan_members).to.eq(noOfUsers);
        })
    },
    registerInValid({ email = faker.internet.email().toLowerCase(), password = data.user.password, noOfUsers = data.userNumbers.ten, checkBox = true }) {
        if (email == "" || password == "" || noOfUsers == "") {
            this.checkBox.uncheck({ force: true })
            this.submit.click();
        } else {
            this.email.should("be.visible").type(email);
            this.password.should("be.visible").type(password);
            this.noOfUsers.should("be.visible").type(noOfUsers);
            if (checkBox) {
                this.checkBox.check({ force: true })
            } else {
                this.checkBox.uncheck({ force: true })
            }
            this.submit.should("be.visible").click()
        }
    }
}
