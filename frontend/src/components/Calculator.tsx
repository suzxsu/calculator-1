'use client';

import { useState } from 'react';

// 定义操作枚举
enum Operation {
  ADD = 0,
  SUBTRACT = 1,
  MULTIPLY = 2,
  DIVIDE = 3
}

// 计算器组件
export default function Calculator() {
  const [a, setA] = useState<string>('');
  const [b, setB] = useState<string>('');
  const [operation, setOperation] = useState<Operation>(Operation.ADD);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // 数值A输入处理
  const handleAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setA(e.target.value);
  };

  // 数值B输入处理
  const handleBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setB(e.target.value);
  };

  // 操作选择处理
  const handleOperationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOperation(parseInt(e.target.value) as Operation);
  };

  // 提交计算请求
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setResult('');
    setLoading(true);

    try {
      // 将输入值转换为数字
      const numA = parseFloat(a);
      const numB = parseFloat(b);

      // 验证输入
      if (isNaN(numA) || isNaN(numB)) {
        throw new Error('请输入有效的数字');
      }

      // 构建请求体
      const requestBody = {
        a: numA,
        b: numB,
        operation: operation,
      };

      // 发送请求
      const response = await fetch('http://localhost:8080/calculator.CalculatorService/Calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Connect-Protocol-Version': '1',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '请求失败');
      }

      const data = await response.json();
      setResult(data.result.toString());
    } catch (err) {
      console.error('计算错误:', err);
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setLoading(false);
    }
  };

  // 获取操作符号
  const getOperationSymbol = (op: Operation): string => {
    switch (op) {
      case Operation.ADD:
        return '+';
      case Operation.SUBTRACT:
        return '-';
      case Operation.MULTIPLY:
        return '×';
      case Operation.DIVIDE:
        return '÷';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">计算器</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="a" className="block text-sm font-medium text-gray-700 mb-1">
              数值 A
            </label>
            <input
              id="a"
              type="number"
              value={a}
              onChange={handleAChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="operation" className="block text-sm font-medium text-gray-700 mb-1">
              操作
            </label>
            <select
              id="operation"
              value={operation}
              onChange={handleOperationChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={Operation.ADD}>+</option>
              <option value={Operation.SUBTRACT}>-</option>
              <option value={Operation.MULTIPLY}>×</option>
              <option value={Operation.DIVIDE}>÷</option>
            </select>
          </div>

          <div>
            <label htmlFor="b" className="block text-sm font-medium text-gray-700 mb-1">
              数值 B
            </label>
            <input
              id="b"
              type="number"
              value={b}
              onChange={handleBChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? '计算中...' : '计算'}
        </button>
      </form>

      {/* 显示结果 */}
      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <h2 className="text-lg font-medium text-green-800">计算结果</h2>
          <div className="mt-2 text-xl font-semibold">
            {a} {getOperationSymbol(operation)} {b} = {result}
          </div>
        </div>
      )}

      {/* 显示错误 */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <h2 className="text-lg font-medium text-red-800">错误</h2>
          <div className="mt-2 text-red-600">{error}</div>
        </div>
      )}
    </div>
  );
} 