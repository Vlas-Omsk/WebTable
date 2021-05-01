<template>
  <div
    class="dropdown-button"
    @click="click"
    ref="button"
    :class="{ opened: z__isOpened }"
  >
    {{ title }}
    <ul class="dropdown-button__dropdown" ref="dropdown">
      <li
        class="dropdown-button__row"
        :class="{
          disabled: item.__isDisabled,
          delimiter: item.type == 'delimiter',
          default:
            !item.type || item.type == 'default' || item.type == 'checkbox',
        }"
        v-for="(item, i) of items"
        :key="i"
        @click="
          item.click($event);
          isOpened = false;
        "
      >
        <svg
          v-if="item.type == 'checkbox' && item.__isChecked"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          version="1.1"
          x="0"
          y="0"
          width="18px"
          height="18px"
          viewBox="0 0 18 18"
          preserveAspectRatio="none"
          class="dropdown-button__icon"
        >
          <g xmlns="http://www.w3.org/2000/svg">
            <polygon
              fill="#000000"
              fill-rule="evenodd"
              points="4.75 8.127 1.623 5 .561 6.061 4.75 10.25 13.75 1.25 12.689 .189"
              transform="translate(2 4)"
            />
          </g>
        </svg>
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
      z__isOpened: false,
    };
  },
  computed: {
    isOpened: {
      get() {
        return this.z__isOpened;
      },
      set(value) {
        this.z__isOpened = value;
        if (this.z__isOpened) {
          for (let item of this.items) {
            if (item.isDisabled) item.__isDisabled = item.isDisabled();
            if (item.type == "checkbox") item.__isChecked = item.isChecked();
          }
        }
      },
    },
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
  border-radius: 4px;
  font-size: 14px;
  letter-spacing: 0.2px;
  padding: 4px 12px;
  transition: background-color 0.2s ease-in-out;
  cursor: pointer;

  &__dropdown {
    position: absolute;
    width: 240px;
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
    cursor: default;
  }
  &__row {
    position: relative;
    &:hover {
      background: #f1f3f4;
    }
    &.disabled {
      opacity: 0.6;
      pointer-events: none;
      cursor: default;
    }
    &.default {
      margin: 0;
      padding: 8px 15px 8px 38px;
      word-wrap: normal;
      text-align: left;
      cursor: pointer;
    }
    &.delimiter {
      margin: 6px 0px 6px 34px;
      height: 1px;
      background-color: rgb(218, 220, 224);
    }
  }
  &__icon {
    position: absolute;
    left: 0;
    top: 50%;
    margin: -9px 8px 7px 12px;
  }
  &.opened {
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
