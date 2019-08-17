<template>
  <div id="app">
    <mdb-container>
      <loader v-if="this.loading" v-bind:status-message="statusMessage"/>
      <License ref="license"></License>
      <mdb-row>
        <mdb-col class="col-sm-6 mx-auto">
          <Login class="w-100"
            v-if="this.phase==='login'"
            @loadingBegins="loadingBegins"
            @loadingEnds="loadingEnds"
            @loggedIn="loggedIn"
            @employeesListed="employeesListed"
          />
          <Dropper
            v-if="this.phase==='filedrop'"
            @fileDropped="fileDropped"
            @loadingBegins="loadingBegins"
            @loadingEnds="loadingEnds"
          />

          <Config v-if="this.phase==='config'"
            @generateReport="generateReport">

          </Config>

        </mdb-col>
      </mdb-row>
    </mdb-container>
    <Footer @licenseClicked="licenseClicked"></Footer>
  </div>
</template>

<script>

import {
  mdbContainer, mdbRow, mdbCol,
} from 'mdbvue';

import format from 'date-fns/format';
import parse from 'date-fns/parse';
import isWeekend from 'date-fns/is_weekend';
import eachDay from 'date-fns/each_day';
import compareAsc from 'date-fns/compare_asc';
import Footer from './components/Footer.vue';
import Config from './components/Config.vue';
import Dropper from './components/Dropper.vue';
import Loader from './components/Loader.vue';
import Login from './components/Login.vue';
import License from './components/License.vue';
import Report from './report';


export default {
  name: 'app',
  components: {
    Login,
    Loader,
    mdbContainer,
    mdbRow,
    mdbCol,
    Dropper,
    Config,
    Footer,
    License,
  },
  methods: {

    loadingBegins(statusMessage) {
      this.loading = true;
      this.statusMessage = statusMessage;
    },

    loadingEnds() {
      this.loading = false;
    },

    loggedIn(kisi) {
      // console.log(kisi);


      this.statusMessage = '';
      this.getEmployeeList(0);
    },

    licenseClicked() {
      this.$refs.license.showModalMethod();
    },

    employeesListed(users) {
      this.users = users;
      this.phase = 'filedrop';
    },

    fileDropped(tempUnlocks) {
      this.unlocks = tempUnlocks;
      // console.log('Got back a drop');
      // console.log(this.unlocks.length);
      // console.log(this.unlocks[0]);
      this.phase = 'config';
    },

    generateReport(reportConfig) {
      this.loadingBegins('Generating report...');
      // console.log('Will generate report');
      // console.log(reportConfig);

      this.entriesByDate = {};

      const dayRange = eachDay(reportConfig.date1, reportConfig.date2);

      // eslint-disable-next-line
      for (const aDay of dayRange) {
        if (isWeekend(aDay) && !reportConfig.weekends) {
          continue;
        }

        this.entriesByDate[format(aDay, 'YYYY-MM-DD')] = [];
      }

      // eslint-disable-next-line
      for (const anEntry of this.unlocks) {
        const parsedDate = parse(anEntry.created_at, 'YYYY-MM-DDTHH:mm:ssZ');
        const dayString = format(parsedDate, 'YYYY-MM-DD');


        if (Object.prototype.hasOwnProperty.call(this.entriesByDate, dayString)) {
          const userId = anEntry.actor_id;
          const user = this.users[userId];

          let name = anEntry.actor_email;

          if (user) {
            name = user.name;
          }

          const entryArray = [name, parsedDate];
          this.entriesByDate[dayString].push(entryArray);
        }
      }

      const dateKeys = Object.keys(this.entriesByDate).sort();

      dateKeys.forEach((aDateKey) => {
        let todaysEntries = this.entriesByDate[aDateKey];
        todaysEntries = todaysEntries.sort((a, b) => {
          const stringComp = a[0].localeCompare(b[0]);
          if (stringComp === 0) {
            // The names are the same, compare the dates
            return compareAsc(a[1], b[1]);
          }

          return stringComp;
        });

        // Only use the first entry
        if (reportConfig.firstEntry) {
          const filteredEntries = [];
          let previousEntry = '';


          // eslint-disable-next-line
          for (const anEntry of todaysEntries) {
            if (anEntry[0] !== previousEntry) {
              filteredEntries.push(anEntry);
            }

            previousEntry = anEntry[0];
          }

          todaysEntries = filteredEntries;
        }


        this.entriesByDate[aDateKey] = todaysEntries;
      });

      const report = new Report();

      dateKeys.forEach((aDate) => {
        report.makeReport(aDate, this.entriesByDate[aDate]);
      });

      let filename = `Attendance Report - ${reportConfig.date1} to ${reportConfig.date2}`;
      if (reportConfig.date1 === reportConfig.date2) {
        filename = `Attendance Report - ${reportConfig.date1}`;
      }

      report.save(filename);


      this.loadingEnds();
    },


  },
  data() {
    return {
      loading: false,
      statusMessage: 'Temp Status Message',
      errMsg: '',
      unlocks: [],
      users: {},
      phase: 'login',
      entriesByDate: {},
    };
  },
  created() {
    this.phase = 'login';
  },
};
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

</style>
