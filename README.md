# Go + Next.js 全栈计算器应用

## 项目概述

这是一个使用 Go + ConnectRPC 作为后端、Next.js 作为前端的全栈计算器应用。该应用实现了基础的四则运算功能，通过 ConnectRPC 协议在前后端之间进行通信，并包含完整的单元测试。

## 项目结构

```
calculato/
├── backend/             # Go 后端代码
│   ├── main.go          # 服务入口
│   ├── service/         # 业务逻辑实现
│   │   ├── calculator.go
│   │   └── calculator_test.go
│   ├── proto/           # Protocol Buffers 定义
│   └── gen/             # 自动生成的代码
│ 
└── frontend/            # Next.js 前端代码
    ├── src/
    │   ├── app/         # Next.js 应用
    │   ├── components/  # React 组件
    │   │   ├── Calculator.tsx
    │   │   └── Calculator.test.tsx
    ├── package.json
    └── tsconfig.json
```

## 技术栈

### 后端
- Go 语言
- ConnectRPC 框架
- Protocol Buffers 接口定义
- 标准库 HTTP 服务器
- Go 内置测试框架

### 前端
- Next.js 框架
- React 组件库
- TypeScript 类型系统
- Tailwind CSS 样式库
- Jest 测试框架
- React Testing Library 测试工具

## 主要功能

- 基础的加减乘除运算
- 用户友好的界面，包含输入框和操作选择
- 实时计算结果展示
- 错误处理（如除以零）
- 完整的单元测试覆盖

## 安装与运行

### 后端

1. 确保您已安装 Go 1.18 或更高版本
2. 进入后端目录
   ```bash
   cd backend
   ```
3. 运行服务
   ```bash
   go run main.go
   ```
   后端服务将在 http://localhost:8080 上启动

### 前端

1. 确保您已安装 Node.js 16.0 或更高版本
2. 进入前端目录
   ```bash
   cd frontend
   ```
3. 安装依赖
   ```bash
   npm install
   ```
4. 启动开发服务器
   ```bash
   npm run dev
   ```
   前端应用将在 http://localhost:3000 上启动

## API 接口

计算器服务定义在 Protocol Buffers 文件中，提供以下操作：

```protobuf
service CalculatorService {
  rpc Calculate(CalculateRequest) returns (CalculateResponse) {}
}

message CalculateRequest {
  double a = 1;
  double b = 2;
  Operation operation = 3;
}

enum Operation {
  ADD = 0;
  SUBTRACT = 1;
  MULTIPLY = 2;
  DIVIDE = 3;
}

message CalculateResponse {
  double result = 1;
  string error = 2;
}
```

## 前后端通信

前端通过 HTTP POST 请求与后端通信，遵循 ConnectRPC 协议格式：

```typescript
// 发送 HTTP 请求示例
fetch('http://localhost:8080/calculator.CalculatorService/Calculate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Connect-Protocol-Version': '1',
  },
  body: JSON.stringify({
    a: numA,
    b: numB,
    operation: operation,
  }),
});
```

## 单元测试

### 后端测试

运行所有测试：
```bash
cd backend
go test ./...
```

查看详细测试结果：
```bash
go test -v ./service
```

查看测试覆盖率：
```bash
go test -cover ./service
```

当前后端测试覆盖率：92.3%

### 前端测试

运行所有测试：
```bash
cd frontend
npm test
```

查看测试覆盖率报告：
```bash
npm run test:coverage
```

## 开发注意事项

1. 后端服务需要允许跨域请求才能与前端通信
2. 确保 Protocol Buffers 定义在前后端保持一致
3. 前端需要处理除以零等潜在错误
4. 测试代码应覆盖所有主要功能和错误路径

## 项目扩展方向

1. 添加更复杂的数学运算（如平方根、指数等）
2. 实现计算历史记录功能
3. 添加用户认证和个人偏好设置
4. 部署到云服务并添加缓存层
5. 实现移动端适配或原生应用
