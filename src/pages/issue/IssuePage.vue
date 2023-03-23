<template>
  <div class="home-container">
    <div class="left-bar-container">
      <LeftBar/>
    </div>

    <div class="main-content-container">
      <!-- // TODO: Chào hỏi gì đó -->
      <div class="welcome-title"></div>

      <div class="create-user-ssi-container">
        <div class="header-form">
          <div class="header-form-container">
            <div class="title">Create new certificate</div>
            <div class="x-close"></div>
          </div>
        </div>

        <div class="body-form">
          <div class="title">Certificate infomation</div>

          <div class="main-body">
            <div class="input-group">
              <div class="input username">
                <label for="did">DID</label>
                <input
                    type="text"
                    id="did"
                    v-model="formCertificate.did"
                />
              </div>
              <div class="input username">
                <label for="username">Type</label>
                <input
                    type="text"
                    id="username"
                    v-model="formCertificate.type"
                />
              </div>
              <div class="input fullname">
                <label for="wallet-address">Subject Id</label>
                <input
                    type="text"
                    id="wallet-address"
                    v-model="formCertificate.subjectId"
                />
              </div>
            </div>

            <div class="input-group">
              <div class="input user-id">
                <label for="user-id">Degree Type</label>
                <input
                    type="text"
                    id="user-id"
                    v-model="formCertificate.degreeType"
                />
              </div>
              <div class="input nationality">
                <label for="nationality">Degree Name</label>
                <input
                    type="text"
                    id="nationality"
                    v-model="formCertificate.degreeName"
                />
              </div>
            </div>
          </div>

          <div class="footer-form">
            <button class="register-btn" @click="issue()">Issue</button>
          </div>

          <div><p class="result" v-text="formCertificate.result"></p></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {reactive, toRefs} from "vue";
import {CredentialService} from "@/utils/credentialService";
import LeftBar from "@/components/LeftBar.vue";

export default {
  components: {LeftBar},

  setup() {
    const state = reactive({
      formCertificate: {
        did: "",
        type: "",
        subjectId: "",
        degreeType: "",
        degreeName: "",
        result: "",
      },
    });

    return {...toRefs(state)};
  },

  methods: {
    async issue() {
      CredentialService.issue(
          this.formCertificate.did,
          this.formCertificate.type,
          this.formCertificate.degreeType,
          this.formCertificate.degreeName,
          this.formCertificate.subjectId,
          (VC) => {
            this.formCertificate.result = VC;
          }
      );
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

.header-form {
  background-color: #ff8c00;
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
  padding-right: 83px;
}

.body-form .main-body .input input {
  outline: none;
  padding: 4px 10px 6px 10px;
  border-radius: 11px;
  border: 1px solid;
  width: 250px;
}

.body-form .main-body .input.fullname label {
  padding-right: 47px;
}

.body-form .main-body .input.user-id label {
  padding-right: 28px;
}

.body-form .main-body .input.nationality label {
  padding-right: 20px;
}

.footer-form {
  display: flex;
  justify-content: center;
}

.footer-form button {
  border: none;
  background-color: #ff8c00;
  padding: 5px 17px 5px 17px;
  border-radius: 11px;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
}

.footer-form button:hover {
  background-color: orange;
  transition: 0.5s;
}
</style>