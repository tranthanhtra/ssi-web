<template>
  <div class="container-login">
    <div class="wrapper">
      <div class="btn-metamask-login">
        <button id="metamask-login" @click="loginWithMetamask()">
          <img src="../../assets/favicon.png" alt="" />
          Login with Metamask
        </button>
      </div>
      <p>OR</p>
      <div>
        <label style="font-weight: 600" for="email">Email:</label>
        <div class="field email">
          <div class="input-area">
            <input type="email" id="email" v-model="formLogin.email" />
          </div>
          <div class="error error-txt" v-if="emptyEmail">
            Email can't be blank
          </div>
        </div>

        <div class="field password">
          <label style="font-weight: 600" class="text" for="password"
            >Password:</label
          >
          <div class="input-area">
            <input type="password" id="password" v-model="formLogin.password" />
          </div>
          <div class="error error-txt" v-if="emptyPass">
            Password can't be blank
          </div>
        </div>

        <button class="login-btn" @click="login()">Login</button>
      </div>
      <div class="pass-txt">
        <a @click="forgotPass()" class="pass-forgot-btn" href="#"
          >Forgot password?</a
        >
      </div>
      <div class="sign-txt">
        Don't have an account?
        <a @click="signup()" class="signup-btn" href="#">Signup now</a>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import { emailRegex, LOCAL_STORAGE_TOKEN_NAME } from "../../utils/constants";
import { postDataApi } from "../../utils/fetchApi";
import { Web3Service } from "@/utils/web3Service";
import Web3 from "web3";

export default {
  setup() {
    const state = reactive({
      formLogin: {
        email: "",
        password: "",
      },

      emptyEmail: false,
      emptyPass: false,
    });

    const web3 = new Web3(window.ethereum);

    const Web3Service = {
      signMessage: async (message, account, callback) => {
        const hash = Web3.utils.sha3(message);
        console.log(hash);
        await web3.eth
          .sign(hash, account, (e, signature) => {
            console.log(signature);
            callback(hash, signature);
          })
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
      },
    };

    const VCModel = {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.w3.org/2018/credentials/examples/v1",
      ],

      // "id": "http://example.edu/credentials/1872",

      type: ["VerifiableCredential"],

      issuer: "",

      issuanceDate: "2010-01-01T19:23:24Z",

      credentialSubject: {
        id: "did:example:ebfeb1f712ebc6f1c276e12ec21",

        degree: {
          type: "BachelorDegree",
          name: "Bachelor of Science and Arts",
        },
      },
    };

    const proofModel = {
      type: "ECDSA",

      created: "2017-06-18T21:19:10Z",

      proofPurpose: "assertionMethod",

      verificationMethod: "",

      proofValue: "",
    };

    const VPModel = {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.w3.org/2018/credentials/examples/v1",
      ],
      type: "VerifiablePresentation",

      verifiableCredential: [],

      proof: {
        type: "RsaSignature2018",
        created: "2018-09-14T21:19:10Z",
        proofPurpose: "authentication",
        verificationMethod: "",
        challenge: "1f44d55f-f161-4938-a659-f8026467f126",
        domain: "4jt78h47fh47",
        jws: "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..kTCYt5XsITJX1CxPCT8yAV-TVIw5WEuts01mq-pQy7UJiN5mgREEMGlv50aqzpqh4Qq_PbChOMqsLfRoPsnsgxD-WUcX16dUOqV0G_zS245-kronKb78cPktb3rk-BuQy72IFLN25DYuNzVBAh4vGHSrQyHUGlcTwLtjPAnKb78",
      },
    };

    const credentialService = {
      issue: (type, degreeType, degreeName, subjectId) => {
        const newVC = VCModel;

        newVC.type.push(type);
        newVC.issuanceDate = new Date().toJSON();
        newVC.credentialSubject.id = subjectId;
        newVC.credentialSubject.degree.type = degreeType;
        newVC.credentialSubject.degree.name = degreeName;

        let ethereum = window.ethereum;

        ethereum
          .request({ method: "eth_requestAccounts" })
          .then((accounts) => {
            const account = accounts[0];
            console.log(account);
            Web3Service.signMessage(
              newVC.toString(),
              account,
              (hash, signature) => {
                newVC.issuer = account;
                newVC["proof"] = proofModel;
                newVC.proof.created = new Date().toJSON();
                newVC.proof.proofValue = signature;
                console.log(JSON.stringify(newVC));
              }
            );
          })
          .catch((error) => {
            console.log(error, error.code);

            alert(error.code);
          });
      },

      createPresentation: (certificate) => {
        console.log(certificate);
        const newVC = VCModel;

        let ethereum = window.ethereum;

        ethereum
          .request({ method: "eth_requestAccounts" })
          .then((accounts) => {
            const account = accounts[0];
            console.log(account);
            Web3Service.signMessage(
              newVC.toString(),
              account,
              (hash, signature) => {
                newVC.issuer = account;
                newVC["proof"] = proofModel;
                newVC.proof.created = new Date().toJSON();
                newVC.proof.proofValue = signature;
                console.log(JSON.stringify(newVC));
              }
            );
          })
          .catch((error) => {
            console.log(error, error.code);

            alert(error.code);
          });
      },
    };

    return {
      ...toRefs(
        state,
        web3,
        Web3Service,
        VCModel,
        proofModel,
        VPModel,
        credentialService
      ),
    };
  },

  methods: {
    // normal login
    async login() {
      if (!this.formLogin.email || !this.formLogin.password) {
        // TODO: more UX-UI
        alert("Email hoặc mật khẩu không được để trống.");
        return;
      }

      if (!String(this.formLogin.email).toLowerCase().match(emailRegex)) {
        alert("Email không đúng định dạng.");
        return;
      }

      try {
        const res = await postDataApi("/login", {
          email: this.formLogin.email,
          password: this.formLogin.password,
        });

        if (res.status === 200) {
          localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, res.data.accessToken);
          this.$router.push("/home");
        }
      } catch (err) {
        console.log(err);
        if (err.response.data) {
          alert(err.response.data.message);
        } else {
          alert("Đã có lỗi xảy ra, vui lòng đăng nhập lại.");
        }
      }
    },

    // web3 - login with Metamask
    async loginWithMetamask() {
      let ethereum = window.ethereum;

      ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          const account = accounts[0];
          console.log(account);
          const message = "Some string";
          Web3Service.signMessage(message, account, async (hash, signature) => {
            const res = await postDataApi("/login_with_metamask", {
              hash,
              signature,
            });
            if (res.status === 200) {
              localStorage.setItem(
                LOCAL_STORAGE_TOKEN_NAME,
                res.data.accessToken
              );
              this.$router.push("/home");
            }
          });
        })
        .catch((error) => {
          console.log(error, error.code);

          alert(error.code);
        });
    },

    forgotPass() {
      alert("Coming soon...");
    },

    signup() {
      alert("Coming soon...");
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

body {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #5372f0;
}

::selection {
  color: #fff;
  background: #5372f0;
}

.container-login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #d0fcee;
}

