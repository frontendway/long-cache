module.exports = {
  devServer: {
    port: 9191
  },
  configureWebpack: config => {
    config.entry.app = './src/dev/index.js'
  }
}
