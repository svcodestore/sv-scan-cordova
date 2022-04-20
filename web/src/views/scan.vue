<template>
  <div>
    <van-button @click="handleClick">返回</van-button>
    <van-button type="primary" @click="handleScan">扫码</van-button>
    <van-button type="info" @click="handleAjax">Ajax</van-button>
  </div>
</template>

<script>
import { test } from '@/apis/scan'
import { Button, Toast } from 'vant'
import Vue from 'vue'
import VueCordova from 'vue-cordova'
Vue.use(VueCordova)

export default {
  components: {
    [Button.name]: Button
  },
  methods: {
    handleClick () {
      this.$router.push('/')
    },
    handleScan () {
      const scanOption = {
        preferFrontCamera: false, // iOS and Android
        showFlipCameraButton: true, // iOS and Android
        showTorchButton: true, // iOS and Android
        torchOn: false, // Android, launch with the torch switched on (if available)
        saveHistory: false, // Android, save scan history (default false)
        prompt: '请将内容放置在扫描区域内', // Android
        resultDisplayDuration: 0, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
        formats: 'QR_CODE,PDF_417' // default: all but PDF_417 and RSS_EXPANDED
      }
      //扫描二维码
      window.cordova.plugins.barcodeScanner.scan(
        result => {
          console.log(result)
          Toast({
            message: '扫码数据：' + result.text,
            position: 'bottom',
            duration: 5000
          })
        },
        error => {
          console.err(error)
        },
        scanOption
      )
    },
    handleAjax () {
      test().then(res => {
        Toast({
          message: '数据：' + JSON.stringify(res),
          position: 'bottom',
          duration: 5000
        })
      })
    }
  }
}
</script>
