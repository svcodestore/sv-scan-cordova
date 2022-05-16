<template>
  <div>
    <van-cell-group>
      <van-nav-bar
        title="登录"
        left-text="返回"
        left-arrow
        @click-left="$router.go(-1)"
      />
      <div v-if="!isConnected || isEdit">
        <van-field
          v-model="database"
          required
          clearable
          label="数据库地址"
          placeholder="请输入数据库地址"
          bind:change="onDbChange"
        />
        <van-field
          v-model="dbUsr"
          required
          clearable
          label="数据库账号"
          placeholder="请输入账号"
          bind:change="onDbUsrChange"
        />
        <van-field
          v-model="dbPwd"
          required
          clearable
          label="数据库密码"
          type="password"
          placeholder="请输入密码"
          bind:change="onDbPwdChange"
        />
        <van-field
          v-model="dbname"
          required
          clearable
          label="数据库名称"
          placeholder="请输入数据库名称"
          bind:change="onDbnameChange"
        />
      </div>
      <van-button
        v-if="isConnected && !isEdit"
        type="info"
        plain
        size="large"
        style="margin: 15rpx 0;"
        @click="onLoginDb('edit')"
      >
        已连接，修改连接
      </van-button>
      <van-button
        v-if="!isConnected || isEdit"
        type="info"
        plain
        size="large"
        :loading="loginBtnLoading"
        :disabled="!dbPwd || !dbUsr || !database || !dbname"
        style="margin: 15rpx 0;"
        @click="onLoginDb"
      >
        连接数据库
      </van-button>
      <van-field
        v-model="staffno"
        required
        clearable
        label="工号"
        placeholder="请输入工号"
        @input="onUsrChange"
      />
      <van-field v-model="username" readonly label="姓名" />
    </van-cell-group>
  </div>
</template>

<script>
import { CellGroup, Field, Button, Toast, NavBar } from 'vant'
import { pingDb, getNameByStaffno } from '@/apis/login'

export default {
  components: {
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [Button.name]: Button,
    [NavBar.name]: NavBar
  },
  data () {
    return {
      loginBtnLoading: false,
      isConnected: false,
      isLogined: false,
      staffno: void 0,
      username: void 0,
      database: void 0,
      dbUsr: void 0,
      dbPwd: void 0,
      dbname: void 0,
      isEdit: false
    }
  },
  mounted () {
    this.isConnected = localStorage.getItem('isConnected') === 'true'
    this.isConnected = localStorage.getItem('isLogined') === 'true'
    this.database = localStorage.getItem('database')
    this.dbUsr = localStorage.getItem('dbUsr')
    this.dbPwd = localStorage.getItem('dbPwd')
    this.dbname = localStorage.getItem('dbname')
    this.staffno = localStorage.getItem('staffno')
    this.username = localStorage.getItem('username')
  },
  methods: {
    onLoginDb (isEdit = '') {
      if (isEdit === 'edit') {
        this.isEdit = !this.isEdit
      } else {
        this.loginBtnLoading = true
        pingDb({
          hostname: this.database,
          username: this.dbUsr,
          password: this.dbPwd,
          database: this.dbname
        })
          .then(({ result }) => {
            if (result) {
              this.isEdit = false
              this.isConnected = true
              localStorage.setItem('isConnected', true)
              localStorage.setItem('database', this.database)
              localStorage.setItem('dbUsr', this.dbUsr)
              localStorage.setItem('dbPwd', this.dbPwd)
              localStorage.setItem('dbname', this.dbname)
            } else {
              Toast({
                message: '连接数据库失败',
                duration: 1000
              })
            }
          })
          .finally(() => {
            this.loginBtnLoading = false
          })
      }
    },
    onUsrChange () {
      getNameByStaffno({
        hostname: this.database,
        username: this.dbUsr,
        password: this.dbPwd,
        database: this.dbname,
        staffno: this.staffno
      }).then(({ data }) => {
        localStorage.setItem('staffno', this.staffno)
        localStorage.setItem('username', data[0].name)
        localStorage.setItem('isLogined', true)
        this.username = data[0].name
      })
    }
  }
}
</script>
