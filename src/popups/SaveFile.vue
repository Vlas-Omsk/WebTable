<template>
  <table class="popup savefile">
    <tr>
      <td class="popup__text">Format:</td>
      <td class="popup__control">
        <Select :items="formatnames" @valuechanged="index = $event.index" />
      </td>
    </tr>
    <tr>
      <td class="popup__text">File name:</td>
      <td>
        <input type="text" class="popup__control input" v-model="filename" />
      </td>
    </tr>
    <tr>
      <td colspan="2">
        <div class="popup__container">
          <div class="button" @click="$emit('close')">
            Cancel
          </div>
          <div class="button green" @click="download">
            Download
          </div>
        </div>
      </td>
    </tr>
  </table>
</template>

<script>
import Select from "@/components/common/Select";
import { table } from "@/etable";
import { saveFile } from "@/static";

// formats
import json from "@/formats/json";
import txt from "@/formats/txt";

export default {
  components: {
    Select,
  },
  data() {
    return {
      filename: "table",
      formatnames: ["JSON", "TXT - text representation of table"],
      formats: [
        {
          mimetype: "application/json",
          ext: "json",
          getContent: json.getString,
        },
        {
          mimetype: "plain/text",
          ext: "txt",
          getContent: () => txt.generateTextTable("─│┌┬┐├┼┤└┴┘ ─", false),
        },
      ],
      index: 0,
    };
  },
  methods: {
    download() {
      table.name = this.filename;
      let format = this.formats[this.index];
      saveFile(
        format.mimetype,
        this.filename + "." + format.ext,
        format.getContent()
      );
    },
  },
  created() {
    if (table.name) this.filename = table.name;
    Events.on("tablechanged", (e) => (this.filename = e.table.name));
  },
};
</script>

<style lang="scss" scoped>
.savefile {
  width: 360px;
}
</style>
