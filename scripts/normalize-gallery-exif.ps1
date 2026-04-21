# 갤러리 원본 이미지의 EXIF orientation 을 픽셀에 적용하고 메타데이터 제거 - production Vercel Image Optimization 의 EXIF 미적용 이슈 해결용
param(
  [string]$SourceDir = "public/gallery",
  [int]$JpegQuality = 92
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$resolvedSourceDir = Resolve-Path $SourceDir

$jpegEncoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq "image/jpeg" } |
  Select-Object -First 1

# EXIF orientation 값을 RotateFlipType 으로 매핑
function Get-ExifRotateFlip {
  param([System.Drawing.Image]$Image)

  $orientationId = 0x0112
  $hasOrientation = $Image.PropertyIdList -contains $orientationId
  if (-not $hasOrientation) {
    return @{ RotateFlip = [System.Drawing.RotateFlipType]::RotateNoneFlipNone; HasTag = $false }
  }

  $orientationValue = $Image.GetPropertyItem($orientationId).Value[0]
  $rotateFlip = switch ($orientationValue) {
    2 { [System.Drawing.RotateFlipType]::RotateNoneFlipX }
    3 { [System.Drawing.RotateFlipType]::Rotate180FlipNone }
    4 { [System.Drawing.RotateFlipType]::Rotate180FlipX }
    5 { [System.Drawing.RotateFlipType]::Rotate90FlipX }
    6 { [System.Drawing.RotateFlipType]::Rotate90FlipNone }
    7 { [System.Drawing.RotateFlipType]::Rotate270FlipX }
    8 { [System.Drawing.RotateFlipType]::Rotate270FlipNone }
    default { [System.Drawing.RotateFlipType]::RotateNoneFlipNone }
  }

  return @{ RotateFlip = $rotateFlip; HasTag = $true }
}

$processedCount = 0
$skippedCount = 0

Get-ChildItem -Path $resolvedSourceDir -File |
  Where-Object { $_.Extension -match "^\.(jpg|jpeg)$" } |
  ForEach-Object {
    $sourcePath = $_.FullName
    $image = [System.Drawing.Image]::FromFile($sourcePath)

    try {
      $exifInfo = Get-ExifRotateFlip -Image $image

      if (-not $exifInfo.HasTag) {
        $skippedCount++
        return
      }

      if ($exifInfo.RotateFlip -eq [System.Drawing.RotateFlipType]::RotateNoneFlipNone) {
        $skippedCount++
        return
      }

      $image.RotateFlip($exifInfo.RotateFlip)

      $width = $image.Width
      $height = $image.Height
      $bitmap = New-Object System.Drawing.Bitmap($width, $height)
      $graphics = [System.Drawing.Graphics]::FromImage($bitmap)

      $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $graphics.DrawImage($image, 0, 0, $width, $height)

      $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
      $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
        [System.Drawing.Imaging.Encoder]::Quality,
        [long]$JpegQuality
      )

      $graphics.Dispose()
      $image.Dispose()
      $image = $null

      $tempPath = "$sourcePath.tmp"
      $bitmap.Save($tempPath, $jpegEncoder, $encoderParams)
      $bitmap.Dispose()
      $encoderParams.Dispose()

      Move-Item -Path $tempPath -Destination $sourcePath -Force
      Write-Output "  [normalize] $($_.Name)"
      $processedCount++
    }
    finally {
      if ($null -ne $image) {
        $image.Dispose()
      }
    }
  }

Write-Output "[갤러리] EXIF 정립 완료: 처리 $processedCount 개, 스킵 $skippedCount 개"
