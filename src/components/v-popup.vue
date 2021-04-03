<template>
  <div class="v-popup">
    <div class="v-popup__header">
      <span style="float: left">Replay</span>
      <div id="close_btn" style="float: right;" @click="closePopup" class="material-icons-outlined">close</div>
    </div>
    <div class="v-popup__content">
      <div>
        <ReplayBoard/>
      </div>
      <!-- <slot></slot> -->
    </div>
    <div class="v-popup__footer"></div>
  </div>
  <div id="bg_layer" @click="closePopup"></div>
</template>

<script>
  import ReplayBoard from './ReplayBoard.vue'

  export default {
    name: "v-popup",
    emits: ['closePopup'],
    components: {
      ReplayBoard
    },
    methods: {
      closePopup() {
        this.$emit('closePopup')
      }
    }
  }
</script>

<style lang="scss">
  .v-popup {
    padding: 13px;
    width: 1000px;
    height: fit-content;
    box-shadow: 0 0 17px 0 #3b414b;
    background: #373d47;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    z-index: 20;
    border-radius: 10px;

    &__header, &__footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: bold;
      font-size: 20px;
    }

    &__content {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  #bg_layer {
    position: fixed;
    z-index: 15;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000;
    opacity: 0.5;
    /*cursor: pointer;*/
  }

  #close_btn {
    cursor: pointer;
    user-select: none;
  }

  #close_btn:hover {
    border-radius: 20px;
    background-color: #c85952;
    color: white;
  }
</style>