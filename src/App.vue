<template>
  <div id="app">
    <Tools />
    <div class="container">
      <Table :style="tableStyle" />
      <TextTableViewer />
    </div>
    <Popup v-model="isOverlayVisible" />
  </div>
</template>

<script>
import Select from "@/components/common/Select";

import Table from "@/components/Table";
import TextTableViewer from "@/components/TextTableViewer";
import Popup from "@/components/Popup";
import Tools from "@/components/Tools";
import ETable from "@/etable";
import Events from "@/events";
import Config from "@/config";

export default {
  name: "App",
  components: {
    Table,
    TextTableViewer,
    Popup,
    Tools,
    Select,
  },
  data() {
    return {
      isOverlayVisible: false,
      isTextTableViewerShowed: false,
    };
  },
  computed: {
    tableStyle() {
      let width = this.isTextTableViewerShowed ? "calc(100% - 400px)" : "100%";
      return {
        width,
      };
    },
  },
  created() {
    ETable.init();
    Config.onchanged(
      (cfg) => (this.isTextTableViewerShowed = cfg.isTextTableViewerShowed)
    );
  },
  destroyed() {
    Events.clear();
  },
};
</script>

<style lang="scss">
* {
  user-select: none;
}

body {
  margin: 0;
  padding: 0;
}

#app {
  display: flex;
  height: 100vh;
  flex-direction: column;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow: hidden;
}

.container {
  display: flex;
  height: calc(100% - 25px);
}

.button {
  &:hover {
    background: #f8fcf9;
    border: 1px solid #c8e7d1 !important;
  }
  &:active {
    background: #dff2e4;
    border: 1px solid transparent !important;
    box-shadow: 0 2px 6px 2px rgba(60, 64, 67, 0.15);
  }
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  padding: 9px 24px 11px 24px;
  font-weight: 600;
  font-size: 14px;
  color: #188038;
  border: 1px solid #dadce0 !important;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.2s, border 0.2s, box-shadow 0.2s;

  &.green {
    &:hover {
      background: #2a8947;
    }
    &:active {
      background: #62a877;
      box-shadow: 0 2px 6px 2px rgba(52, 168, 83, 0.15);
    }
    box-shadow: 0 1px 3px 1px rgba(52, 168, 83, 0.15);
    background: #188038;
    color: #fff;
  }
}

.checkbox {
  display: flex;
  justify-content: center;
  align-items: center;
}

.input[type="text"] {
  border: 1px solid #dadce0;
  border-radius: 4px;
  box-sizing: border-box;
  color: #3c4043;
  padding: 6px 8px;
  font-size: 14px;
  user-select: text;
}

.popup {
  max-width: 100vw;
  width: 600px;
  border-spacing: 5px 5px;

  &__control {
    width: 100%;
  }
  &__text {
    text-align: end;
    white-space: nowrap;
    font-size: 14px;
  }
  &__container {
    *:not(:last-child) {
      margin-right: 10px;
    }
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
