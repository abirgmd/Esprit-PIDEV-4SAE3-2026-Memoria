$apiUrl = "http://localhost:8081/api"

Write-Host "========== TEST DE PERSISTENCE DES DONNEES ==========" -ForegroundColor Cyan
Write-Host ""

# Données de test FACES
$testData = @{
    patientId = 1
    soignantId = 101
    accompagnantId = 1
    titre = "Mémoire des visages - Test Automatique"
    description = "Test personnalisé FACES via script PowerShell"
    stage = "STABLE"
    dateLimite = "2026-02-28"
    instructions = "Reconnaissance de 2 personnes"
    items = @(
        @{
            question = "Qui est cette personne ?"
            reponse = "Dr. Jean Dupont - Médecin"
            score = 5
            imageUrl = $null
            metadata = @{
                nom = "Dr. Jean Dupont"
                lien = "Médecin"
            }
        },
        @{
            question = "Qui soigne ce patient ?"
            reponse = "Infirmière Marie Martin"
            score = 5
            imageUrl = $null
            metadata = @{
                nom = "Infirmière Marie Martin"
                lien = "Infirmier"
            }
        }
    )
} | ConvertTo-Json -Depth 10

Write-Host "ETAPE 1: Envoi de la requête POST au serveur..." -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri "$apiUrl/assignations/personalized" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $testData `
        -UseBasicParsing

    $result = $response.Content | ConvertFrom-Json
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host "Assignment ID: $($result.id)" -ForegroundColor Green
    Write-Host "Test ID: $($result.test.id)" -ForegroundColor Green
    Write-Host "Status: $($result.status)" -ForegroundColor Green
    Write-Host ""
}
catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "ETAPE 2: Vérification des données du patient..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$apiUrl/assignations/patient/1/tests" `
        -Method GET `
        -UseBasicParsing
    
    $assignments = $response.Content | ConvertFrom-Json
    Write-Host "Nombre de tests: $($assignments.Count)" -ForegroundColor Green
    Write-Host ""
}
catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "========== TEST TERMINE ==========" -ForegroundColor Cyan
