<template>
  <div>
    <van-nav-bar
      title="生产数据录入"
      left-text="返回"
      left-arrow
      @click-left="$router.push('/')"
    />
    <div class="table">
      <van-cell-group>
        <van-field
          v-model="phs"
          label="款号"
          readonly
          :border="false"
          use-button-slot
        >
          <van-button
            slot="button"
            :loading="scanBtnLoading"
            size="small"
            type="primary"
            @click="handleScan"
          >
            <van-icon name="qr" /> 扫码
          </van-button>
          <van-button
            style="margin-left: 5px;"
            slot="button"
            :loading="scanMultiBtnLoading"
            size="small"
            type="primary"
            bindtap="handleScanMulti"
          >
            连续扫码
          </van-button>
        </van-field>
        <van-field v-model="multiPhs" label="工序" readonly :border="false">
          <van-button slot="button" size="small" bindtap="getScanRecord">
            扫码记录
          </van-button>
        </van-field>
      </van-cell-group>

      <div class="tbls">
        <c-table
          :isShowHeader="false"
          ref="scanedTbl"
          :data="scanedData"
          :columns="scanColumns"
        ></c-table>
        <c-table
          ref="scanTbl"
          :data="scanData"
          :columns="scanColumns"
        ></c-table>
      </div>
    </div>

    <van-action-sheet
      :show="isShowQtySetting"
      title="数量更改"
      @close="handleCloseQtySetting"
    >
      <div class="input-bar">
        <van-field
          class="input-bar_item"
          v-model="missingQty"
          size="large"
          label="少数"
          placeholder="少数"
          type="number"
          :border="false"
          @change="onMissingQtyChange"
        />
        <van-field
          class="input-bar_item"
          v-model="badQty"
          size="large"
          label="不良数"
          placeholder="不良数"
          type="number"
          :border="false"
          @change="onBadQtyChange"
        />
      </div>
      <div style="display: flex;">
        <van-button
          type="primary"
          size="large"
          style="width: 50%; height: 100%;"
          @click="handSaveQtySetting"
          >保存
        </van-button>
        <van-button
          type="default"
          size="large"
          style="width: 50%; height: 100%;"
          @click="handleCloseQtySetting"
          >取消
        </van-button>
      </div>
    </van-action-sheet>
    <van-popup
      v-model="isShowSubPhs"
      round
      position="bottom"
      style="height: 90%"
      @close="isShowSubPhs = false"
    >
      <div class="phase-container">
        <div class="phases">
          <c-table
            ref="phsTbl"
            @CheckboxChange="onTableCheckboxChange"
            :data="phaseData"
            :columns="phaseColumns"
          >
          </c-table>
        </div>
        <div class="phase-toolbar">
          <van-button
            type="primary"
            size="large"
            style="width: 50%; height: 100%;"
            @click="handleAddPhase"
          >
            确认
          </van-button>
          <van-button
            type="default"
            size="large"
            style="width: 50%; height: 100%;"
            @click="handleCancelAdd"
            >取消
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {
  Button,
  Toast,
  NavBar,
  CellGroup,
  Field,
  Icon,
  ActionSheet,
  Popup
} from 'vant'
import Vue from 'vue'
import VueCordova from 'vue-cordova'
Vue.use(VueCordova)

import { getPhases, saveScanData } from '@/apis/scan'
import Table from '@/components/Table'

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

