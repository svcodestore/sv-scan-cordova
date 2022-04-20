const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: '../www',
  publicPath: './',
  productionSourceMap: false,
  lintOnSave: false
})
