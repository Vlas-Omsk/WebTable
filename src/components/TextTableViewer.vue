<template>
  <div class="texttable" v-show="isShowed">
    <div class="texttable__wrapper" :style="{ 'font-size': fontSize + 'px' }">
      <div class="texttable__content" ref="content">{{ content }}</div>
    </div>
    <div class="texttable__container">
      <select class="texttable__select" v-model="selectedBorderType">
        <option v-for="(type, id) of borderTypes" :key="id" :value="type">{{
          type
        }}</option>
      </select>
      <input type="range" min="1" max="20" v-model="fontSize" />
    </div>
    <div class="texttable__container">
      <div class="texttable__checkbox checkbox">
        <input type="checkbox" name="useSelect" v-model="useSelect" />
        <label for="useSelect" class="texttable__label">Use select</label>
      </div>
      <div @click="copy" class="texttable__button button">Copy</div>
      <!-- <div @click="save" class="texttable__button button">Save</div> -->
      <div @click="update" class="texttable__button button">Update table</div>
    </div>
  </div>
</template>

<script>
import Events from "@/events";
import txt from "@/formats/txt";
import { selectElementContents } from "@/static";
import Config from "@/config";

export default {
  data() {
    let borderTypes = [
      "─│┌┬┐├┼┤└┴┘ ─",
      "═║╔╦╗╠╬╣╚╩╝ ═",
      "─║╓╥╖╟╫╢╙╨╜ ─",
      "═│╒╤╕╞╪╡╘╧╛ ═",
      "▀██████████ ▄",
      "─│╭┬╮├┼┤╰┴╯ ─",
      "─ ───────── ─",
      " ││││││││││  ",
    ];
    return {
      isShowed: false,
      content: null,
      fontSize: 10,
      useSelect: false,
      borderTypes,
      selectedBorderType: borderTypes[0],
    };
  },
  watch: {
    selectedBorderType: function() {
      Config.set("selectedBorderType", this.selectedBorderType);
      this.update();
    },
    fontSize: function() {
      Config.set("fontSize", this.fontSize);
    },
    useSelect: function() {
      Config.set("useSelect", this.useSelect);
      this.update();
    },
  },
  methods: {
    update() {
      if (this.isShowed)
        this.content = txt.generateTextTable(
          this.selectedBorderType,
          this.useSelect
        );
    },
    copy() {
      selectElementContents(this.$refs.content);
      document.execCommand("copy");
    },
  },
  created() {
    Events.on("cellchanged", this.update);
    Config.onchanged((cfg) => {
      this.isShowed = cfg.isTextTableViewerShowed;
      if (cfg.selectedBorderType)
        this.selectedBorderType = cfg.selectedBorderType;
      if (cfg.fontSize) this.fontSize = cfg.fontSize;
      if (cfg.useSelect) this.useSelect = cfg.useSelect;
    });
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/vars.scss";

.texttable {
  display: flex;
  flex-direction: column;
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
    justify-content: flex-end;
    align-items: center;
    flex-wrap: wrap;
    padding-right: 10px;
    padding-left: 10px;
    margin-bottom: 10px;
    width: 100%;
    box-sizing: border-box;
  }
  &__button {
    margin-left: 10px;
  }
  &__checkbox {
    margin-right: auto;
  }
  &__label {
    font-size: 12px;
  }
  &__select {
    margin-right: auto;
    font-family: "Courier New", Courier, monospace;
    outline: none;
  }
}
</style>
