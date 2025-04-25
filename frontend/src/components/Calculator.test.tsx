import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Calculator from './Calculator';

// 定义操作枚举(与组件内的枚举保持一致)
enum Operation {
  ADD = 0,
  SUBTRACT = 1,
  MULTIPLY = 2,
  DIVIDE = 3
}

// 模拟全局 fetch API
global.fetch = jest.fn();

describe('Calculator Component', () => {
  // 在每个测试前重置模拟
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockReset();
  });

  it('渲染计算器组件', () => {
    render(<Calculator />);
    
    // 验证UI元素存在
    expect(screen.getByText('计算器')).toBeInTheDocument();
    expect(screen.getByLabelText('数值 A')).toBeInTheDocument();
    expect(screen.getByLabelText('数值 B')).toBeInTheDocument();
    expect(screen.getByLabelText('操作')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '计算' })).toBeInTheDocument();
  });

  it('选择操作时更新操作类型', () => {
    render(<Calculator />);
    
    // 获取操作选择器
    const operationSelect = screen.getByLabelText('操作');
    
    // 选择不同的操作并验证更新
    fireEvent.change(operationSelect, { target: { value: Operation.SUBTRACT } });
    expect(operationSelect).toHaveValue(Operation.SUBTRACT.toString());
    
    fireEvent.change(operationSelect, { target: { value: Operation.MULTIPLY } });
    expect(operationSelect).toHaveValue(Operation.MULTIPLY.toString());
    
    fireEvent.change(operationSelect, { target: { value: Operation.DIVIDE } });
    expect(operationSelect).toHaveValue(Operation.DIVIDE.toString());
  });

  it('提交表单时调用计算服务', async () => {
    // 模拟成功响应
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: 8 }),
    });

    render(<Calculator />);
    
    // 填写表单
    fireEvent.change(screen.getByLabelText('数值 A'), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText('数值 B'), { target: { value: '3' } });
    fireEvent.change(screen.getByLabelText('操作'), { target: { value: Operation.ADD } });
    
    // 提交表单
    fireEvent.submit(screen.getByRole('button', { name: '计算' }));
    
    // 验证调用了 fetch
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/calculator.CalculatorService/Calculate',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Connect-Protocol-Version': '1',
        }),
        body: JSON.stringify({
          a: 5,
          b: 3,
          operation: Operation.ADD,
        }),
      })
    );
    
    // 等待结果显示
    await waitFor(() => {
      expect(screen.getByText('计算结果')).toBeInTheDocument();
      expect(screen.getByText('5 + 3 = 8')).toBeInTheDocument();
    });
  });

  it('处理计算错误', async () => {
    // 模拟错误响应
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: '除以零错误' }),
    });

    render(<Calculator />);
    
    // 填写表单 - 除以零场景
    fireEvent.change(screen.getByLabelText('数值 A'), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText('数值 B'), { target: { value: '0' } });
    fireEvent.change(screen.getByLabelText('操作'), { target: { value: Operation.DIVIDE } });
    
    // 提交表单
    fireEvent.submit(screen.getByRole('button', { name: '计算' }));
    
    // 等待错误显示
    await waitFor(() => {
      expect(screen.getByText('错误')).toBeInTheDocument();
      expect(screen.getByText('除以零错误')).toBeInTheDocument();
    });
  });
}); 