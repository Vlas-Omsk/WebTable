<template>
  <table class="popup changesize" :style="{ width: data.width + 'px' }">
    <tr v-for="(opt, id) of data.options" :key="id">
      <td class="popup__text">{{ opt.label }}</td>
      <td class="popup__control">
        <input type="text" class="popup__control input" v-model="opt.input" />
      </td>
    </tr>
    <tr>
      <td colspan="2">
        <div class="popup__container">
          <div class="button" @click="$emit('close')">
            Cancel
          </div>
          <div
            class="button green"
            @click="
              call(data.apply.click, $event);
              $emit('close');
            "
          >
            {{ data.apply.label }}
          </div>
        </div>
      </td>
    </tr>
  </table>
</template>

<script>
import Events from "@/events";

export default {
  props: {
    data: {
      type: Object,
    },
  },
  methods: {
    call(method, e) {
      method.bind(this.data)(e);
    },
  },
};
</script>
