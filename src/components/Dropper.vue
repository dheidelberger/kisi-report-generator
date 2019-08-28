<template>
    <div>
        <vue-dropzone ref="myVueDropzone"
                id="dropzone"
                :options="dropzoneOptions"
                :useCustomSlot=true
                @vdropzone-file-added="fileAdded">
                <div class="dropzone-custom-content">
                  <h3 class="dropzone-custom-title">Drag and drop your Kisi report here</h3>
                  <div class="subtitle">...or click to select it from your computer</div>
                </div>
        </vue-dropzone>

        <div class="mt-4">
          <section class="preview">
              <div class="text-left">
                  <h4>To obtain a Kisi report:</h4>
                  <ul>
                    <li>Navigate to your <a href="https://web.kisi.io" target="_blank"> control panel</a>.</li>
                    <li>Select your organization</li>
                    <li>Go to "Event Exports"</li>
                    <li>Click on "Request another export"</li>
                    <li>Wait for the export to finish and download the .csv file</li>
                  </ul>
              </div>

          </section>
        </div>

        <ErrorMessage v-if="dropError"
            v-bind:err-msg="errMsg"
            @closeClicked="closeClicked">
        </ErrorMessage>
    </div>
</template>

<script>

import Papa from 'papaparse';
import vue2Dropzone from 'vue2-dropzone';
import 'vue2-dropzone/dist/vue2Dropzone.min.css';
import ErrorMessage from './ErrorMessage.vue';

export default {
  name: 'Dropper',
  components: {
    vueDropzone: vue2Dropzone,
    ErrorMessage,


  },
  data() {
    return {
      dropError: false,
      errMsg: '',
      dropzoneOptions: {
        url: 'https://www.google.com',
        autoProcessQueue: false,
        createImageThumbnails: false,
        previewTemplate: '<div style="display:none"></div>',
      },
    };
  },
  methods: {

    closeClicked() {
      this.dropError = false;
    },

    fileAdded(file) {
      this.dropError = false;
      // console.log('File was added.');
      // console.log(file);
      if (file.name.slice(-4) !== '.csv') {
        // console.log('Not a CSV');
        this.$refs.myVueDropzone.removeAllFiles();
        this.errMsg = 'This does not appear to be a .csv file.';
        this.dropError = true;
        // console.log(file);
      } else {
        // console.log(file);
        this.dropError = false;
        this.$emit('loadingBegins', 'Reading events...');
        const tempUnlocks = [];
        const self = this;
        Papa.parse(file, {
          worker: true,
          header: true,
          step(row) {
            if (row.data.action === 'unlock' && row.data.actor_id !== '') {
              tempUnlocks.push(row.data);
            }
          },
          complete() {
            // console.log('All done!');
            self.$emit('loadingEnds');


            if (tempUnlocks.length === 0) {
              self.$refs.myVueDropzone.removeAllFiles();
              self.errMsg = 'Could not find any Kisi unlock events in this file';
              self.dropError = true;
            } else {
              self.$emit('fileDropped', tempUnlocks.reverse());
            }
          },
        });
      }
    },
  },

};
</script>

<style>
    .dropzone-custom-content {
    position: relative;
    top: 30px;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    }

    .subtitle {
      /* color: #d2d8dd; */
      color: #506fa1;
    }


    .dropzone-custom-title {
    margin-top: 0;
    /* color: #00b782; */
    /* color: #2bbbad; */
    color: #4285F4;
    }
</style>
