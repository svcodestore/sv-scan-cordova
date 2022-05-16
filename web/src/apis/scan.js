import request from '@/utils/request'
import { stringify } from 'qs'

const apiPath = {
  getPhases: '/prodScan/getPhases',
  saveScanData: '/prodScan/saveScanData',
  updateScanDataQty: '/prodScan/updateScanDataQty',
  getScanRecord: '/prodScan/getScanRecord'
}

export function getPhases (data) {
  return request({
    url: apiPath.getPhases,
    method: 'post',
    data: stringify(data)
  })
}

export function saveScanData (data) {
  return request({
    url: apiPath.saveScanData,
    method: 'post',
    data: stringify(data)
  })
}

export function updateScanDataQty (data) {
  return request({
    url: apiPath.updateScanDataQty,
    method: 'post',
    data: stringify(data)
  })
}

export function getScanRecord (data) {
  return request({
    url: apiPath.getScanRecord,
    method: 'post',
    data: stringify(data)
  })
}
