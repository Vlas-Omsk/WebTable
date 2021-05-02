<template>
  <div class="select" ref="select">
    <div class="select__value" :class="{ opened: isOpened }" @click="toggle">
      <div class="select__content">
        {{ selectedValue }}
      </div>
      <img
        class="select__icon"
        src="@/assets/icons/dropdown.svg"
        :class="{ opened: isOpened }"
      />
    </div>
    <div class="select__items" ref="items" :class="{ opened: isOpened }">
      <div
        class="select__row"
        v-for="(item, id) of items"
        :key="id"
        :class="{ 'pre-selected': preSelectedIndex == id }"
        @mousemove="preSelectedIndex = id"
        @click="select(id)"
      >
        <div class="select__item">
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Events from "@/events";
import { isAnyParentContains } from "@/static";

export default {
  props: {
    items: {
      type: Array,
    },
    index: {
      type: Number,
      default: 0,
    },
    value: {
      type: String,
    },
  },
  data() {
    return {
      selectedValue: null,
      selectedIndex: 0,
      preSelectedIndex: 0,
      isOpened: false,
    };
  },
  watch: {
    index() {
      this.selectedIndex = this.index;
      this.selectedValue = this.items[this.selectedIndex];
      this.$emit("valuechanged", {
        value: this.selectedValue,
        index: this.selectedIndex,
      });
    },
  },
  methods: {
    toggle() {
      if (!this.isOpened) this.preSelectedIndex = this.selectedIndex;
      this.isOpened = !this.isOpened;
    },
    select(id) {
      this.selectedIndex = id;
      this.selectedValue = this.items[this.selectedIndex];
      this.$emit("input", this.selectedValue);
      this.$emit("valuechanged", {
        value: this.selectedValue,
        index: this.selectedIndex,
      });
      this.isOpened = false;
    },
    mouseup(e) {
      if (!isAnyParentContains(e.target, [this.$refs.select]))
        this.isOpened = false;
    },
  },
  created() {
    if (this.index) {
      this.selectedIndex = this.index;
      this.selectedValue = this.items[this.selectedIndex];
      this.$emit("valuechanged", {
        value: this.selectedValue,
        index: this.selectedIndex,
      });
    } else this.selectedValue = this.items[this.selectedIndex];
    Events.on("mouseup", this.mouseup);
  },
  mounted() {
    // let max = 0;
    // for (let idx = 0; idx < this.items.length; idx++) {
    //   this.selectedIndex = idx;
    //   let width = this.$refs.select.getBoundingClientRect().width;
    //   if (width > max) max = width;
    // }
    // this.$refs.select.style.width = max + "px";
  },
};
</script>

<style lang="scss" scoped>
$transition: 0.1s ease-in-out;

.select {
  position: relative;

  &__value {
    &:hover {
      background-color: rgba(60, 64, 67, 0.04);
      box-shadow: none;
    }
    &.opened {
      background-color: rgba(60, 64, 67, 0.08);
    }
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #dadce0;
    border-radius: 4px;
    box-sizing: border-box;
    cursor: pointer;
    padding: 8px;
    color: #3c4043;
    text-align: left;
    outline: none;
    box-sizing: content-box;
    transition: background-color $transition, box-shadow $transition;
  }
  &__content {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &__items {
    &.opened {
      opacity: 1;
      pointer-events: unset;
    }
    position: absolute;
    top: 0;
    transform: translateY(-100%);
    padding: 8px 0;
    box-shadow: 0 2px 6px 2px rgba(60, 64, 67, 0.15);
    border-radius: 4px;
    background-color: white;
    opacity: 0;
    pointer-events: none;
    transition: opacity $transition;
  }
  &__row {
    &.pre-selected {
      background-color: #f1f3f4;
    }
    cursor: pointer;
  }
  &__item {
    padding: 8px 15px 8px 26px;
    box-sizing: content-box;
    white-space: nowrap;
    text-align: left;
    transition: background-color $transition;
  }
  &__icon {
    &.opened {
      transform: rotate(180deg);
    }
    transition: transform $transition;
  }
}
</style>
