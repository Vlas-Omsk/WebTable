<template>
  <div ref="cellrow" class="wrapper">
    <div v-for="(_, columnid) of table.columns" class="cellrow" :key="columnid">
      <Cell
        :rowid="rowid"
        :columnid="columnid"
        :focused="focused"
        @cellEditingStart="$emit('cellEditingStart', $event)"
        @cellEditingEnd="$emit('cellEditingEnd', $event)"
      />
    </div>
  </div>
</template>

<script>
import Cell from "@/components/Cell";
import { table } from "@/etable";
import Events from "@/events";

export default {
  components: {
    Cell,
  },
  props: {
    rowid: {
      type: Number,
      required: true,
    },
    focused: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      table,
    };
  },
  methods: {
    rowsizechanged(e) {
      if (e.row == this.rowid && this.$refs.cellrow) {
        this.$refs.cellrow.style.height = e.value + "px";
      }
    },
  },
  created() {
    Events.on("rowsizechanged", this.rowsizechanged);
  },
  mounted() {
    this.rowsizechanged({
      row: this.rowid,
      value: table.rows[this.rowid].height,
    });
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/vars.scss";

.wrapper {
  display: flex;
  border-top: $table_border;
  &:first-child {
    border-top: none;
  }
  &:last-child {
    border-bottom: $table_border;
  }
}
.cellrow {
  border-left: $table_border;
  height: 100%;
  overflow: hidden;
  &:first-child {
    border-left: none;
  }
  &:last-child {
    border-right: $table_border;
  }
}
</style>
