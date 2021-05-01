<template>
  <div
    class="overlay"
    ref="overlay"
    @mousedown="closePopup"
    :class="{ visible: value }"
  >
    <div class="overlay__popup">
      <component :is="component" :data="data" @close="setVisibility(false)" />
    </div>
  </div>
</template>

<script>
import Events from "@/events";

export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      component: null,
      data: {},
    };
  },
  methods: {
    setVisibility(value) {
      this.$emit("input", value);
    },
    closePopup(e) {
      if (e.target == this.$refs.overlay) this.setVisibility(false);
    },
    openpopup(e) {
      this.data = e.data;
      this.component = e.component;
      this.setVisibility(true);
    },
  },
  created() {
    Events.on("openpopup", this.openpopup);
    Events.on("closepopup", () => this.setVisibility(false));
  },
};
</script>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  pointer-events: none;
  transition: opacity 0.1s ease-in;

  &__popup {
    padding: 20px;
    background-color: #fff;
    color: #3c4043;
    border: 1px solid transparent;
    border-radius: 8px;
    box-shadow: 0 4px 8px 3px rgba(60, 64, 67, 0.15);
    transform: scale(0.7, 0.7);
    transition: transform 0.25s cubic-bezier(0.48, 1.93, 1, 0.68);
  }
  &.visible {
    pointer-events: auto;
    opacity: 1;
    transition: opacity 0.2s ease-in;
    .overlay__popup {
      transform: none;
    }
  }
}
</style>
