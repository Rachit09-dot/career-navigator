const { GoogleGenerativeAI } = require('@google/generative-ai');

try {
  const genAI = new GoogleGenerativeAI('');
  console.log("No error on instantiation");
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  model.generateContent('hello').then(res => console.log(res)).catch(e => console.error("Error on generate:", e.message));
} catch(e) {
  console.error("Error on instantiation:", e.message);
}