.btn-metamask-login {
  display: flex;
  justify-content: center;
}

button#metamask-login {
  border: none;
  background: #fff;
  border-radius: 50px;
  padding: 10px 25px 10px 25px;
  font-size: medium;
  display: flex;
  align-items: center;
  justify-content: center;
}

button#metamask-login img {
  height: 30px;
  margin-right: 10px;
}

button#metamask-login:hover {
  background: #fff4df;
  transition: 0.3s;
}

input#email,
input#password {
  outline: none;
  border-radius: 11px;
  border: 1px solid;
  padding: 7px 10px 7px 10px;
  width: 250px;
}

button.login-btn {
  border: none;
  padding: 7px 104px;
  background: #5372f0;
  border-radius: 11px;
  color: #fff;
  font-size: medium;
  margin: 5px 0;
}

button.login-btn:hover {
  background: #6a84ef;
  transition: 0.3s;
}

.field.email,
.field.password {
  margin-bottom: 15px;
}

.wrapper {
  width: 380px;
  padding: 40px 30px 50px 30px;
  background: #e4eef7;
  border-radius: 5px;
  text-align: center;
  box-shadow: 10px 10px 15px rgba(0, 0, 0, 0.1);
}

.wrapper header {
  font-size: 35px;
  font-weight: 600;
}

.wrapper form {
  margin: 40px 0;
}

form .field {
  width: 100%;
  margin-bottom: 20px;
}

form .field.shake {
  animation: shake 0.3s ease-in-out;
}

@keyframes shake {
  0%,
  100% {
    margin-left: 0px;
  }
  20%,
  80% {
    margin-left: -12px;
  }
  40%,
  60% {
    margin-left: 12px;
  }
}

form .field .input-area {
  height: 50px;
  width: 100%;
  position: relative;
}

form input {
  width: 100%;
  height: 100%;
  outline: none;
  padding: 0 5px;
  font-size: 18px;
  background: none;
  caret-color: #5372f0;
  border-radius: 5px;
  border: 1px solid #bfbfbf;
  border-bottom-width: 2px;
  transition: all 0.2s ease;
}

form .field input:focus,
form .field.valid input {
  border-color: #5372f0;
}

form .field.shake input,
form .field.error input {
  border-color: #dc3545;
}

.field .input-area i {
  left: 15px;
  position: absolute;
  top: 50%;
  font-size: 18px;
  pointer-events: none;
  transform: translateY(-50%);
}

.input-area .icon {
  color: #bfbfbf;
  transition: color 0.2s ease;
}

.input-area .error-icon {
  right: 15px;
  color: #dc3545;
}

form input:focus ~ .icon,
form .field.valid .icon {
  color: #5372f0;
}

form .field.shake input:focus ~ .icon,
form .field.error input:focus ~ .icon {
  color: #bfbfbf;
}

form input::placeholder {
  color: #bfbfbf;
  font-size: 17px;
}

form .field .error-txt {
  color: #dc3545;
  text-align: left;
  margin-top: 5px;
}

form .field .error {
  display: none;
}

form .field.shake .error,
form .field.error .error {
  display: block;
}

form .pass-txt {
  text-align: left;
  margin-top: -10px;
}

.wrapper a {
  color: #5372f0;
  text-decoration: none;
}

.wrapper a:hover {
  text-decoration: underline;
}

form input[type="submit"] {
  height: 50px;
  margin-top: 30px;
  color: #fff;
  padding: 0;
  border: none;
  background: #5372f0;
  cursor: pointer;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

form input[type="submit"]:hover {
  background: #2c52ed;
}

p {
  padding-top: 20px;
  color: gray;
}

.text {
  text-align: left;
}

label {
  text-align: left;
}
</style>