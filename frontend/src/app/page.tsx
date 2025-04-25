import Calculator from '../components/Calculator';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-5xl w-full">
        <h1 className="text-4xl font-bold text-center mb-8">ConnectRPC 计算器</h1>
        <p className="text-center mb-8 text-lg">
          这是一个使用 Go + ConnectRPC 作为后端、Next.js 作为前端的计算器应用
        </p>
        <Calculator />
      </div>
    </main>
  );
}
