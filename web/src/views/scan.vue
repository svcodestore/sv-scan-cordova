<template>
  <div>
    <van-button @click="handleClick">返回</van-button>
  </div>
</template>

<script>
import { Button } from 'vant'

export default {
  components: {
    [Button.name]: Button
  },
  methods: {
    handleClick () {
      this.$router.push('/')
    }
  }
}
</script>
