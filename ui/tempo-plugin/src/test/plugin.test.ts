import { testing } from "../plugins/tempo-datasource";

test('fooTest description', () => {
  expect('bar expected response')   
});

test('apple pie', () => {
  const str = testing();
  expect(str).toBeDefined();
})