// jest-dom 添加了自定义的 jest matchers 用于断言 DOM 状态
import '@testing-library/jest-dom';

// Mock TextEncoder/TextDecoder，因为在jsdom环境中不存在这些类
global.TextEncoder = class {
  encode(text) {
    return new Uint8Array(Buffer.from(text));
  }
};

global.TextDecoder = class {
  decode(buffer) {
    return Buffer.from(buffer).toString();
  }
}; 