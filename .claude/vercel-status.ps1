# Vercel Status Line for LorenzoSainiArt
param()

# Read JSON input from stdin
$input = [Console]::In.ReadToEnd() | ConvertFrom-Json -ErrorAction SilentlyContinue

# Get current directory info
$currentDir = if ($input.workspace.current_dir) { $input.workspace.current_dir } else { Get-Location }
$projectName = Split-Path $currentDir -Leaf

# Vercel API credentials
$token = "ohEn9lBeMbjSFA3jlR0OGDGH"
$projectId = "prj_Md1uI2ix9Ys83aDwVDVtkQUvFopM"

try {
    # Get latest deployment
    $uri = "https://api.vercel.com/v6/deployments?projectId=$projectId&limit=1"
    $headers = @{Authorization = "Bearer $token"}
    $response = Invoke-RestMethod -Uri $uri -Headers $headers -TimeoutSec 5
    
    if ($response.deployments -and $response.deployments.Count -gt 0) {
        $deploy = $response.deployments[0]
        $state = $deploy.state
        $url = $deploy.url.Substring(0, [Math]::Min(20, $deploy.url.Length))
        $created = [DateTimeOffset]::FromUnixTimeMilliseconds($deploy.created)
        $ago = [Math]::Floor(([DateTimeOffset]::Now - $created).TotalMinutes)
        $timeAgo = "${ago}m ago"
        
        # Status with symbols
        switch ($state) {
            'READY' { Write-Output "[OK] Vercel Ready | Web: $url | Time: $timeAgo | Dir: $projectName" }
            'BUILDING' { Write-Output "[...] Vercel Building | Web: $url | Time: $timeAgo | Dir: $projectName" }
            'QUEUED' { Write-Output "[WAIT] Vercel Queued | Web: $url | Time: $timeAgo | Dir: $projectName" }
            'ERROR' { Write-Output "[ERR] Vercel Error | Web: $url | Time: $timeAgo | Dir: $projectName" }
            default { Write-Output "[?] Vercel Unknown | Web: $url | Time: $timeAgo | Dir: $projectName" }
        }
    } else {
        Write-Output "[EMPTY] Vercel No deploys | Dir: $projectName"
    }
} catch {
    Write-Output "[OFF] Vercel Offline | Dir: $projectName"
}