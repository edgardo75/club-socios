const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
const test1 = "Alvare%";
const test2 = "Edgardo";
const test3 = "Juan Perez";

console.log(`Testing '${test1}': ${nameRegex.test(test1)}`);
console.log(`Testing '${test2}': ${nameRegex.test(test2)}`);
console.log(`Testing '${test3}': ${nameRegex.test(test3)}`);
