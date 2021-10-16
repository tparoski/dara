/// <reference types ="Cypress" />
import board from "../fixtures/addBoard.json"
import org from "../fixtures/addOrg.json"
import login from "../fixtures/login.json"
import data from "../fixtures/data.json"
import faker from "faker"
import url from "../fixtures/url.json"
import sideBar from "../fixtures/sideBar.json"
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

describe('create board and name', () => {
    before(() => {
        cy.visit(url.login, {timeout: 30000})
        cy.get(login.form.emailLogin).clear().type(data.user.email)
        cy.get(login.form.passwordLogin).clear().type(data.user.password)
        cy.get(login.form.loginButton).click()
        cy.wait(3000)
        cy.get(org.navigation.addNewOrganization, {timeout: 30000}).click()
        cy.get(org.organizationName.organizationNameInput).type(data.org.name3)
        cy.get(org.navigation.nextButton).click()
        cy.get(org.navigation.nextButton).click()
        cy.get(board.okBoardCreated).click()
        cy.get(sideBar.logout.logo).click()
        cy.get(sideBar.logout.me).click()
        cy.get(sideBar.logout.logout).click()
    })
    beforeEach(() => {
        cy.visit(url.login, {timeout: 30000})
        cy.get(login.form.emailLogin).clear().type(data.user.email)
        cy.get(login.form.passwordLogin).clear().type(data.user.password)
        cy.get(login.form.loginButton).click()
        cy.wait(3000)
    })
    it('next is dissabed without file name', () => {
        cy.get(board.addFromDashboard.addBoard).click()
        cy.get(board.navigation.nextButton)
    });
    it('next is dissabed when there are spaces in filename', () => {
        cy.get(board.addFromDashboard.addBoard).click()
        cy.get(board.newBoard.title).type(data.strings.onlyspaces)
        cy.get(board.navigation.nextButton)
    });
    it('not able to enter over 50 char', () => {
        cy.get(board.addFromDashboard.addBoard).click()
        cy.get(board.newBoard.title).type(data.strings.string51)
        cy.get(board.newBoard.title)
    });
    it('next is dissabed  without organization', () => {
        cy.get(board.addFromSidebarUp.addNewSomething).click()
        cy.get(board.addFromSidebarUp.addBoard).click()
        cy.get(board.newBoard.title).type(faker.internet.domainName())
        cy.get(board.navigation.nextButton)
    });
    it('upload ai', () => {
        cy.get(board.addFromDashboard.addBoard).click()
        cy.get(board.newBoard.title).type(faker.internet.domainName())
        cy.get(board.navigation.nextButton).click()
        cy.get(board.boardType.scrum).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.logo.uploadlogo).attachFile(ai)
        cy.get(board.errors.imageExtension)
    });
    it('upload bmp', () => {
        cy.get(board.addFromDashboard.addBoard).click()
        cy.get(board.newBoard.title).type(faker.internet.domainName())
        cy.get(board.navigation.nextButton).click()
        cy.get(board.boardType.scrum).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.logo.uploadlogo).attachFile(bmp)
        //cy.get(board.errors.imageExtension)
    });
    it('upload docx', () => {
        cy.get(board.addFromDashboard.addBoard).click()
        cy.get(board.newBoard.title).type(faker.internet.domainName())
        cy.get(board.navigation.nextButton).click()
        cy.get(board.boardType.scrum).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.logo.uploadlogo).attachFile(docx)
        cy.get(board.errors.imageExtension)
    });
    it('upload eps', () => {
        cy.get(board.addFromDashboard.addBoard).click()
        cy.get(board.newBoard.title).type(faker.internet.domainName())
        cy.get(board.navigation.nextButton).click()
        cy.get(board.boardType.scrum).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.logo.uploadlogo).attachFile(eps)
        cy.get(board.errors.imageExtension)
    });
    it('upload pdf', () => {
        cy.get(board.addFromDashboard.addBoard).click()
        cy.get(board.newBoard.title).type(faker.internet.domainName())
        cy.get(board.navigation.nextButton).click()
        cy.get(board.boardType.scrum).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.logo.uploadlogo).attachFile(pdf)
        cy.get(board.errors.imageExtension)
    });
    it('upload psd', () => {
        cy.get(board.addFromDashboard.addBoard).click()
        cy.get(board.newBoard.title).type(faker.internet.domainName())
        cy.get(board.navigation.nextButton).click()
        cy.get(board.boardType.scrum).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.logo.uploadlogo).attachFile(psd)
        //cy.get(board.errors.imageExtension)
    });
    it('upload svg', () => {
        cy.get(board.addFromDashboard.addBoard).click()
        cy.get(board.newBoard.title).type(faker.internet.domainName())
        cy.get(board.navigation.nextButton).click()
        cy.get(board.boardType.scrum).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.logo.uploadlogo).attachFile(svg)
        cy.get(board.errors.imageExtension)
    });
    it('upload tiff', () => {
        cy.get(board.addFromDashboard.addBoard).click()
        cy.get(board.newBoard.title).type(faker.internet.domainName())
        cy.get(board.navigation.nextButton).click()
        cy.get(board.boardType.scrum).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.logo.uploadlogo).attachFile(tiff)
        //cy.get(board.errors.imageExtension)
    });
    it('upload zip', () => {
        cy.get(board.addFromDashboard.addBoard).click()
        cy.get(board.newBoard.title).type(faker.internet.domainName())
        cy.get(board.navigation.nextButton).click()
        cy.get(board.boardType.scrum).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.logo.uploadlogo).attachFile(zip)
        cy.get(board.errors.imageExtension)
    });
    it('upload gif and delete', () => {
        cy.get(board.addFromDashboard.addBoard).click()
        cy.get(board.newBoard.title).type(faker.internet.domainName())
        cy.get(board.navigation.nextButton).click()
        cy.get(board.boardType.scrum).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.logo.uploadlogo).attachFile(gif)
        cy.get(board.logo.modalHeader)
        cy.get(board.logo.deleteLogo).click()
    });
    it('upload png and cancel', () => {
        cy.get(board.addFromDashboard.addBoard).click()
        cy.get(board.newBoard.title).type(faker.internet.domainName())
        cy.get(board.navigation.nextButton).click()
        cy.get(board.boardType.scrum).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.logo.uploadlogo).attachFile(jpeg)
        cy.get(board.logo.modalHeader)
        cy.get(board.logo.cancelLogo).click()
    });
    it('upload jpg and exit', () => {
        cy.get(board.addFromDashboard.addBoard).click()
        cy.get(board.newBoard.title).type(faker.internet.domainName())
        cy.get(board.navigation.nextButton).click()
        cy.get(board.boardType.scrum).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.logo.uploadlogo).attachFile(png)
        cy.get(board.logo.modalHeader)
        cy.get(board.navigation.closeModal).click({ force: true })
    });
    it('positive jpg, scrum', () => {
        cy.get(board.addFromDashboard.addBoard).click()
        cy.get(board.newBoard.title).type(data.board.justName)
        cy.get(board.navigation.nextButton).click()
        cy.get(board.boardType.scrum).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.logo.uploadlogo).attachFile(jpg)
        cy.get(board.logo.saveLogo).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.navigation.nextButton).click()
        cy.wait(2000)
        cy.get(board.visitNewBoardFromSideBar)
    });
    it('positive png, kanban', () => {
        cy.get(board.addFromDashboard.addBoard).click()
        cy.get(board.newBoard.title).type(data.board.name2)
        cy.get(board.navigation.nextButton).click()
        cy.get(board.boardType.kanban).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.logo.uploadlogo).attachFile(png)
        cy.get(board.logo.saveLogo).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.navigation.nextButton).click()
        cy.wait(2000)
        cy.get(board.visitNewBoardFromSideBar)
    });
    it('unicode name, gif image', () => {
        cy.get(board.addFromDashboard.addBoard).click()
        cy.get(board.newBoard.title).type(data.board.nameUnicode)
        cy.get(board.navigation.nextButton).click()
        cy.get(board.boardType.kanban).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.logo.uploadlogo).attachFile(gif)
        cy.get(board.logo.saveLogo).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.navigation.nextButton).click()
        cy.wait(2000)
        cy.get(board.visitNewBoardFromSideBar)
    });
    it('no logo, no config, no members', () => {
        cy.get(board.addFromDashboard.addBoard).click()
        cy.get(board.newBoard.title).type(data.board.nameNoLogo)
        cy.get(board.navigation.nextButton).click()
        cy.get(board.boardType.kanban).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.visitNewBoardFromSideBar)
    });
    it('board with members and config from positive jpg, scrum', () => {
        cy.wait(3000)
        cy.get(board.addFromDashboard.addBoard).click()
        cy.get(board.newBoard.title).type(data.board.name3)
        cy.get(board.navigation.nextButton).click()
        cy.get(board.boardType.kanban).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.import.configuration).click()
        cy.get(board.import.input).eq(0).type("Some{downarrow}{enter}")
        cy.get(board.import.members).click()
        cy.get(board.import.input).eq(1).type("Some{downarrow}{enter}")
        cy.get(board.navigation.nextButton).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.visitNewBoardFromSideBar)
    });
});
