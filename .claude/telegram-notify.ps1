# Telegram notification script for Claude Code
param()

# Telegram Bot Configuration
$token = "8403365649:AAFpSpaTCFYPnyTbzOKMd1CPA9whHiS5V80"
$chatId = "1977346945"

# Get current time
$time = Get-Date -Format "HH:mm"
$date = Get-Date -Format "dd/MM/yyyy"

# Create message
$message = @"
🤖 Claude Code ha terminato il lavoro!
📅 $date alle $time
🏁 Sessione completata
"@

# Send to Telegram
$uri = "https://api.telegram.org/bot$token/sendMessage"
try {
    $body = @{
        chat_id = $chatId
        text = $message
    }
    Invoke-RestMethod -Uri $uri -Method POST -Body $body -ContentType 'application/x-www-form-urlencoded' | Out-Null
    Write-Host "Notifica Telegram inviata con successo" -ForegroundColor Green
} catch {
    Write-Host "Errore invio notifica Telegram: $($_.Exception.Message)" -ForegroundColor Red
}