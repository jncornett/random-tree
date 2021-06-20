import HtmlWebpackPlugin from "html-webpack-plugin";

export default {
  mode: "development",
  entry: "./src/index.ts",
  resolve: { extensions: [".ts", ".js"] },
  plugins: [new HtmlWebpackPlugin({ template: "src/index.html" })],
  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: { babelrc: true },
        },
      },
    ],
  },
  devServer: {
    hot: true,
  },
};
