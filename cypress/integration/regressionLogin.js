import userApi from "../api/user"
import color from "../support/cosoleColor"

describe('happy', () => {
    let userToken
    before(() => {
        userApi.login({testMessage: "Login before tests"}).then((token) => {
        userToken =token
        })
    })
    
    it('email without @', () => {
        userApi.login({email:"nistatest.com", testMessage: "Wrong email withot @", statusCode: 401})
     });

     it('email without dot', () => {
        userApi.login({email:"nistatest@com", testMessage: "Wrong email withot @", statusCode: 401})
      });

      it('without com', () => {
        userApi.login({password:"hello@f.", testMessage: "Wrong email withot @", statusCode: 401})
      });
      it('without first part', () => {
        userApi.login({password:" @hello.com", testMessage: "Wrong email withot @", statusCode: 401})
      });

      it('wrong pass', () => {
        userApi.login({password:"pass", testMessage: "Wrong email withot @", statusCode: 401})
      });
});