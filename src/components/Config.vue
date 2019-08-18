<template>
    <div class="datepicker-trigger">
    <p class="h4 text-center mb-4">Select date range for report(s):</p>
    <p class="h5 text-center">{{formatDates(dateOne,dateTwo)}}</p>
    <mdb-btn color="primary" id="datepicker-trigger">Select Dates</mdb-btn>

    <div>
        <AirbnbStyleDatepicker
        :trigger-element-id="'datepicker-trigger'"
        :mode="'range'"
        :fullscreen-mobile="true"
        :date-one="dateOne"
        :date-two="dateTwo"
        @date-one-selected="val => { dateOne = val }"
        @date-two-selected="val => { dateTwo = val }"
        />

    </div>
    <div class="mt-4">
        <section class="preview">
            <div class="text-left">
                <div class="custom-control custom-checkbox">
                    <input v-model="weekends"
                        type="checkbox"
                        class="custom-control-input"
                        id="weekend">
                    <label class="custom-control-label"
                        for="weekend">Generate reports for weekends</label>
                </div>

                <div class="custom-control custom-checkbox">
                    <input v-model="firstEntry"
                        type="checkbox"
                        class="custom-control-input"
                        id="first-entry">
                    <label class="custom-control-label"
                        for="first-entry">
                            Only include each employee's first entry of the day
                        </label>
                </div>
                <div class="custom-control custom-checkbox">
                    <input v-model="emptyReports"
                        type="checkbox"
                        class="custom-control-input"
                        id="empty-reports">
                    <label class="custom-control-label"
                        for="empty-reports">
                            Include empty reports for days when nobody keys in
                        </label>
                </div>
            </div>

        </section>
        <div class="mt-4">
            <mdb-btn :disabled="!(dateOne&&dateTwo)"
                color="default"
                @click="generateReport">Generate Report
            </mdb-btn>
        </div>


    </div>
    </div>

</template>

<script>

import {
  mdbBtn,
} from 'mdbvue';

import format from 'date-fns/format';

export default {
  name: 'Config',
  components: {
    mdbBtn,
  },

  data() {
    return {
      dateFormat: 'D MMM, YYYY',
      dateOne: '',
      dateTwo: '',
      firstEntry: true,
      weekends: true,
      emptyReports: true,
    };
  },

  methods: {
    formatDates(dateOne, dateTwo) {
      if (!dateOne && !dateTwo) {
        return 'No dates selected';
      }

      let formattedDates = '';

      if (dateOne) {
        formattedDates = format(dateOne, this.dateFormat);
      }
      if (dateTwo) {
        formattedDates += ` - ${format(dateTwo, this.dateFormat)}`;
      }

      if (dateOne === dateTwo) {
        formattedDates = format(dateOne, this.dateFormat);
      }
      return formattedDates;
    },

    generateReport() {
      this.$emit('generateReport', {
        date1: this.dateOne,
        date2: this.dateTwo,
        firstEntry: this.firstEntry,
        weekends: this.weekends,
        emptyReports: this.emptyReports,
      });
    },
  },

  mounted() {
    if (localStorage.firstEntry) {
      this.firstEntry = JSON.parse(localStorage.firstEntry);
    }

    if (localStorage.weekends) {
      this.weekends = JSON.parse(localStorage.weekends);
    }

    if (localStorage.emptyReports) {
      this.emptyReports = JSON.parse(localStorage.emptyReports);
    }
  },

  watch: {
    firstEntry(newFirstEntry) {
      localStorage.firstEntry = newFirstEntry;
    },
    weekends(newWeekends) {
      localStorage.weekends = newWeekends;
    },
    emptyReports(newEmptyReports) {
      localStorage.emptyReports = newEmptyReports;
    },
  },

};
</script>

<style>
    section.preview {
        border: 1px solid #e0e0e0;
        padding: 15px;
    }
</style>
