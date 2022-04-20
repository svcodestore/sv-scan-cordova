<template>
  <div>
    <van-button type="primary" @click="handleClick">录入</van-button>
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
      this.$router.push('/scan')
    }
  }
}
</script>
