<template>
  <mdb-footer color="primary-color" class="font-small pt-4 mt-4 fixed-bottom">
    <mdb-container class="text-left mb-2 ">
      <mdb-row class="justify-content-between">
        <mdb-col sm="6">
          <h5 class="title">Kisi Report Generator</h5>
          <p>
            Created by
            <a href="http://www.davidheidelberger.com" target="_blank"> David Heidelberger</a>,
            &copy; 2019
          </p>
          <p class="pfooter">
            <a href="https://www.youtube.com/watch?v=1D6xUD5ngRI" target="_blank">Demo Video</a>
          </p>
          <p class="pfooter">
            <a @click.prevent="licenseClicked" href="#">
              Credits and Privacy info
            </a>
          </p>
        </mdb-col>
        <mdb-col sm="2">
          <img src="@/assets/logo.png" />
        </mdb-col>
      </mdb-row>
    </mdb-container>
  </mdb-footer>
</template>

<script>
import { mdbFooter, mdbContainer, mdbRow, mdbCol } from "mdbvue";

export default {
  name: "NavbarPage",
  components: {
    mdbFooter,
    mdbContainer,
    mdbRow,
    mdbCol
  },
  methods: {
    licenseClicked() {
      this.$emit("licenseClicked");
    }
  }
};
</script>

<style scoped>
p {
  margin-bottom: 0.3rem;
}

a {
  text-decoration: underline;
}

img {
  height: auto;
  height: 100%;
  max-height: 90px;
}
</style>
