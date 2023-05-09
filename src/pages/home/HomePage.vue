<template>
  <div class="home-container">
    <div class="left-bar-container">
      <LeftBar/>
    </div>

    <div class="main-content-container">
      <div class="main-content">
        <!-- // TODO: Chào hỏi gì đó -->
        <div class="welcome-title">
          <div class="welcome">Welcome to SSI!</div>
          <div class="btn-create">
            <button @click="openForm()">New User</button>
          </div>
          <div class="btn-create">
            <button @click="openProviderForm()">New Provider</button>
          </div>
        </div>

        <div class="content">
          <div class="logo">
            <img src="../../assets/favicon.png" alt=""/>
          </div>
        </div>
      </div>
    </div>

    <div class="create-user-ssi-container" v-if="isFormOpen">
      <div class="create-form">
        <div class="header-form">
          <div class="header-form-container">
            <div class="title">Create new user</div>
            <button class="x-close" @click="closeForm()">X</button>
          </div>
        </div>

        <div class="body-form">
          <div class="title">User information</div>

          <div class="main-body">
            <div class="input-group">
              <div class="input username">
                <label for="username">DID</label>
                <input type="text" id="did" v-model="formUser.DID"/>
              </div>
              <div class="input username">
                <label for="username">Provider name</label>
                <input type="text" id="username" v-model="formUser.username"/>
              </div>
              <div class="input fullname">
                <label for="wallet-address">Wallet address</label>
                <input
                    type="text"
                    id="wallet-address"
                    v-model="formUser.walletAddress"
                />
              </div>
            </div>

            <div class="input-group">
              <div class="input user-id">
                <label for="user-id">Identity number</label>
                <input type="text" id="user-id" v-model="formUser.userId"/>
              </div>
              <div class="input nationality">
                <label for="nationality">Nationality</label>
                <input
                    type="text"
                    id="nationality"
                    v-model="formUser.nationality"
                />
              </div>
            </div>

            <div class="input-group">
              <div class="input email">
                <label for="email">Email</label>
                <input type="text" id="email" v-model="formUser.email"/>
              </div>
              <div class="input phone-num">
                <label for="phone-num">Phone number</label>
                <input
                    type="text"
                    id="phone-num"
                    v-model="formUser.phoneNumber"
                />
              </div>
            </div>

            <div class="input-group">
              <div class="input date-of-birth">
                <label for="date-of-birth">Date of birth</label>
                <input
                    type="date"
                    id="date-of-birth"
                    v-model="formUser.dateOfBirth"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="footer-form">
          <button class="register-btn" @click="register()">Register</button>
        </div>
        <div v-text="result"></div>
      </div>
    </div>
    <div class="create-user-ssi-container" v-if="isProviderFormOpen">
      <div class="create-form">
        <div class="header-form">
          <div class="header-form-container">
            <div class="title">Create new provider</div>
            <button class="x-close" @click="closeProviderForm()">X</button>
          </div>
        </div>

        <div class="body-form">
          <div class="title">Provider infomation</div>

          <div class="main-body">
            <div class="input-group">
              <div class="input username">
                <label for="provider-name">Provider name</label>
                <input type="text" id="provider-name" v-model="formProvider.name"/>
              </div>
              <div class="input fullname">
                <label for="wallet-address">Wallet address</label>
                <input
                    type="text"
                    id="wallet-address"
                    v-model="formProvider.walletAddress"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="footer-form">
          <button class="register-btn" @click="providerRegister()">Register</button>
        </div>
        <div v-text="result"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {reactive, toRefs} from "vue";
import {Web3Service} from "@/utils/web3Service";
import LeftBar from "@/components/LeftBar.vue";
// import {postDataApi} from "@/utils/fetchApi";
// import {LOCAL_STORAGE_TOKEN_NAME} from "@/utils/constants";

