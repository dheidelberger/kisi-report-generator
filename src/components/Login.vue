<template>
  <!-- Material form login -->
  <div>
    <form @submit.prevent>
      <p class="h4 text-center mb-4">Sign in to your Kisi account</p>
      <p class="h5 text-center">This is necessary to retrieve employee info</p>
      <div class="grey-text text-left">
        <mdb-input v-model="email" label="Your email" icon="envelope" type="email"/>
        <mdb-input v-model="pw" label="Your password" icon="lock" type="password"/>
      </div>
      <div class="text-center">
        <mdb-btn color="primary" @click="pressLogin">Login</mdb-btn>
      </div>
    </form>
    <!-- Material form login -->
    <ErrorMessage v-if="loginError"
                  v-bind:err-msg="errMsg"
                  @closeClicked="closeClicked"></ErrorMessage>
  </div>

</template>

<script>

import Kisi from 'kisi-client';

import { mdbInput, mdbBtn } from 'mdbvue';
import ErrorMessage from './ErrorMessage.vue';


export default {
  name: 'Login',
  components: {
    mdbInput,
    mdbBtn,
    ErrorMessage,
  },
  methods: {
    pressLogin() {
      this.kisiClient = new Kisi();

      this.$emit('loadingBegins', 'Logging in...');

      this.kisiClient.signIn(this.email, this.pw)
        .then(() => {
          // console.log('Logged in!');
          this.loginError = false;
          this.$emit('loadingEnds');
          this.$emit('loadingBegins', 'Getting employee list');
          this.getEmployeeList(0);
        }).catch((err) => {
          // console.log('Login failed');
          this.$emit('loadingEnds');
          // console.log(err.message);
          this.errMsg = 'Error logging into Kisi';
          this.loginError = true;
        });
      // this.$emit('loginPressed', {
      //   email: this.email,
      //   pw: this.pw,
      // });
    },

    closeClicked() {
      this.loginError = false;
    },

    getEmployeeList(offset) {
      this.kisiClient
        .get(`members?offset=${offset}&limit=50`)
        .then((list) => {
          // console.log(list);
          const users = list.data.map(user => ({
            id: user.user.id,
            name: user.name,
            email: user.user.email,
          }));
          // console.log(users);
          this.tempUsers = this.tempUsers.concat(users);
          // console.log(`Count: ${list.pagination.count + list.pagination.offset}`);

          if (list.data.length + list.pagination.offset < list.pagination.count) {
            this.getEmployeeList(list.data.length + list.pagination.offset);
          } else {
            const userObjectTemp = {};
            this.tempUsers.forEach((user) => {
              userObjectTemp[user.id] = user;
            });
            this.users = userObjectTemp;
            this.$emit('loadingEnds');
            this.$emit('employeesListed', this.users);
          }
        })
        .catch((err) => {
          console.error('List failed');
          this.loading = false;
          console.error(err.message);
          this.errMsg = 'Error downloading employee list';
          // this.loginError = true;
        });
    },
  },
  data() {
    return {
      email: '',
      pw: '',
      kisiClient: null,
      loginError: false,
      errMsg: '',
      users: {},
      tempUsers: [],

    };
  },
};
</script>
