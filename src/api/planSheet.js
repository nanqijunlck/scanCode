import { request } from "@/utils/request";

export function getPlanSheetList(params) {
   return request({
      url:'/1.0/saleOrder/pageQuery',
      method:'post',
      data:params
   })
}

export function getQualityTestingRecord(params) {
   return request({
      url:'/1.0/qualityOrder/pageQuery',
      method:'post',
      data:params
   })
}

export function getQualityTestingQuestion(params) {
   return request({
      url:'/1.0/question/pageQuery',
      method:'post',
      data:params
   })
}

export function addOrUpdate(params) {
   return request({
      url:'/1.0/question/addOrUpdate',
      method:'post',
      data:params
   })
}

export function deleteOr(params) {
   return request({
      url:'/1.0/question/delete',
      method:'get',
      params
   })
}

export function getHitchList(params) {
   return request({
      url:'/1.0/statistics/questionCodeStatics',
      method:'post',
      data:params
   })
}

export function getPassRateList(params) {
   return request({
      url:'/1.0/statistics/roleQuestionStatics',
      method:'post',
      data:params
   })
}

export function getQrCodeList(params){
   return request({
      url:'/1.0/qrCodeOrder/pageQuery',
      method:'post',
      data:params
   })
}

export function downloadQrCode(params) {
   return request({
      url:'/1.0/qrCodeOrder/downloadPdf',
      method:'post',
      data:params,
      isDownloadFile:true
   })
}