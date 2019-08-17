import Vue from 'vue';

import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbvue/build/css/mdb.css';


import AirbnbStyleDatepicker from 'vue-airbnb-style-datepicker';
import App from './App.vue';

import 'vue-airbnb-style-datepicker/dist/vue-airbnb-style-datepicker.min.css';

// see docs for available options
const datepickerOptions = {
  offsetX: 0,
  offsetY: 0,
  sundayFirst: true,
};

// make sure we can use it in our components
Vue.use(AirbnbStyleDatepicker, datepickerOptions);


Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
