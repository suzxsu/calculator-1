package service

import (
	"context"
	"testing"

	"github.com/bufbuild/connect-go"
	calculatorv1 "calculator/gen/proto/calculator"
)

func TestCalculate(t *testing.T) {
	server := NewCalculatorServer()
	ctx := context.Background()

	tests := []struct {
		name      string
		a         float64
		b         float64
		operation calculatorv1.Operation
		want      float64
		wantErr   bool
	}{
		{
			name:      "Addition",
			a:         5,
			b:         3,
			operation: calculatorv1.Operation_ADD,
			want:      8,
			wantErr:   false,
		},
		{
			name:      "Subtraction",
			a:         5,
			b:         3,
			operation: calculatorv1.Operation_SUBTRACT,
			want:      2,
			wantErr:   false,
		},
		{
			name:      "Multiplication",
			a:         5,
			b:         3,
			operation: calculatorv1.Operation_MULTIPLY,
			want:      15,
			wantErr:   false,
		},
		{
			name:      "Division",
			a:         6,
			b:         3,
			operation: calculatorv1.Operation_DIVIDE,
			want:      2,
			wantErr:   false,
		},
		{
			name:      "Division by zero",
			a:         5,
			b:         0,
			operation: calculatorv1.Operation_DIVIDE,
			want:      0,
			wantErr:   true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := connect.NewRequest(&calculatorv1.CalculateRequest{
				A:         tt.a,
				B:         tt.b,
				Operation: tt.operation,
			})

			resp, err := server.Calculate(ctx, req)
			
			if (err != nil) != tt.wantErr {
				t.Errorf("Calculate() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			
			if err == nil && resp.Msg.Result != tt.want {
				t.Errorf("Calculate() = %v, want %v", resp.Msg.Result, tt.want)
			}
		})
	}
} 