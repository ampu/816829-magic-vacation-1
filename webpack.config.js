const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssoWebpackPlugin = require('csso-webpack-plugin').default;
const CopyPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {resolve, join, sep} = require('path');

const SASS_RULE = {
  test: /\.s[a|c]ss$/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
    },
    {
      loader: `css-loader`,
      options: {
        sourceMap: true,
        url: false,
      },
    },
    {
      loader: `sass-loader`,
      options: {sourceMap: true},
    },
  ],
};

const CSS_RULE = {
  test: /\.css$/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
    },
    {
      loader: `css-loader`,
      options: {
        sourceMap: true,
        url: false,
      },
    },
  ],
};

const HTML_RULE = {
  test: /\.html$/,
  use: [
    {
      loader: `html-loader`,
      options: {
        attributes: false,
      },
    },
    {
      loader: `posthtml-loader`,
      options: {
        plugins: [
          require(`posthtml-include`)({root: `source`}),
        ],
      },
    },
  ],
};

const GLSL_RULE = {
  test: /\.glsl$/,
  use: [
    {
      loader: `webpack-glsl-minify`,
      options: {
        output: `source`,
        esModule: false,
        stripVersion: false,
        preserveDefines: true,
        preserveUniforms: true,
        preserveVariables: true,
        preserveAll: true,
        disableMangle: true,
        nomangle: [],
        includesOnly: true,
      },
    },
  ],
};

module.exports = {
  entry: {
    scripts: [
      `./source/js/script.js`,
      `./source/scss/style.scss`,
      `./source/index.html`,
    ],
  },
  resolve: {
    extensions: [`.js`, `.sass`, `.scss`, `.css`, `.glsl`],
    modules: [`source`, `./node_modules/`],
    alias: {
      helpers: resolve(__dirname, `source/js/helpers`),
      modules: resolve(__dirname, `source/js/modules`),
      scenes: resolve(__dirname, `source/js/scenes`),
      [`3d`]: resolve(__dirname, `source/js/3d`),
      glsl: resolve(__dirname, `source/glsl`),
    },
  },
  mode: `development`,
  devtool: `source-map`,
  devServer: {
    contentBase: join(__dirname, `build`),
    port: 7777,
  },
  output: {
    path: join(__dirname, `build`),
    publicPath: ``,
    filename: `js/script.js`,
  },
  module: {
    rules: [
      SASS_RULE,
      CSS_RULE,
      HTML_RULE,
      GLSL_RULE,
    ],
  },
  plugins: [
    new WriteFilePlugin(),
    new HtmlWebpackPlugin({
      filename: `index.html`,
      template: `source/index.html`,
    }),
    new MiniCssExtractPlugin({
      filename: `css/style.min.css`,
      chunkFilename: `[id].css`,
    }),
    new CssoWebpackPlugin({
      pluginOutputPostfix: `min`,
    }),
    new CopyPlugin([
      {
        from: `source/fonts/**/*.{woff,woff2}`,
        to: join(__dirname, `build`, `fonts`),
        flatten: true,
      },
      {
        from: `source/img/**`,
        to: join(__dirname, `build`),
        transformPath(targetPath) {
          return targetPath.replace(`source${sep}`, ``);
        },
      },
      {
        from: `source/*.ico`,
        to: join(__dirname, `build`),
        flatten: true,
      },
      {
        from: `source/3d/**`,
        to: join(__dirname, `build`),
        transformPath(targetPath) {
          return targetPath.replace(`source${sep}`, ``);
        },
      },
    ]),
  ],
};
