const gradient = require('gradient-string')

const defaultBanner = 'our-cli - A CLI that helps you quickly set up and develop frontend projects'

const gradientBanner = gradient.cristal(defaultBanner)

module.exports = {
  defaultBanner,
  gradientBanner
}