export default {
  components: {
    [Button.name]: Button,
    [NavBar.name]: NavBar,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [Icon.name]: Icon,
    [ActionSheet.name]: ActionSheet,
    [Popup.name]: Popup,
    [Table.name]: Table
  },
  data () {
    return {
      isShowQtySetting: false,
      phs: '',
      multiPhs: '',
      phsQty: '',
      bedno: '',
      scanedData: [],
      scanData: [],
      scanColumns: [
        {
          field: 'prdno',
          title: '制单号'
        },
        {
          field: 'facno',
          title: '款号'
        },
        {
          field: 'bedno',
          title: '床号'
        },
        {
          field: 'bundleNo',
          title: '扎号'
        },
        {
          field: 'phsName',
          title: '工序'
        },
        {
          field: 'qty',
          title: '数量'
        }
      ],
      missingQty: '',
      badQty: '',
      scanBtnLoading: false,
      scanMultiBtnLoading: false,
      isShowSubPhs: false,
      phaseColumns: [
        {
          field: 'item',
          title: '序号'
        },
        {
          field: 'descn',
          title: '名称'
        },
        {
          field: 'qty',
          title: '数量'
        },
        {
          title: '选择',
          type: 'checkbox'
        }
      ],
      phaseData: []
    }
  },
  methods: {
    handleAddPhase () {
      const rows = this.$refs.phsTbl.checkedRows

      const data = []
      rows.forEach(row => {
        if (row.checked && !row.presetChecked) {
          this.scanData.push({
            prdno: this.phs,
            facno: this.phs,
            bedno: this.bedno,
            bundleNo: this.bundleNo,
            phsName: [row.descn, row.item].join(' - '),
            qty: row.qty - this.missingQty - this.badQty,
            item: row.item
          })
          data.push({
            prdno: this.phs,
            facno: this.phs,
            bedno: this.bedno,
            seq: this.bundleNo,
            item: row.item,
            descn: row.descn,
            qty: row.qty
          })
        }
      })
      if (rows.length) {
        if (data.length) {
          this.savePhaseRemote(data).then(res => {
            if (res.every(e => !!e)) {
              Toast({
                message: '已录入',
                duration: 500
              })
            }
          })
        }
        this.$refs.phsTbl.checkedRows = []
        const multiPhs = rows
          .map(row => row.descn + ' - ' + row.item)
          .join(', ')
        this.isShowSubPhs = false
        this.multiPhs = this.multiPhs
          ? this.multiPhs + ', ' + multiPhs
          : multiPhs
      }
    },
    savePhaseRemote (data) {
      const promises = data.map(
        ({ prdno, facno, bedno, seq, item, descn, qty }) =>
          new Promise(resolve => {
            const hostname = localStorage.getItem('database')
            const username = localStorage.getItem('dbUsr')
            const password = localStorage.getItem('dbPwd')
            const database = localStorage.getItem('dbname')
            const name = localStorage.getItem('username')
            const workno = localStorage.getItem('staffno')
            saveScanData({
              hostname,
              username,
              password,
              database,
              workno,
              name,
              prdno,
              facno,
              bedno,
              seq,
              item,
              descn,
              qty
            }).then(res => {
              resolve(res.data)
            })
          })
      )

      return Promise.all(promises)
    },
    handleScanMulti () {
      if (!this.scanData.length) return

      this.scanMultiBtnLoading = true

      window.cordova.plugins.barcodeScanner.scan(
        ({ text }) => {
          const codeInfo = text.split('@')

          if (codeInfo[3] === this.bundleNo) {
            this.scanMultiBtnLoading = false
            return
          }

          this.phs = codeInfo[0]
          this.bedno = codeInfo[2]
          this.bundleNo = codeInfo[3]
          this.phsQty = codeInfo[4]

          const data = []
          Array.from(
            new Set(this.scanData.map(({ phsName }) => phsName))
          ).forEach(name => {
            data.push({
              prdno: this.phs,
              facno: this.phs,
              desc: name.split(' - ')[0],
              qty: this.phsQty,
              seq: this.bundleNo,
              bedno: this.bedno,
              item: name.split(' - ')[1]
            })
            this.scanData.push({
              prdno: this.phs,
              facno: this.phs,
              phsName: name,
              qty: this.phsQty,
              bundleNo: this.bundleNo,
              bedno: this.bedno
            })
          })

          this.savePhaseRemote(data).finally(() => {
            this.scanMultiBtnLoading = false
          })
        },
        error => {
          this.scanMultiBtnLoading = false
          console.err(error)
        },
        scanOption
      )
    },
    handleScan () {
      this.scanBtnLoading = true
      const text = '202150001-A5@Y50001-A5@1@66@60'
      const codeInfo = text.split('@')
      this.phs = codeInfo[0]
      this.bedno = codeInfo[2]
      this.bundleNo = codeInfo[3]
      this.phsQty = codeInfo[4]

      const hostname = localStorage.getItem('database')
      const username = localStorage.getItem('dbUsr')
      const password = localStorage.getItem('dbPwd')
      const database = localStorage.getItem('dbname')
      const name = localStorage.getItem('username')

      getPhases({
        hostname,
        username,
        password,
        database,
        facno: this.phs,
        name
      })
        .then(({ data }) => {
          const scanedIndex = []
          this.scanData.forEach(item => {
            data.forEach((e, i) => {
              const [s, n] = item.phsName.split(' - ')
              if (
                item.item == e.item &&
                item.qty == e.qty &&
                item.facno == e.facno &&
                e.descn == s &&
                e.item == n
              ) {
                scanedIndex.push(i)
              }
            })
          })

          this.phaseData = data.map((e, i) => {
            if (scanedIndex.includes(i)) {
              e.checked = true
              e.presetChecked = true
            } else {
              e.checked = false
            }
            return e
          })
          this.isShowSubPhs = true
        })
        .finally(() => {
          this.scanBtnLoading = false
        })
      this.scanBtnLoading = false
      //扫描二维码
      // window.cordova.plugins.barcodeScanner.scan(
      //   ({ text }) => {
      //     // 202150001-A5@Y50001-A5@1@66@60
      //     const codeInfo = text.split('@')
      //     console.log(codeInfo, 'codeInfo')
      //     this.phs = codeInfo[0]
      //     this.bedno = codeInfo[2]
      //     this.bundleNo = codeInfo[3]
      //     this.phsQty = codeInfo[4]

      //     const hostname = localStorage.getItem('database')
      //     const username = localStorage.getItem('dbUsr')
      //     const password = localStorage.getItem('dbPwd')
      //     const database = localStorage.getItem('dbname')
      //     const name = localStorage.getItem('username')

      //     getPhases({
      //       hostname,
      //       username,
      //       password,
      //       database,
      //       facno: this.phs,
      //       name
      //     })
      //       .then(({ data }) => {
      //         console.log(data, 'getPhases')
      //         const scanedIndex = []
      //         this.scanData.forEach(item => {
      //           data.data.forEach((e, i) => {
      //             if (
      //               item.phsName.split(' - ')[0] == e.desc.trim() &&
      //               item.facno == e.facno
      //             ) {
      //               scanedIndex.push(i)
      //             }
      //           })
      //         })
      //         this.phaseData = data.data.map((e, i) => {
      //           e.descn = e.descn.trim()
      //           if (scanedIndex.includes(i)) {
      //             e.checked = true
      //             e.presetChecked = true
      //           } else {
      //             e.checked = false
      //           }
      //           return e
      //         })
      //         this.isShowSubPhs = true
      //         Toast({
      //           message: '已录入',
      //           duration: 500
      //         })
      //       })
      //       .finally(() => {
      //         this.scanBtnLoading = false
      //       })
      //   },
      //   error => {
      //     this.scanBtnLoading = false
      //     console.err(error)
      //   },
      //   scanOption
      // )
    },
    handleAjax () {}
  }
}
</script>

<style>
.phase-container {
  height: 100%;
}

.phases {
  height: 90%;
  width: 100%;
  overflow: auto;
}

.phase-toolbar {
  height: 10%;
  width: 100%;
  display: flex;
}
.table {
  height: 100vh;
}
.tbls {
  height: calc(100vh - 100px);
  overflow: auto;
}
</style>
