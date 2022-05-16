import request from '@/utils/request'
import { stringify } from 'qs'

const apiPath = {
  pingDb: '/prodScan/pingDb',
  getNameByStaffno: '/prodScan/getNameByStaffno'
}

export function pingDb (data) {
  return request({
    url: apiPath.pingDb,
    method: 'post',
    data: stringify(data)
  })
}

export function getNameByStaffno (data) {
  return request({
    url: apiPath.getNameByStaffno,
    method: 'post',
    data: stringify(data)
  })
}
