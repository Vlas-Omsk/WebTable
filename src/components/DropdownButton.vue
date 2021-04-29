<template>
  <div
    class="dropdown-button"
    @click="click"
    ref="button"
    :class="{ 'dropdown-button-opened': isOpened }"
  >
    {{ title }}
    <ul class="dropdown-button__dropdown" ref="dropdown">
      <li
        class="dropdown-button__row"
        v-for="(item, i) of items"
        :key="i"
        @click="
          item.click($event);
          isOpened = false;
        "
      >
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>

<script>
import Events from "@/events";

export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isOpened: false,
    };
  },
  methods: {
    click(e) {
      if (e.target == this.$refs.button) this.isOpened = !this.isOpened;
    },
    mousedown(e) {
      var current = e.target;
      while (
        current != this.$refs.dropdown &&
        current != this.$refs.button &&
        current
      ) {
        current = current.parentElement;
      }
      if (!current) this.isOpened = false;
    },
  },
  created() {
    Events.on("mousedown", this.mousedown);
  },
};
</script>

<style lang="scss" scoped>
.dropdown-button {
  &:hover {
    background-color: #f1f3f4;
  }
  &:active {
    background-color: #d1d3d4;
  }
  position: relative;
  color: #202124;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  letter-spacing: 0.2px;
  padding: 4px 12px;
  transition: background-color 0.2s ease-in-out;

  &__dropdown {
    position: absolute;
    width: 160px;
    bottom: 0;
    left: 0;
    margin: 0;
    padding: 6px 0;
    z-index: 9999;
    list-style: none;
    border: 1px solid transparent;
    border-radius: 4px;
    box-shadow: 0 2px 6px 2px rgba(60, 64, 67, 0.15);
    max-height: calc(100vh - 70px);
    overflow-y: auto;
    background: #fff;
    pointer-events: none;
    opacity: 0;
    transform: translateY(100%);
    transition: opacity 0.1s ease-in-out;
  }
  &__row {
    &:hover {
      background: #f1f3f4;
    }
    margin: 0;
    padding: 0;
    padding: 6px 15px 6px 38px;
    word-wrap: normal;
    text-align: left;
  }
  &-opened {
    background-color: #d1d3d4;
    &:hover {
      background-color: #d1d3d4;
    }
    .dropdown-button__dropdown {
      pointer-events: all;
      opacity: 1;
    }
  }
}
</style>