export default {
  components: {LeftBar},

  setup() {
    const state = reactive({
      formUser: {
        DID: "",
        username: "",
        walletAddress: "",
        userId: "",
        nationality: "",
        email: "",
        phoneNumber: "",
        dateOfBirth: new Date(),
      },
      formProvider: {
        name: "",
        walletAddress: "",
      },
      result: "",
      isFormOpen: false,
      isProviderFormOpen: false,
    });

    return {...toRefs(state)};
  },

  methods: {
    register() {
      let ethereum = window.ethereum;
      ethereum
          .request({method: "eth_requestAccounts"})
          .then((accounts) => {
            const account = accounts[0];
            console.log(account);
            Web3Service.signup(
                this.formUser.DID,
                this.formUser.username,
                Date.parse(this.formUser.dateOfBirth),
                this.formUser.userId,
                this.formUser.nationality,
                this.formUser.email,
                this.formUser.phoneNumber,
                this.formUser.walletAddress,
                account,
                (did) => {
                  this.result = did;
                }
            );
          })
          .catch((error) => {
            console.log(error, error.code);

            alert(error.code);
          });
    },

    providerRegister() {
      let ethereum = window.ethereum;
      ethereum
          .request({method: "eth_requestAccounts"})
          .then((accounts) => {
            const account = accounts[0];
            console.log(account);
            Web3Service.providerSignUp(
                this.formProvider.name,
                this.formProvider.walletAddress,
                account,
                (did) => {
                  this.result = did;
                }
            );
          })
          .catch((error) => {
            console.log(error, error.code);

            alert(error.code);
          });

    },

    openForm() {
      this.result = "";
      this.isFormOpen = true;
    },

    closeForm() {
      this.isFormOpen = false;
    },
    openProviderForm() {
      this.result = "";
      this.isProviderFormOpen = true;
    },

    closeProviderForm() {
      this.isProviderFormOpen = false;
    },
  },
};
</script>

<style scoped>
.home-container {
  display: flex;
}

.left-bar-container {
  height: 100vh;
  padding: 12px;
  border-right: 1px solid rgba(0, 0, 0, 0.2);
}

.main-content-container {
  background-color: rgb(247 247 247);
  flex: 1;
  padding: 12px;
}

.welcome-title {
  height: 100px;
  display: flex;
  align-items: center;
  margin-left: 30px;
}

.welcome-title .welcome {
  font-size: x-large;
  font-weight: 600;
  margin-right: 30px;
}

.welcome-title .btn-create button {
  height: 40px;
  padding: 0px 35px;
  border: none;
  border-radius: 50px;
  background-color: #ff8c00;
  color: white;
  font-size: large;
  padding-bottom: 2px;
  font-weight: 600;
}

.welcome-title .btn-create button:hover {
  background-color: orange;
  transition: 0.5s;
}

.content .logo {
  display: flex;
  justify-content: center;
  align-items: center;
}

.content .logo img {
  height: 500px;
}

.create-user-ssi-container {
  z-index: 1001;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.507);
}

.create-form {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  width: 600px;
  min-width: 600px;
  border-radius: 11px;
  height: 500px;
  min-height: 430px;
}

.header-form {
  background-color: #4682b4;
  border-radius: 11px 11px 0 0;
  padding: 8px 15px;
}

.header-form-container {
  display: flex;
}

.header-form-container .title {
  flex: 1;
  color: #fff;
  font-weight: 600;
}

.header-form-container button {
  border: none;
  background: #4682b4;
  font-weight: 600;
  color: white;
  border-radius: 50%;
  width: 25px;
  height: 24px;
  padding-bottom: 3px;
}

.header-form-container button:hover {
  background: #fff;
  color: #4682b4;
}

.body-form {
  padding: 15px;
}

.body-form .title {
  font-size: 19px;
  font-weight: 600;
  margin-bottom: 10px;
}

.body-form .main-body .input {
  padding-bottom: 10px;
}

.body-form .main-body .input label {
  padding-right: 55px;
}

.body-form .main-body .input input {
  outline: none;
  padding: 4px 10px 6px 10px;
  border-radius: 11px;
  border: 1px solid;
  width: 250px;
}

.body-form .main-body .input.fullname label {
  padding-right: 28px;
}

.body-form .main-body .input.user-id label {
  padding-right: 19px;
}

.body-form .main-body .input.nationality label {
  padding-right: 56px;
}

.body-form .main-body .input.email label {
  padding-right: 96px;
}

.body-form .main-body .input.phone-num label {
  padding-right: 30px;
}

.body-form .main-body .input.date-of-birth label {
  padding-right: 45px;
}

.footer-form {
  display: flex;
  justify-content: center;
}

.footer-form button {
  border: none;
  background-color: #4682b4;
  padding: 5px 17px 5px 17px;
  border-radius: 11px;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
}

.footer-form button:hover {
  background-color: #5e9bcd;
  transition: .5s;
}
</style>