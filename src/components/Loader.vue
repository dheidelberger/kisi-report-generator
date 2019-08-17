<template>
    <div class="vld-parent">
        <loading
            :active="true"
            :opacity="0.9"
            :background-color="'#fff'"
            :is-full-page="true"

            :color="'#4285F4'"
            :width="128"
            :height="128"
            v-slot:after>

            <h3 class="mt-4">{{statusMessage}}</h3>
            <!-- :color="'#007BFF'" -->
        </loading>
    </div>
</template>

<script>
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
  name: 'PageLoader',
  components: {
    Loading,
  },
  props: [
    'statusMessage',
  ],
};
</script>

<style>
.vld-icon {
    position: fixed !important;
    top: 100px
}
</style>
