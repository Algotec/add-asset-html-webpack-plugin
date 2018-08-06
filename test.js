import ManipulateAssetsHtmlWebpackPlugin from './src/index';

test('does not fail constructor', () => {
  expect(new ManipulateAssetsHtmlWebpackPlugin()).toBeDefined();
});
