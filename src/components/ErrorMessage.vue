<template>
    <mdb-row>
        <mdb-alert class="mx-auto mt-4 col-12"
                color="danger"
                @closeAlert="errorClick" dismiss>
        <strong>{{errMsg}}</strong>
        </mdb-alert>
      </mdb-row>
</template>

<script>

import {
  mdbRow, mdbAlert,
} from 'mdbvue';

export default {
  name: 'ErrorMessage',
  components: {
    mdbRow,
    mdbAlert,
  },
  methods: {
    errorClick() {
      this.$emit('closeClicked');
    },
  },
  props: [
    'errMsg',
  ],
};
</script>

<style>

</style>
