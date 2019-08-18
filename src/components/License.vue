<template>
    <mdb-container>
    <mdb-modal :show="showModal" @close="hideModal" scrollable>
      <mdb-modal-header>
        <mdb-modal-title>Credits and Privacy Info</mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body>

        <h4>Credits</h4>
        <p>This site was created by <a href="http://www.davidheidelberger.com" target="_blank">David Heidelberger.</a></p>
        <p>The full source code is available <a href="https://github.com/dheidelberger/kisi-report-generator" target="_blank">on Github</a> and is licensed under an <a href="https://opensource.org/licenses/MIT" target="_blank">MIT License</a>.</p>
        <p class="mb-5">Icon adapted from <a href="https://www.icons8.com" target="_blank">Icons8.com</a>.</p>
        <h4>Privacy and GDPR Compliance</h4>
        <p>This website collects no data and sends nothing to a server apart from your Kisi login information, which is securely sent to the <a href="https://kisiapi.docs.apiary.io/" target="_blank">Kisi API</a> in order to obtain a list of employees.</p>
        <p>The site does utilize <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" target="_blank">Javascript's localStorage protocol</a> to save your configuration preferences for the report. Again, no personal data is stored and nothing is transmitted to a server.</p>
        <p>This site is hosted by <a href="https://www.netlify.com/" target="_blank">Netlify</a>. Netlify does log your IP address when you use the site and saves it for 30 days. You can read more about Netlify's <a href="https://www.netlify.com/gdpr/" target="_blank">GDPR compliance here.</a></p>

      </mdb-modal-body>
      <mdb-modal-footer>
        <mdb-btn color="primary" @click.native="hideModal">Close</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
  </mdb-container>
</template>

<script>
import {
  mdbBtn,
  mdbModal,
  mdbModalHeader,
  mdbModalTitle,
  mdbModalBody,
  mdbModalFooter,
  mdbContainer,
} from 'mdbvue';

export default {
  name: 'ModalPage',
  data() {
    return {
      showModal: false,
    };
  },
  components: {
    mdbBtn,
    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
    mdbModalFooter,
    mdbContainer,
  },
  methods: {
    showModalMethod() {
      this.showModal = true;
    },

    hideModal() {
      this.showModal = false;
    },
  },
};
</script>


<style scoped>
    p {
        text-align: left;
    }

</style>
