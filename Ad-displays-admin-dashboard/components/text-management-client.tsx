"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Sparkles,
  Shapes as Shadow,
  Zap,
} from "lucide-react"

export function TextManagementClient() {
  const [text, setText] = useState("")
  const [overrideDisplay, setOverrideDisplay] = useState(false)
  const [activeStyles, setActiveStyles] = useState<Set<string>>(new Set())
  const [alignment, setAlignment] = useState<string>("left")
  const [fontSize, setFontSize] = useState<number>(48)
  const [textColor, setTextColor] = useState("#ffffff")
  const [backgroundColor, setBackground] = useState("#000000")
  const [activeEffects, setActiveEffects] = useState<Set<string>>(new Set())

  const textStyles = [
    { icon: Bold, label: "Bold", key: "bold" },
    { icon: Italic, label: "Italic", key: "italic" },
    { icon: Underline, label: "Underline", key: "underline" },
  ]

  const alignmentOptions = [
    { icon: AlignLeft, label: "Left", key: "left" },
    { icon: AlignCenter, label: "Center", key: "center" },
    { icon: AlignRight, label: "Right", key: "right" },
  ]

  const effectOptions = [
    { icon: Sparkles, label: "Glow Effect", color: "text-cyan-400", key: "glow" },
    { icon: Shadow, label: "Drop Shadow", color: "text-purple-400", key: "shadow" },
    { icon: Zap, label: "Neon Effect", color: "text-yellow-400", key: "neon" },
    { icon: Palette, label: "Gradient Text", color: "text-pink-400", key: "gradient" },
  ]

  const toggleStyle = (styleKey: string) => {
    const newStyles = new Set(activeStyles)
    if (newStyles.has(styleKey)) {
      newStyles.delete(styleKey)
    } else {
      newStyles.add(styleKey)
    }
    setActiveStyles(newStyles)
  }

  const toggleEffect = (effectKey: string) => {
    const newEffects = new Set(activeEffects)
    if (newEffects.has(effectKey)) {
      newEffects.delete(effectKey)
    } else {
      newEffects.add(effectKey)
    }
    setActiveEffects(newEffects)
  }

  const getPreviewStyle = () => {
    const style: React.CSSProperties = {
      fontSize: `${fontSize}px`,
      color: textColor,
      backgroundColor: backgroundColor,
      textAlign: alignment as any,
      fontWeight: activeStyles.has("bold") ? "bold" : "normal",
      fontStyle: activeStyles.has("italic") ? "italic" : "normal",
      textDecoration: activeStyles.has("underline") ? "underline" : "none",
    }

    if (activeEffects.has("glow")) {
      style.textShadow = `0 0 10px ${textColor}, 0 0 20px ${textColor}, 0 0 30px ${textColor}`
    } else if (activeEffects.has("shadow")) {
      style.textShadow = "2px 2px 4px rgba(0,0,0,0.5)"
    } else if (activeEffects.has("neon")) {
      style.textShadow = `0 0 5px ${textColor}, 0 0 10px ${textColor}, 0 0 15px ${textColor}, 0 0 20px ${textColor}`
    }

    if (activeEffects.has("gradient")) {
      style.background = "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)"
      style.WebkitBackgroundClip = "text"
      style.WebkitTextFillColor = "transparent"
      style.backgroundClip = "text"
    }

    return style
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Text Input Section */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5 text-primary" />
            Text Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="text-input" className="text-sm font-medium">
              Display Text
            </Label>
            <Textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the text to display on screens..."
              className="min-h-32 mt-2 bg-background/50 backdrop-blur-sm border-2 border-border focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              className="border-primary"
              id="override-display"
              checked={overrideDisplay}
              onCheckedChange={(checked) => setOverrideDisplay(checked === true)}
            />
            <Label htmlFor="override-display" className="text-sm font-medium">
              Override Display
            </Label>
            <span className="text-xs text-muted-foreground">(Replace current content on selected displays)</span>
          </div>
        </CardContent>
      </Card>

      {/* Text Styling Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Styling */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Text Styling</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-3 block">Font Style</Label>
              <div className="flex gap-2">
                {textStyles.map((style) => {
                  const Icon = style.icon
                  return (
                    <Button
                      key={style.key}
                      variant={activeStyles.has(style.key) ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => toggleStyle(style.key)}
                    >
                      <Icon className="h-4 w-4 mr-1" />
                      {style.label}
                    </Button>
                  )
                })}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Text Alignment</Label>
              <div className="flex gap-2">
                {alignmentOptions.map((option) => {
                  const Icon = option.icon
                  return (
                    <Button
                      key={option.key}
                      variant={alignment === option.key ? "default" : "outline"}
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => setAlignment(option.key)}
                    >
                      <Icon className="h-4 w-4 mr-1" />
                      {option.label}
                    </Button>
                  )
                })}
              </div>
            </div>

            <div>
              <Label htmlFor="font-size" className="text-sm font-medium">
                Font Size
              </Label>
              <Input
                id="font-size"
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="mt-2"
                min="12"
                max="200"
              />
            </div>
          </CardContent>
        </Card>

        {/* Custom Effects */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Custom Effects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-3 block">Visual Effects</Label>
              <div className="grid grid-cols-2 gap-2">
                {effectOptions.map((effect) => {
                  const Icon = effect.icon
                  return (
                    <Button
                      key={effect.key}
                      variant={activeEffects.has(effect.key) ? "default" : "outline"}
                      size="sm"
                      className="justify-start hover:bg-primary/10 bg-transparent"
                      onClick={() => toggleEffect(effect.key)}
                    >
                      <Icon className={`h-4 w-4 mr-2 ${effect.color}`} />
                      {effect.label}
                    </Button>
                  )
                })}
              </div>
            </div>

            <div>
              <Label htmlFor="text-color" className="text-sm font-medium">
                Text Color
              </Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="text-color"
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-16 h-10 p-1 border-2"
                />
                <Input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="background-color" className="text-sm font-medium">
                Background Color
              </Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="background-color"
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackground(e.target.value)}
                  className="w-16 h-10 p-1 border-2"
                />
                <Input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackground(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview and Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="min-h-32 bg-muted/30 rounded-lg border-2 border-dashed border-border flex items-center justify-center p-6">
            {text ? (
              <div className="text-center w-full">
                <p style={getPreviewStyle()}>{text}</p>
                <p className="text-sm text-muted-foreground mt-2">Preview with current styling</p>
              </div>
            ) : (
              <p className="text-muted-foreground">Enter text above to see preview</p>
            )}
          </div>

          <div className="flex gap-3">
            <Button className="flex-1" disabled={!text}>
              Apply to Selected Displays
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
