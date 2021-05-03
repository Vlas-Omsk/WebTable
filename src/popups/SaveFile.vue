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
    <tr v-if="index == 2">
      <td class="popup__text">Delimiter:</td>
      <td>
        <input type="text" class="popup__control input" v-model="delimiter" />
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
import Events from "@/events";
import Select from "@/components/common/Select";
import { table } from "@/etable";
import { saveFile } from "@/static";
import Config from "@/config";

// formats
import json from "@/formats/json";
import txt from "@/formats/txt";
import csv from "@/formats/csv";

export default {
  components: {
    Select,
  },
  data() {
    return {
      filename: "table",
      formatnames: ["JSON", "TXT - text representation of table", "CSV"],
      formats: [
        {
          mimetype: "application/json",
          ext: "json",
          getContent: json.getString,
        },
        {
          mimetype: "text/plain",
          ext: "txt",
          getContent: () => txt.generateTextTable("─│┌┬┐├┼┤└┴┘ ─", false),
        },
        {
          mimetype: "text/csv",
          ext: "csv",
          getContent: () => csv.getString(this.delimiter),
        },
      ],
      delimiter: ";",
      index: 0,
    };
  },
  methods: {
    download() {
      Config.set("delimiter", this.delimiter);
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
    Config.onchanged((cfg) => {
      if (cfg.delimiter) this.delimiter = cfg.delimiter;
    });
  },
};
</script>

<style lang="scss" scoped>
.savefile {
  width: 360px;
}
</style>
