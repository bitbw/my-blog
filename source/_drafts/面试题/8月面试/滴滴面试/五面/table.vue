<template>
  <select :multiple="multiple" :value="value" @change="handleChange">
    <template v-for="(option, index) in options">
      <option :key="option.value + index" :value="option.value">
        {{ option.text }}
      </option>
    </template>
  </select>
</template>

<script>
// 实现一个select组件
// 单选 多选
// 搜索
// 远程获取数据

export default {
  name: "select",
  props: {
    value: {
      type: [String, Number, Array],
      default: ""
    },
    fetch: {
      type: Function
    },
    // 远程获取数据
    remote: {
      type: Boolean,
      default: true
    },
    error: {
      type: Function
    },
    exclude: {
      type: Array
    },
    // 搜索
    search: {
      type: Boolean,
      default: true
    },
    // 多选
    multiple: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default: () => [
        {
          value: 1,
          text: 1
        }
      ]
    }
  },
  mouthd: {
    handleChange(e) {
      //  双向绑定 父组件可以直接 v-model
      this.$emit("input", e.target.value);
      if (!this.exclude.includs(e.target.value)) {
        try {
          this.fetch(value);
        } catch (error) {
          this.error(error);
        }
      }
    }
  }
};
</script>

<style></style>
