param(
    [string]$EdgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$html = Join-Path $root "docs\relatorio-tecnico.html"
$outputDirectory = Join-Path $root "output\pdf"
$pdf = Join-Path $outputDirectory "Relatorio-Tecnico-UESPIMerito.pdf"
$profile = Join-Path $root "tmp\edge-report-profile"

if (-not (Test-Path -LiteralPath $EdgePath)) {
    throw "Microsoft Edge nao encontrado em: $EdgePath"
}

New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null
New-Item -ItemType Directory -Force -Path $profile | Out-Null
$uri = [System.Uri]::new($html).AbsoluteUri

if (Test-Path -LiteralPath $pdf) {
    Remove-Item -LiteralPath $pdf -Force
}

$arguments = @(
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--print-to-pdf=$pdf",
    "--user-data-dir=$profile",
    $uri
)
$process = Start-Process -FilePath $EdgePath -ArgumentList $arguments -WindowStyle Hidden -Wait -PassThru
if ($process.ExitCode -ne 0 -or -not (Test-Path -LiteralPath $pdf)) {
    throw "Falha ao gerar o relatorio PDF. Codigo: $($process.ExitCode)"
}

Write-Output $pdf
