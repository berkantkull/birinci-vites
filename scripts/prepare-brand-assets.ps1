Add-Type -AssemblyName System.Drawing

$sourceRoot = 'C:\Users\Berkant\OneDrive\Belgeler\birincivites'
$assetRoot = 'C:\Users\Berkant\OneDrive\Belgeler\helloworld\assets'
$brandRoot = Join-Path $assetRoot 'brand'
New-Item -ItemType Directory -Force -Path $brandRoot | Out-Null

$sources = @{
  LogoGradient = Join-Path $sourceRoot 'ChatGPT Görseli 1 Eki 2026 15_30_51-1.png'
  AppIcon = Join-Path $sourceRoot 'ChatGPT Görseli 1 Eki 2026 15_30_51-2.png'
  Mark = Join-Path $sourceRoot 'ChatGPT Görseli 1 Eki 2026 15_30_52-3.png'
  LogoSolid = Join-Path $sourceRoot 'ChatGPT Görseli 1 Eki 2026 15_30_53-4.png'
  LogoDark = Join-Path $sourceRoot 'ChatGPT Görseli 1 Eki 2026 15_30_54-5.png'
  Wordmark = Join-Path $sourceRoot 'ChatGPT Görseli 1 Eki 2026 15_30_56-6.png'
}

$copies = @{
  LogoGradient = 'logo-gradient-source.png'
  AppIcon = 'app-icon-source.png'
  Mark = 'mark-source.png'
  LogoSolid = 'logo-solid.png'
  LogoDark = 'logo-dark.png'
  Wordmark = 'wordmark.png'
}
foreach ($key in $copies.Keys) {
  Copy-Item -LiteralPath $sources[$key] -Destination (Join-Path $brandRoot $copies[$key]) -Force
}

function New-Canvas([int]$width, [int]$height, [string]$color = $null) {
  $bitmap = [System.Drawing.Bitmap]::new($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
  if ($color) { $graphics.Clear([System.Drawing.ColorTranslator]::FromHtml($color)) }
  else { $graphics.Clear([System.Drawing.Color]::Transparent) }
  $graphics.Dispose()
  return $bitmap
}

function Set-Quality($graphics) {
  $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceOver
  $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
}

function Save-Image($sourcePath, $destinationPath, $width, $height, $destX, $destY, $destWidth, $destHeight, $srcX, $srcY, $srcWidth, $srcHeight, $background = $null, $monochrome = $false) {
  $source = [System.Drawing.Bitmap]::new($sourcePath)
  $canvas = New-Canvas $width $height $background
  $graphics = [System.Drawing.Graphics]::FromImage($canvas)
  Set-Quality $graphics
  $destination = [System.Drawing.Rectangle]::new($destX, $destY, $destWidth, $destHeight)
  $sourceRect = [System.Drawing.Rectangle]::new($srcX, $srcY, $srcWidth, $srcHeight)
  if ($monochrome) {
    $matrix = [System.Drawing.Imaging.ColorMatrix]::new(@(
      [single[]]@(0,0,0,0,0),
      [single[]]@(0,0,0,0,0),
      [single[]]@(0,0,0,0,0),
      [single[]]@(0,0,0,1,0),
      [single[]]@(0,0,0,0,1)
    ))
    $attributes = [System.Drawing.Imaging.ImageAttributes]::new()
    $attributes.SetColorMatrix($matrix)
    $graphics.DrawImage($source, $destination, $srcX, $srcY, $srcWidth, $srcHeight, [System.Drawing.GraphicsUnit]::Pixel, $attributes)
    $attributes.Dispose()
  } else {
    $graphics.DrawImage($source, $destination, $sourceRect, [System.Drawing.GraphicsUnit]::Pixel)
  }
  $graphics.Dispose()
  $canvas.Save($destinationPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $canvas.Dispose()
  $source.Dispose()
}

# Tight horizontal logo for the app header and README.
Save-Image $sources.LogoGradient (Join-Path $brandRoot 'logo-horizontal.png') 760 162 0 0 760 162 96 140 1980 421

# Store and launcher icon; the supplied warm background remains intact.
Save-Image $sources.AppIcon (Join-Path $assetRoot 'icon.png') 1024 1024 0 0 1024 1024 0 0 1254 1254

# Adaptive Android mark, monochrome system mark, web favicon and splash mark.
$markCrop = @(140, 250, 980, 750)
Save-Image $sources.Mark (Join-Path $assetRoot 'android-icon-foreground.png') 1024 1024 172 252 680 520 $markCrop[0] $markCrop[1] $markCrop[2] $markCrop[3]
Save-Image $sources.Mark (Join-Path $assetRoot 'android-icon-monochrome.png') 1024 1024 172 252 680 520 $markCrop[0] $markCrop[1] $markCrop[2] $markCrop[3] $null $true
$background = New-Canvas 1024 1024 '#F3F5F0'
$background.Save((Join-Path $assetRoot 'android-icon-background.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$background.Dispose()
Save-Image $sources.Mark (Join-Path $assetRoot 'favicon.png') 64 64 3 10 58 44 $markCrop[0] $markCrop[1] $markCrop[2] $markCrop[3]
Save-Image $sources.Mark (Join-Path $assetRoot 'splash-icon.png') 1024 1024 202 274 620 475 $markCrop[0] $markCrop[1] $markCrop[2] $markCrop[3]
