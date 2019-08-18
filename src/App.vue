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

    // Brings up the loading spinner
    loadingBegins(statusMessage) {
      this.loading = true;
      this.statusMessage = statusMessage;
    },

    // Gets rid of the loading spinner
    loadingEnds() {
      this.loading = false;
    },

    // Event listener from License.vue, we need to show the license modal
    licenseClicked() {
      this.$refs.license.showModalMethod();
    },

    // Event listener from Login.vue
    employeesListed(users) {
      this.users = users;
      this.phase = 'filedrop';
    },

    // Event listener from Dropper.vue
    fileDropped(tempUnlocks) {
      this.unlocks = tempUnlocks;
      this.phase = 'config';
    },

    // Event listener from Config.vue
    // This is where the work gets done
    generateReport(reportConfig) {
      this.loadingBegins('Generating report...');

      this.entriesByDate = {};

      // Each day in our date range will become a key in entriesByDate
      // We want even empty days because we need to generate a report for those too
      // And we only want to do this once
      const dayRange = eachDay(reportConfig.date1, reportConfig.date2);

      // Format the dates properly for our keys
      // eslint-disable-next-line
      for (const aDay of dayRange) {

        // Skip this day if it's a weekend and we don't want to include weekends
        if (isWeekend(aDay) && !reportConfig.weekends) {
          continue;
        }

        this.entriesByDate[format(aDay, 'YYYY-MM-DD')] = [];
      }

      // Go through all the unlocks, format them, and assign them to the appropriate date key
      // eslint-disable-next-line
      for (const anEntry of this.unlocks) {
        const parsedDate = parse(anEntry.created_at, 'YYYY-MM-DDTHH:mm:ssZ');
        const dayString = format(parsedDate, 'YYYY-MM-DD');

        // Only add the entry to our object if there's a key for it
        // If there isn't a key for it, it's either out of range or
        //  a weekend (when not collecting weekends)
        if (Object.prototype.hasOwnProperty.call(this.entriesByDate, dayString)) {
          const userId = anEntry.actor_id;

          // Look into our employee list and see if we have an entry
          const user = this.users[userId];

          // By default, just use the email address in the event report
          let name = anEntry.actor_email;

          // But if we can do better, we will
          if (user) {
            name = user.name;
          }

          // This is the array that the table builder needs
          const entryArray = [name, parsedDate];
          this.entriesByDate[dayString].push(entryArray);
        }
      }

      // Get all the dates from our object, be sure the keys are chronological
      const dateKeys = Object.keys(this.entriesByDate).sort();

      // Sort each day's entries by name and then by date
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

      // The report class generates our PDF using JSPDF
      const report = new Report();

      dateKeys.forEach((aDate) => {
        // Only make reports for dates with entries if option is configured
        if (!(this.entriesByDate[aDate].length === 0 && !reportConfig.emptyReports)) {
          report.makeReport(aDate, this.entriesByDate[aDate]);
        }
      });

      let filename = `Attendance Report - ${reportConfig.date1} to ${reportConfig.date2}`;

      // If the report is for a single day
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
      phase: 'login', // Can be: login, filedrop, config
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
