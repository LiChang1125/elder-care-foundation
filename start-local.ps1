$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
try {
  $existing = Invoke-RestMethod -Uri 'http://localhost:5173/api/health' -TimeoutSec 3
  if ($existing.ok -and $existing.payments -eq $false) {
    Write-Host 'Elder Care is already running. Open http://localhost:5173'
    exit 0
  }
} catch { }
if (-not (Test-Path -LiteralPath (Join-Path $PSScriptRoot 'node_modules'))) {
  & npm.cmd ci
  if ($LASTEXITCODE -ne 0) { throw 'Dependency installation failed.' }
}
& npm.cmd run build
if ($LASTEXITCODE -ne 0) { throw 'Build failed.' }
Write-Host 'Open http://localhost:5173. Keep this window open; Ctrl+C stops the local server.'
& node.exe server/index.mjs --production
