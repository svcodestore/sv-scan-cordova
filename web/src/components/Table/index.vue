<template>
  <div>
    <div class="tr bg-w" v-if="isShowHeader">
      <div class="th" v-for="(col, idx) in columns" :key="idx">
        {{ col.title }}
      </div>
    </div>
    <div v-for="(item, idx) in data" :key="idx">
      {{ item.title }}
      <div :class="idx % 2 === 0 ? 'tr bg-g' : 'tr'">
        <div
          class="td"
          v-for="(col, i) in columns"
          :key="i"
          :style="`width: ${100 / columns.length}%`"
        >
          <van-checkbox
            v-if="col.type === 'checkbox'"
            v-model="item.checked"
            shape="square"
            @change="onCheckboxChange(item)"
          />
          <span v-else>
            {{ item[col.field] }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Checkbox } from 'vant'

export default {
  name: 'c-table',
  props: {
    isShowHeader: {
      type: Boolean,
      default: () => true
    },
    data: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    }
  },
  components: {
    [Checkbox.name]: Checkbox
  },
  data () {
    return {
      lastCheckedRow: null,
      checkedRows: []
    }
  },
  methods: {
    onCheckboxChange (row) {
      const checkedIndex = this.data.findIndex(e => e.item == row.item)
      if (!row.presetChecked) {
        if (!row.checked) {
          this.checkedRows = this.checkedRows.filter(
            e => e.item != row.item && e.descn != row.descn
          )
        } else {
          this.checkedRows.push(this.data[checkedIndex])
        }
        this.lastCheckedRow = row
      }
      this.$emit('CheckboxChange', { row, checkedIndex })
    },
    getCheckedRow () {
      return this.data.filter(e => e.checked === true)
    }
  },
  mounted () {}
}
</script>

<style>
.tr {
  display: flex;
  width: 100%;
  justify-content: center;
  height: 3rem;
  align-items: center;
  overflow: hidden;
}
.td {
  width: 40%;
  justify-content: center;
  text-align: center;
  font-size: x-small;
}
.bg-w {
  background: snow;
}
.bg-g {
  background: #e6f3f9;
}
.th {
  width: 40%;
  justify-content: center;
  background: #3366ff;
  color: #fff;
  display: flex;
  height: 3rem;
  align-items: center;
}
</style>
