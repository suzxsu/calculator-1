package service

import (
	"context"
	"errors"
	"fmt"

	"github.com/bufbuild/connect-go"
	calculatorv1 "calculator/gen/proto/calculator"
	"calculator/gen/proto/calculator/calculatorconnect"
)

// CalculatorServer 实现 CalculatorService
type CalculatorServer struct{}

// NewCalculatorServer 创建一个新的计算器服务器实例
func NewCalculatorServer() *CalculatorServer {
	return &CalculatorServer{}
}

// Calculate 实现了计算功能
func (s *CalculatorServer) Calculate(
	ctx context.Context,
	req *connect.Request[calculatorv1.CalculateRequest],
) (*connect.Response[calculatorv1.CalculateResponse], error) {
	r := req.Msg
	result := 0.0

	switch r.Operation {
	case calculatorv1.Operation_ADD:
		result = r.A + r.B
	case calculatorv1.Operation_SUBTRACT:
		result = r.A - r.B
	case calculatorv1.Operation_MULTIPLY:
		result = r.A * r.B
	case calculatorv1.Operation_DIVIDE:
		if r.B == 0 {
			return nil, connect.NewError(
				connect.CodeInvalidArgument,
				errors.New("division by zero"),
			)
		}
		result = r.A / r.B
	default:
		return nil, connect.NewError(
			connect.CodeInvalidArgument,
			fmt.Errorf("unknown operation: %v", r.Operation),
		)
	}

	response := &calculatorv1.CalculateResponse{
		Result: result,
	}
	return connect.NewResponse(response), nil
}

// ensure CalculatorServer implements CalculatorServiceHandler
var _ calculatorconnect.CalculatorServiceHandler = (*CalculatorServer)(nil) 