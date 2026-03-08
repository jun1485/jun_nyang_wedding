# gallery 썸네일 생성 스크립트 - public/gallery 원본을 480px 기준으로 축소 저장 사용
param(
  [string]$SourceDir = "public/gallery",
  [string]$TargetDir = "public/gallery/thumbs",
  [int]$TargetWidth = 480,
  [int]$JpegQuality = 82
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$resolvedSourceDir = Resolve-Path $SourceDir
$resolvedTargetDir = Join-Path $resolvedSourceDir "thumbs"

if ($TargetDir -ne "public/gallery/thumbs") {
  $resolvedTargetDir = $TargetDir
}

[System.IO.Directory]::CreateDirectory($resolvedTargetDir) | Out-Null

$jpegEncoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq "image/jpeg" } |
  Select-Object -First 1

Get-ChildItem -Path $resolvedSourceDir -File |
  Where-Object { $_.Extension -match "^\.(jpg|jpeg|png|webp)$" } |
  ForEach-Object {
    $sourcePath = $_.FullName
    $targetPath = Join-Path $resolvedTargetDir $_.Name
    $image = [System.Drawing.Image]::FromFile($sourcePath)

    try {
      $scale = $TargetWidth / $image.Width
      if ($scale -gt 1) {
        $scale = 1
      }

      $actualWidth = [int][Math]::Round($image.Width * $scale)
      $actualHeight = [int][Math]::Round($image.Height * $scale)
      $bitmap = New-Object System.Drawing.Bitmap($actualWidth, $actualHeight)
      $graphics = [System.Drawing.Graphics]::FromImage($bitmap)

      $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $graphics.DrawImage($image, 0, 0, $actualWidth, $actualHeight)

      if ($jpegEncoder -and $_.Extension -match "^\.(jpg|jpeg)$") {
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
          [System.Drawing.Imaging.Encoder]::Quality,
          [long]$JpegQuality
        )
        $bitmap.Save($targetPath, $jpegEncoder, $encoderParams)
        $encoderParams.Dispose()
      }
      else {
        $bitmap.Save($targetPath, $image.RawFormat)
      }

      $graphics.Dispose()
      $bitmap.Dispose()
    }
    finally {
      $image.Dispose()
    }
  }

Write-Output "[갤러리] 썸네일 생성 완료"
