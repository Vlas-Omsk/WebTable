<template>
  <div class="texttable" v-show="isShowed">
    <div class="texttable__wrapper" :style="{ 'font-size': fontSize + 'px' }">
      <div class="texttable__content">{{ content }}</div>
    </div>
    <div class="texttable__container">
      <input type="range" min="1" max="20" v-model="fontSize" />
      <div @click="update" class="texttable__button button">Update table</div>
    </div>
  </div>
</template>

<script>
import Events from "@/events";
import txt from "@/formats/txt";

export default {
  props: {
    table: {
      type: Object,
      required: true,
    },
    isShowed: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      content: null,
      fontSize: 10,
    };
  },
  methods: {
    update() {
      if (this.isShowed) this.content = txt.generateTextTable(this.table);
    },
  },
  created() {
    Events.on("tablechanged", this.update);
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/vars.scss";

.texttable {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 400px;
  height: 100%;
  border-left: $border;
  box-sizing: border-box;
  overflow: hidden;

  &__wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: auto;
    height: 100%;
    width: 100%;
    background: white;
    font-family: "Courier New", Courier, monospace;
    white-space: pre;
  }
  &__content {
    user-select: text;
  }
  &__container {
    display: flex;
  }
  &__button {
    margin: 10px;
  }
}
</style>
