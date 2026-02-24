// Test Script for Personalized Test Form
// Paste this in browser console (F12) when on the personalized test form page

console.log("=== Personalized Test Form - Automated Test ===");

// Get the component state
const testForm = {
  testType: 'FACES',
  patientId: 1,
  patientName: 'Robert Lefebvre',
  stage: 'STABLE',
  dateLimite: '2026-12-31',
  instructions: 'Please recognize the familiar faces shown to you.',
  items: [
    {
      question: 'Who is this person?',
      reponse: 'Alice Lefebvre',
      score: 1,
      imageUrl: null,
      metadata: {
        nom: 'Alice Lefebvre',
        lien: 'Fille'
      }
    },
    {
      question: 'Recognize this person?',
      reponse: 'Marguerite',
      score: 1,
      imageUrl: null,
      metadata: {
        nom: 'Marguerite Lefebvre',
        lien: 'Épouse'
      }
    }
  ]
};

const payload = {
  patientId: testForm.patientId,
  soignantId: 101,  // Valid soignant from database
  accompagnantId: null,
  titre: `Mémoire des visages - ${testForm.patientName}`,
  description: `Test personnalisé de type ${testForm.testType}`,
  stage: testForm.stage,
  dateLimite: testForm.dateLimite,
  instructions: testForm.instructions,
  items: testForm.items
};

console.log("Payload to be sent:");
console.log(JSON.stringify(payload, null, 2));

// Send the request
console.log("\nSending POST request to /api/assignations/personalized...");

fetch('http://localhost:8081/api/assignations/personalized', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(payload)
})
.then(response => {
  console.log("Response Status:", response.status);
  console.log("Response Headers:", response.headers);
  return response.json();
})
.then(data => {
  console.log("✅ Success! Response:", data);
  console.log("Test created with ID:", data.id);
  console.log("Test Title:", data.test?.titre);
  alert('Test créé avec succès!\nID: ' + data.id);
})
.catch(error => {
  console.error("❌ Error:", error);
  console.error("Error Details:", error.message);
  console.error("Stack:", error.stack);
  alert('Erreur: ' + error.message);
});

console.log("\n=== Test Complete ===");
console.log("Check the 'Network' tab to see the request/response");
console.log("Check the database: SELECT * FROM patient_test_assignations WHERE patient_id = 1;");
