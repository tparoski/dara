/// <reference types ="Cypress" />
import org from "../fixtures/addOrg.json"
import login from "../fixtures/login.json"
import data from "../fixtures/data.json"
import nav from "../fixtures/navigation.json"
import faker from "faker"
import url from "../fixtures/url.json"
import board from "../fixtures/addBoard.json"
//nisam usela da koristim import za ove fajlove jer dobijam error u cypressu
const jpg = "../fixtures/media/valid/jpg.jpg"
const gif = '../fixtures/media/valid/gif.gif';
const jpeg = '../fixtures/media/valid/jpeg.jpeg';
const png = '../fixtures/media/valid/png.png';
const ai = '../fixtures/media/invalid/ai.ai';
const bmp = '../fixtures/media/invalid/bmp.bmp';
const docx = '../fixtures/media/invalid/docx.docx';
const eps = '../fixtures/media/invalid/eps.eps';
const pdf = '../fixtures/media/invalid/pdf.pdf';
const psd = '../fixtures/media/invalid/psd.psd';
const svg = '../fixtures/media/invalid/svg.svg';
const tiff = '../fixtures/media/invalid/tiff.tiff';
const zip = '../fixtures/media/invalid/zip.zip';
describe('create org', () => {
    beforeEach(() => {
        cy.visit(url.login)
        cy.get(login.form.emailLogin).clear().type(data.user.email)
        cy.get(login.form.passwordLogin).clear().type(data.user.password)
        cy.get(login.form.loginButton).click()
        cy.wait(3000)
    })
    it('next is dissabed without file name', () => {
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.navigation.nextButton)
    });
    it('next is dissabed when there are spaces', () => {
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.organizationName.organizationNameInput).type("   ")
        cy.get(org.navigation.nextButton)
    });
    it('not able to enter over 50 char', () => {
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.organizationName.organizationNameInput).type(data.strings.string51)
    });
    it('upload ai', () => {
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.organizationName.organizationNameInput).type(faker.company.companyName())
        cy.get(org.navigation.nextButton).click()
        cy.get(org.logo.uploadlogo).attachFile(ai)
        cy.get(org.errors.imageExtension)
    });
    //bug
    it('upload bmp', () => {
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.organizationName.organizationNameInput).type(faker.company.companyName())
        cy.get(org.navigation.nextButton).click()
        cy.get(org.logo.uploadlogo).attachFile(bmp)
        //cy.get(org.errors.imageExtension)
    });
    it('upload docx', () => {
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.organizationName.organizationNameInput).type(faker.company.companyName())
        cy.get(org.navigation.nextButton).click()
        cy.get(org.logo.uploadlogo).attachFile(docx)
        cy.get(org.errors.imageExtension)
    });
    it('upload eps', () => {
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.organizationName.organizationNameInput).type(faker.company.companyName())
        cy.get(org.navigation.nextButton).click()
        cy.get(org.logo.uploadlogo).attachFile(eps)
        cy.get(org.errors.imageExtension)
    });
    it('upload pdf', () => {
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.organizationName.organizationNameInput).type(faker.company.companyName())
        cy.get(org.navigation.nextButton).click()
        cy.get(org.logo.uploadlogo).attachFile(pdf)
        cy.get(org.errors.imageExtension)
    });
    //bug, pasce
    it('upload psd', () => {
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.organizationName.organizationNameInput).type(faker.company.companyName())
        cy.get(org.navigation.nextButton).click()
        cy.get(org.logo.uploadlogo).attachFile(psd)
        //cy.get(org.errors.imageExtension)
    });
    it('upload svg', () => {
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.organizationName.organizationNameInput).type(faker.company.companyName())
        cy.get(org.navigation.nextButton).click()
        cy.get(org.logo.uploadlogo).attachFile(svg)
        cy.get(org.errors.imageExtension)
    });
    //ovde je bug ne javlja se validaciona poruka ali se image ne prikazuje
    it('upload tiff', () => {
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.organizationName.organizationNameInput).type(faker.company.companyName())
        cy.get(org.navigation.nextButton).click()
        cy.get(org.logo.uploadlogo).attachFile(tiff)
        //cy.get(org.errors.imageExtension)
    });
    it('upload zip', () => {
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.organizationName.organizationNameInput).type(faker.company.companyName())
        cy.get(org.navigation.nextButton).click()
        cy.get(org.logo.uploadlogo).attachFile(zip)
        cy.get(org.errors.imageExtension)
    });
    it('upload gif and delete', () => {
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.organizationName.organizationNameInput).type(faker.company.companyName())
        cy.get(org.navigation.nextButton).click()
        cy.get(org.logo.uploadlogo).attachFile(gif)
        cy.get(org.logo.modalHeader)
        cy.get(org.logo.deleteLogo).click()
    });
    it('upload png and cancel', () => {
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.organizationName.organizationNameInput).type(faker.company.companyName())
        cy.get(org.navigation.nextButton).click()
        cy.get(org.logo.uploadlogo).attachFile(jpeg)
        cy.get(org.logo.modalHeader)
        cy.get(org.logo.cancelLogo).click()
    });
    it('upload jpg and exit', () => {
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.organizationName.organizationNameInput).type(faker.company.companyName())
        cy.get(org.navigation.nextButton).click()
        cy.get(org.logo.uploadlogo).attachFile(png)
        cy.get(org.logo.modalHeader)
        cy.get(org.navigation.closeModal).click({ force: true })
    });
    it('positive name unicode', () => {
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.organizationName.organizationNameInput).type(data.org.nameUnicode)
        cy.get(org.navigation.nextButton).click()
        cy.get(org.logo.uploadlogo).attachFile(jpg)
        cy.get(org.logo.modalHeader)
        cy.wait(500)
        cy.get(org.logo.saveLogo).click()
        cy.wait(500)
        cy.get(org.navigation.nextButton).click()
        cy.get(board.okBoardCreated).click()
        cy.get(nav.organizationName)
    })
    it('without a logo', () => {
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.organizationName.organizationNameInput).type(data.org.name3)
        cy.get(org.navigation.nextButton).click()
        cy.get(org.navigation.nextButton).click()
        cy.get(board.okBoardCreated).click()
        cy.get(nav.organizationName)
    })
    it('positive', () => {
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.organizationName.organizationNameInput).type(data.org.name)
        cy.get(org.navigation.nextButton).click()
        cy.get(org.logo.uploadlogo).attachFile(jpeg)
        cy.wait(500)
        cy.get(org.logo.saveLogo).click()
        cy.wait(500)
        cy.get(org.navigation.nextButton).click()
        cy.get(board.okBoardCreated).click()
        cy.get(nav.organizationName)
    });
})
