// 의도적으로 ESLint 오류가 있는 코드

const TestComponent = () => {
  // unusedVariable 제거 (사용하지 않으므로)
  let name = "John";
  name = "Jane";
  
  // === 사용 (엄격한 비교)
  if (name === "John") {
    console.log("Hello");
  }
  
  // any 타입 대신 구체적 타입 사용
  const specificValue: string = "test";
  console.log(specificValue);
  
  return <div>Test Component</div>;
};

export default TestComponent;
