<template>
  <div class="texttable" v-show="isShowed">
    <div class="texttable__wrapper" :style="{ 'font-size': fontSize + 'px' }">
      <div class="texttable__content" ref="content">{{ content }}</div>
    </div>
    <div class="texttable__container">
      <Select
        class="texttable__select"
        :items="borderTypesPreview"
        @valuechanged="borderchanged"
        :index="selectedBorderTypeIndex"
      />
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
import Select from "@/components/common/Select";
import Events from "@/events";
import { selection } from "@/etable";
import txt from "@/formats/txt";
import { selectElementContents } from "@/static";
import Config from "@/config";

export default {
  components: {
    Select,
  },
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
      selectedBorderTypeIndex: 0,
    };
  },
  watch: {
    fontSize: function() {
      Config.set("fontSize", this.fontSize);
    },
    useSelect: function() {
      Config.set("useSelect", this.useSelect);
      this.update();
    },
  },
  computed: {
    borderTypesPreview() {
      let result = [];
      for (let i of this.borderTypes) result.push(this.getPreview(i));
      return result;
    },
  },
  methods: {
    getPreview(sm) {
      return (
        sm[2] +
        sm[0] +
        sm[0] +
        sm[6] +
        sm[0] +
        sm[0] +
        sm[9] +
        sm[0] +
        sm[0] +
        sm[10]
      );
    },
    borderchanged(e) {
      Config.set(
        "selectedBorderTypeIndex",
        (this.selectedBorderTypeIndex = e.index)
      );
      this.update();
    },
    update() {
      if (this.isShowed) {
        if (!this.useSelect || selection.start)
          this.content = txt.generateTextTable(
            this.borderTypes[this.selectedBorderTypeIndex],
            this.useSelect
          );
        else this.content = "No selection";
      }
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
      if (cfg.selectedBorderTypeIndex)
        this.selectedBorderTypeIndex = cfg.selectedBorderTypeIndex;
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
  background-color: white;
  z-index: 1;

  &__wrapper {
    display: flex;
    overflow: auto;
    height: 100%;
    width: 100%;
  }
  &__content {
    background: white;
    font-family: "Courier New", Courier, monospace;
    white-space: pre;
    user-select: text;
    margin: auto;
  }
  &__container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: wrap;
    padding-right: 10px;
    padding-left: 10px;
    margin: 7px 0;
    width: 100%;
    box-sizing: border-box;
  }
  &__button {
    margin-left: 10px;
  }
  &__checkbox {
    margin-right: auto;
  }
  &__select {
    width: 150px;
    margin-right: auto;
    font-family: "Courier New", Courier, monospace;
  }
  &__label {
    font-size: 12px;
  }
}
</style>
