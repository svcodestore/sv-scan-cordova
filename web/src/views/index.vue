<template>
  <div>
    <van-grid>
      <van-grid-item icon="user-o" text="登录" @click="$router.push('/scan')" />
      <van-grid-item icon="qr" text="扫码" @click="$router.push('/scan')" />
    </van-grid>
    <van-tag
      size="medium"
      type="warning"
      style="width: 100vw;
            height: 10vh;
            display: flex;
            justify-content: center;
            align-items: center;
            "
    >
      <span>未登录，无法连接到数据库</span>
      <span>未登录，未绑定工号</span>
    </van-tag>
  </div>
</template>

<script>
import { Button, Grid, Tag, GridItem } from 'vant'

export default {
  components: {
    [Button.name]: Button,
    [Tag.name]: Tag,
    [Grid.name]: Grid,
    [GridItem.name]: GridItem
  },
  data () {
    return {}
  },
  computed: {
    isConnected () {
      return ''
    }
  }
}
</script>
