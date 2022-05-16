<template>
  <div>
    <div style="width: 100vw; height: 90vh;">
      <van-grid>
        <van-grid-item
          icon="user-o"
          text="登录"
          @click="$router.push('/login')"
        />
        <van-grid-item
          icon="qr"
          text="扫码"
          @click="$router.push(isLogined ? '/scan' : '/login')"
        />
      </van-grid>
    </div>
    <div
      v-if="!isLogined"
      style="width: 100vw;
            height: 10vh;
            display: flex;
            justify-content: center;
            align-items: center;"
    >
      <van-tag size="medium" type="warning">
        <span v-if="isConnected">未绑定工号</span>
        <span v-else>未登录</span>
      </van-tag>
    </div>
    <div
      style="text-align: center;
              margin: auto;
              color: gray;
              font-size: small;
              letter-spacing: 2px;
              "
      v-if="username"
    >
      {{ username }}
    </div>
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
    return {
      isConnected: false,
      isLogined: false,
      username: ''
    }
  },
  mounted () {
    this.isLogined = localStorage.getItem('isLogined') === 'true'
    this.username = localStorage.getItem('username')
  }
}
</script>
