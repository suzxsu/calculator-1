import "./globals.css";

export const metadata = {
  title: "计算器应用",
  description: "使用Go和Next.js构建的计算器",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body>
        {children}
      </body>
    </html>
  );
}
